import { HydratedDocument } from 'mongoose';
export type KnowledgeArticleDocument = HydratedDocument<KnowledgeArticle>;
export declare class KnowledgeArticle {
    title: string;
    summary: string;
    structuredSteps: string[];
    originalContent: string;
    category: string;
    sourceFileUrl: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const KnowledgeArticleSchema: any;
