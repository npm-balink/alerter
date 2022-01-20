import { AlertLevel } from './alert';

export interface AlerterConfig {
  emailConfig?: EmailConfig;
  jiraConfig?: JiraConfig;
  trelloConfig?: TrelloConfig;
}

export interface EmailSubscriber {
  email: string;
  hasSubscribedTo: AlertLevel;
}

export interface EmailConfig {
  credentials: {
    service: string;
    username: string;
    password: string;
  };
  subscribers: EmailSubscriber[];
}

export interface JiraConfig {
  host: string;
  username: string;
  password: string;
  projectKey: string;
}

export interface TrelloConfig {
  apiKey: string;
  access_token: string;
  idList: string;
  tagsMapping: Record<string, string>;
}
