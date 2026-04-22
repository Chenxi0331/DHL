export declare class GeminiService {
    private readonly logger;
    private readonly ai;
    constructor();
    generateStructuredSOP(text?: string, imageBuffer?: Buffer, mimeType?: string): Promise<{
        title: string;
        summary: string;
        structuredSteps: string[];
        category: string;
    }>;
}
