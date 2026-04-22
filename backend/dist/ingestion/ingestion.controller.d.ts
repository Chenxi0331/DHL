import { Model } from 'mongoose';
import { GeminiService } from './gemini.service';
import { KnowledgeArticle } from './schemas/knowledge-article.schema';
export declare class IngestionController {
    private readonly geminiService;
    private knowledgeArticleModel;
    private readonly logger;
    constructor(geminiService: GeminiService, knowledgeArticleModel: Model<KnowledgeArticle>);
    handleIngestion(file?: Express.Multer.File, text?: string, sourceType?: string): Promise<{
        status: string;
        message: string;
        data: import("mongoose").Document<unknown, {}, KnowledgeArticle, {}, {}> & KnowledgeArticle & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        };
    }>;
    searchArticles(q: string): Promise<(import("mongoose").Document<unknown, {}, KnowledgeArticle, {}, {}> & KnowledgeArticle & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
}
