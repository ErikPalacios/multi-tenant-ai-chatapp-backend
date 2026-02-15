export function MessageText(textResponse: string, number: string) {
    return {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": number,
        "type": "text",
        "text": {
            "preview_url": false,
            "body": textResponse
        }
    };
}

export function MessageButton(waId: string, text: string, buttons: string[]) {
    return {
        "body": text,
        "buttons": buttons.map(btn => ({
            "text": btn
        }))
    };
}

export function MessageList(waId: string, text: string, title: string, buttonText: string, rows: { title: string, description?: string }[]) {
    return {
        "header": "",
        "body": text,
        "footer": "",
        "buttonText": buttonText,
        "sections": [
            {
                "title": title,
                "rows": rows
            }
        ]
    };
}


