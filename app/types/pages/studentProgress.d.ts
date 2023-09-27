export interface DocxTemplateError {
    name: string;
    message: string;
    stack: string;
    properties: {
        id: string;
        explanation: string;
        xtag: string;
        offset: number;
        file: string;
    };
}

