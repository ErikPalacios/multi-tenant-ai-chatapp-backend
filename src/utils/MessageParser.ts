export interface ParsedMessage {
    code?: string;
    text: string;
}

export class MessageParser {
    /**
     * Separates the message into a code and actual text if a colon is present.
     * Pattern: "code: message"
     */
    static parse(rawText: string): ParsedMessage {
        if (!rawText.includes(':')) {
            return { text: rawText.trim() };
        }

        const parts = rawText.split(':');
        const code = parts[0]?.trim();
        const actualText = parts.slice(1).join(':').trim();

        return {
            code,
            text: actualText
        };
    }
}
