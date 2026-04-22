export interface KnowledgeArticle {
  _id: string;
  title: string;
  originalContent: string;
  structuredSteps: string[];
  category?: string;
  sourceFileUrl?: string;
  createdAt: string;
}
