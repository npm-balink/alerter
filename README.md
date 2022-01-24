[![view on npm](https://badgen.net/npm/v/@balinkltd/alerter)](https://www.npmjs.com/package/@balinkltd/alerter)
[![npm module downloads](https://badgen.net/npm/dt/@balinkltd/alerter)](https://www.npmjs.com/package/@balinkltd/alerter)
[![Gihub repo dependents](https://badgen.net/github/dependents-repo/npm-balink/alerter)](https://github.com/npm-balink/alerter)

# ⚠️ Alerter

#### What is Alerter?

Alerter is a module that responsible for alerting in case there is an unusual problem in the project.

He is responsible for providing an informative explanation of the problem for the following channels:

1. **Email**- Send emails (according to the severity of the problem) to the relevant people in order for them to be aware of the problem.
2. **Jira** - Open issue in jira.
3. **Trello** - Open a relevant tick in trello.

## Install

```
    $ npm i @balinkltd/alerter
```

## Usage

#### Import

```TypeScript
import Alerter, { AlerterConfig, AlertLevel } from '@balinkltd/alerter';
```

#### Edit configuration

This code defines the communication channels with which the module will communicate in case of a problem

```TypeScript
 const config: AlerterConfig = {
            emailConfig: {
                credentials: {
                    service: 'email service name(Gmail,Outlook,ProtonMail, etc.)',
                    username: 'example@.example.com',
                    password: 'password',
                },
                subscribers: [
                    {
                        email: 'example@.example.com',
                        hasSubscribedTo: AlertLevel.LOW,
                    },
                ],
            },
            jiraConfig: {
                host: 'hostName.net',
                username: 'example@.example.com',
                password: 'password',
                projectKey: 'projectKey',
            },
             trelloConfig: {
                 apiKey: 'theApiKey',
                 access_token:
                     'theAccess_token',
                 idList: 'theListId',
                tagsMapping :['tagId1','tagId2']
            },
        };
 };

```

#### Create Alert

This code create an Alerter object and insert the explanation of the relevant error.

> 👉 You have the option to decide whether to use all or only some of the communication channels.
>  

```{.TypeScript .numberLines .lineAnchors}
  const alerter = new Alerter(config);

    alerter.alert(
        {
            projectName: 'projectName',
            date: 'Sun Jan 23 2022 14:14:24 GMT+0200 (Israel Standard Time)',
            level: AlertLevel.CRITICAL,
            description: 'this alert has been created due to...',
            subject: 'alert subject',
            env: 'the environment in which it occurred',
            region: 'the region in which it occurred',
        },
        { sendEmail: true, createJiraTicket: true, createTrelloTicket: true }
    );

```

[Go To TOP](#TOP)

&copy; 2021 Balink .
