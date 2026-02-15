import { describe, it, expect } from 'vitest';
import { MessageParser } from './MessageParser.js';

describe('MessageParser', () => {
    it('should parse a message with a code', () => {
        const rawText = 'CONF001: Hello, I would like to confirm my appointment';
        const result = MessageParser.parse(rawText);
        expect(result).toEqual({
            code: 'CONF001',
            text: 'Hello, I would like to confirm my appointment'
        });
    });

    it('should parse a message without a code', () => {
        const rawText = 'Hello, how are you?';
        const result = MessageParser.parse(rawText);
        expect(result).toEqual({
            text: 'Hello, how are you?'
        });
    });

    it('should handle multiple colons by treating the first as the separator', () => {
        const rawText = 'API:KEY: value:extra';
        const result = MessageParser.parse(rawText);
        expect(result).toEqual({
            code: 'API',
            text: 'KEY: value:extra'
        });
    });

    it('should trim whitespace from code and text', () => {
        const rawText = '  CODE  :   Message content   ';
        const result = MessageParser.parse(rawText);
        expect(result).toEqual({
            code: 'CODE',
            text: 'Message content'
        });
    });
});
