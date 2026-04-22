import { HydratedDocument } from 'mongoose';
export type KnowledgeArticleDocument = HydratedDocument<KnowledgeArticle>;
export declare class KnowledgeArticle {
    title: string;
    summary: string;
    structuredSteps: string[];
    originalContent: string;
    category: string;
    sourceFileUrl: string;
    status: string;
    sourceType: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const KnowledgeArticleSchema: import("mongoose").Schema<KnowledgeArticle, import("mongoose").Model<KnowledgeArticle, any, any, any, import("mongoose").Document<unknown, any, KnowledgeArticle, any, {}> & KnowledgeArticle & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, KnowledgeArticle, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<KnowledgeArticle>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<KnowledgeArticle> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
