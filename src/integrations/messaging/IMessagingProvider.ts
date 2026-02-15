export interface IMessagingProvider {
    sendMessage(waId: string, text: string): Promise<void>;
    sendButtons(waId: string, text: string, buttons: string[]): Promise<void>;
    sendList(waId: string, text: string, title: string, buttonText: string, rows: { title: string, description?: string }[]): Promise<void>;
}
