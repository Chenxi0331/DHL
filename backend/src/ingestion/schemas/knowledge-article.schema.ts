import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type KnowledgeArticleDocument = HydratedDocument<KnowledgeArticle>;

@Schema({ timestamps: true })
export class KnowledgeArticle {
  @Prop({ required: true })
  title: string;

  @Prop()
  summary: string;

  @Prop({ type: [String], default: [] })
  structuredSteps: string[];

  @Prop({ required: true })
  originalContent: string; // Raw input before AI formatting

  @Prop()
  category: string;

  @Prop()
  sourceFileUrl: string; // The URL/path of original image or screenshot

  @Prop({ enum: ['Draft', 'Verified'], default: 'Draft' })
  status: string;

  @Prop({ enum: ['Email', 'Chat', 'Manual', 'Other'], default: 'Manual' })
  sourceType: string;

  @Prop()
  createdAt: Date;
  
  @Prop()
  updatedAt: Date;
}

export const KnowledgeArticleSchema = SchemaFactory.createForClass(KnowledgeArticle);
