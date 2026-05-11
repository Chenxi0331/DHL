export interface KnowledgeArticle {
  _id: string;
  title: string;
  summary?: string;
  originalContent: string;
  structuredSteps: string[];
  category?: string;
  sourceFileUrl?: string;
  status: string;
  sourceType: string;
  createdAt: string;
}
