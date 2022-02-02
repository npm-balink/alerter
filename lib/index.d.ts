import { Alert, AlertLevel } from './alert';
import { AlertOptions } from './AlertOptions';
import { AlerterConfig } from './alerterConfig';
export declare const Greeter: (name: string) => string;
declare class Alerter {
    private readonly config;
    constructor(config: AlerterConfig);
    alert(alert: Alert, options: AlertOptions): Promise<[PromiseSettledResult<any>, PromiseSettledResult<any>, PromiseSettledResult<any>]>;
    /**
     * 1.Produces a call to TRELLO.
     * 2.Creates a ticket according to the related alert.
     * @param alert - The alert object (contain the relevant info of the alert).
     * @param trelloConfig - The required configuration to trello.
     * @returns The response of the creation of the ticket.
     *          in case the trelloConfig is undefuned -> null .
     */
    private createTrelloTicket;
    /**
     * 1.Produces a call to JIRA.
     * 2.Creates a ticket according to the related alert.
     * @param alert - The alert object (contain the relevant info of the alert).
     * @param jiraConfig -The required configuration to jira.
     */
    private createJiraIssue;
    /**
     * 1.Produces a connection to the MAIL SERVICE.
     * 2.Sends an Email according to the related alert.
     * @param alert - The alert object (contain the relevant info of the alert).
     * @param mailConfig - The required configuration to the current mail service.
     */
    private sendAlertEmail;
    /**
     * This utility function gives an array of the relevant mailing lists.
     * Whoever has an alert rank >= than the 'level' of the alert- will be
     * included in the array, so will receive an email.
     * @param level - The alert level.
     * @param emailCongig - The list of people, we will return from it only the
     *                      people who need to receive the email.
     * @returns
     */
    private createEmailList;
}
export default Alerter;
export { AlerterConfig, AlertLevel, Alert, AlertOptions };
