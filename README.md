[![view on npm](https://badgen.net/npm/v/@balinkltd/alerter)](https://www.npmjs.com/package/@balinkltd/alerter)
[![npm module downloads](https://badgen.net/npm/dt/@balinkltd/alerter)](https://www.npmjs.com/package/@balinkltd/alerter)
[![Gihub repo dependents](https://badgen.net/github/dependents-repo/npm-balink/alerter)](https://github.com/npm-balink/alerter)

# Alerter

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
            emailConfig: {},
            jiraConfig: {},
            trelloConfig: {}
 };

```

#### Create Alert

This code create an Alerter object and insert the explanation of the relevant error.

In addition, defines whether to use all or only some of the communication channels.

```TypeScript
  const alerter = new Alerter(config);

    alerter.alert(
        {
            projectName: '',
            date: new Date(),
            level: AlertLevel,
            description: '',
            subject: '',
            env: '',
            region: '',
        },
        { sendEmail: true, createJiraTicket: true, createTrelloTicket: true }
    );

```

[Go To TOP](#TOP)

&copy; 2021 Balink .
