export const APP_NAME = "Proxymity v1.0";
export * from './types';
export * from './events';

export interface ITestMessage {
    text: string;
    from: 'SERVER' | 'CLIENT';
}