export function MessageText(number: string, textResponse: string) {
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

export function MessageButton(number: string, textResponse: string, buttons: string[]) {
    return {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": number,
        "type": "interactive",
        "interactive": {
            "type": "button",
            "body": {
                "text": textResponse
            },
            "action": {
                "buttons": buttons.map((btn, index) => ({
                    "type": "reply",
                    "reply": {
                        "id": `btn_${index}`,
                        "title": btn.length > 20 ? btn.substring(0, 17) + "..." : btn
                    }
                }))
            }
        }
    };
}

export function MessageList(number: string, textResponse: string, title: string, buttonText: string, rows: { title: string, description?: string }[]) {
    return {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": number,
        "type": "interactive",
        "interactive": {
            "type": "list",
            "body": {
                "text": textResponse
            },
            "action": {
                "button": buttonText.length > 20 ? buttonText.substring(0, 17) + "..." : buttonText,
                "sections": [
                    {
                        "title": title.length > 24 ? title.substring(0, 21) + "..." : title,
                        "rows": rows.map((row, index) => ({
                            "id": `row_${index}`,
                            "title": row.title.length > 24 ? row.title.substring(0, 21) + "..." : row.title,
                            "description": row.description ? (row.description.length > 72 ? row.description.substring(0, 69) + "..." : row.description) : undefined
                        }))
                    }
                ]
            }
        }
    };
}
