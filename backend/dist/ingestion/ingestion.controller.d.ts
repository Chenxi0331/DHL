import { Model } from 'mongoose';
import { GeminiService } from './gemini.service';
import { KnowledgeArticle } from './schemas/knowledge-article.schema';
export declare class IngestionController {
    private readonly geminiService;
    private knowledgeArticleModel;
    private readonly logger;
    constructor(geminiService: GeminiService, knowledgeArticleModel: Model<KnowledgeArticle>);
    handleIngestion(file?: Express.Multer.File, text?: string): Promise<{
        status: string;
        message: string;
        data: any;
    }>;
}
