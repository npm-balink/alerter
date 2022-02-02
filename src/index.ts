import { Alert, AlertLevel } from './alert';
import { AlertOptions } from './AlertOptions';
import * as TrelloNodeAPI from 'trello-node-api';
import { AlerterConfig, EmailConfig, EmailSubscriber, JiraConfig, TrelloConfig } from './alerterConfig';

import * as nodemailer from 'nodemailer';

import * as JiraClient from 'jira-client';
export const Greeter = (name: string) => `Hello ${name}`;

class Alerter {
  constructor(private readonly config: AlerterConfig) {}

  public async alert(alert: Alert, options: AlertOptions) {
    return await Promise.allSettled([
      options.sendEmail ? this.sendAlertEmail(alert, this.config.emailConfig) : null,
      options.createJiraTicket ? this.createJiraIssue(alert, this.config.jiraConfig) : null,
      options.createTrelloTicket ? this.createTrelloTicket(alert, this.config.trelloConfig) : null,
    ]);
  }

  /**
   * 1.Produces a call to TRELLO.
   * 2.Creates a ticket according to the related alert.
   * @param alert - The alert object (contain the relevant info of the alert).
   * @param trelloConfig - The required configuration to trello.
   * @returns The response of the creation of the ticket.
   *          in case the trelloConfig is undefuned -> null .
   */

  private createTrelloTicket(alert: Alert, trelloConfig: TrelloConfig | undefined) {
    if (trelloConfig === undefined || alert.tags === undefined) {
      return null;
    }

    const trello = new TrelloNodeAPI();
    trello.setApiKey(trelloConfig.apiKey);
    trello.setOauthToken(trelloConfig.access_token);

    const data = {
      name: createSubject(alert),
      desc: createMessage(alert),

      pos: 'top',
      idList: trelloConfig?.idList,

      idLabels: alert.tags.map((label: string) => trelloConfig.tagsMapping[label] || null).filter(Boolean),
      due: null,
      dueComplete: false,
      urlSource: 'https://api.trello.com/1/',
      fileSource: 'file',

      keepFromSource: 'attachments,checklists,comments,due,labels,members,stickers',
    };

    return trello.card
      .create(data)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw new Error('Trello ticket not created: ' + JSON.stringify(error));
      });
  }

  /**
   * 1.Produces a call to JIRA.
   * 2.Creates a ticket according to the related alert.
   * @param alert - The alert object (contain the relevant info of the alert).
   * @param jiraConfig -The required configuration to jira.
   */

  private async createJiraIssue(alert: Alert, jiraConfig: JiraConfig | undefined) {
    if (jiraConfig === undefined) {
      return;
    }
    const jira = new JiraClient({
      protocol: 'https',
      host: jiraConfig.host,
      username: jiraConfig.username,
      password: jiraConfig.password,
      apiVersion: '3',
      strictSSL: true,
    });

    return await jira
      .addNewIssue({
        fields: {
          project: {
            key: jiraConfig.projectKey,
          },
          summary: createSubject(alert),
          description: {
            version: 1,
            type: 'doc',
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: createMessage(alert),
                  },
                ],
              },
            ],
          },
          labels: [alert.env, alert.region],
          issuetype: {
            name: 'Task',
          },
        },
      })
      .then((response: any) => {
        return response;
      })
      .catch((error: any) => {
        throw new Error('Jira ticket not created: ' + JSON.stringify(error));
      });
  }

  /**
   * 1.Produces a connection to the MAIL SERVICE.
   * 2.Sends an Email according to the related alert.
   * @param alert - The alert object (contain the relevant info of the alert).
   * @param mailConfig - The required configuration to the current mail service.
   */

  private async sendAlertEmail(alert: Alert, mailConfig?: EmailConfig) {
    const transporter = nodemailer.createTransport({
      service: mailConfig?.credentials.service,
      auth: {
        user: mailConfig?.credentials.username,
        pass: mailConfig?.credentials.password,
      },
    });
    const emailList = this.createEmailList(alert.level, mailConfig?.subscribers || []);

    const mailOptions = {
      from: mailConfig?.credentials.username,
      to: emailList,
      subject: createSubject(alert),
      text: createMessage(alert),
    };

    return await transporter
      .sendMail(mailOptions)
      .then((response: any) => {
        return response;
      })
      .catch((error: any) => {
        throw new Error('Email not sent' + JSON.stringify(error));
      });
  }

  /**
   * This utility function gives an array of the relevant mailing lists.
   * Whoever has an alert rank >= than the 'level' of the alert- will be
   * included in the array, so will receive an email.
   * @param level - The alert level.
   * @param emailCongig - The list of people, we will return from it only the
   *                      people who need to receive the email.
   * @returns
   */

  private createEmailList(level: AlertLevel, subscribers: EmailSubscriber[]): string[] {
    return subscribers
      .filter((sub: EmailSubscriber) => sub.hasSubscribedTo <= level)
      .map((sub: EmailSubscriber) => sub.email);
  }
}

function createSubject(alert: Alert): string {
  return `[${AlertLevel[alert.level]}] in ${alert.projectName} (Region: ${
    alert.region
  }) (Environment: ${alert.env}) - ${alert.subject} [${alert.date.toISOString()}] `;
}

function createMessage(alert: Alert) {
  return (
    '\n alert level: ' +
    AlertLevel[alert.level] +
    '\n description: ' +
    alert.description +
    '\n in env: ' +
    alert.env +
    '\n and in region:' +
    alert.region
  );
}

export default Alerter;
export { AlerterConfig, AlertLevel, Alert, AlertOptions};
