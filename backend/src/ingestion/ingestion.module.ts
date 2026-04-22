import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IngestionController } from './ingestion.controller';
import { GeminiService } from './gemini.service';
import { KnowledgeArticle, KnowledgeArticleSchema } from './schemas/knowledge-article.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: KnowledgeArticle.name, schema: KnowledgeArticleSchema }]),
  ],
  controllers: [IngestionController],
  providers: [GeminiService],
})
export class IngestionModule {}
