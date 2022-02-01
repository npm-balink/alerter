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
export declare enum AlertLevel {
    LOW = 0,
    MEDIUM = 1,
    HIGH = 2,
    CRITICAL = 3
}
