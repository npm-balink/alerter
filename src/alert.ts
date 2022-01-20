export interface Alert {
    projectName: string;
    date: Date;
    level: AlertLevel;
    description: string;
    subject: string;
    env: string;
    region: string;
    tags?: string[];
}

export enum AlertLevel {
    LOW,
    MEDIUM,
    HIGH,
    CRITICAL,
}
