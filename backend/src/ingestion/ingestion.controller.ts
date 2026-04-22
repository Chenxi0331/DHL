import { Controller, Post, UseInterceptors, UploadedFile, Body, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GeminiService } from './gemini.service';
import { KnowledgeArticle } from './schemas/knowledge-article.schema';

@Controller('ingest')
export class IngestionController {
  private readonly logger = new Logger(IngestionController.name);

  constructor(
    private readonly geminiService: GeminiService,
    @InjectModel(KnowledgeArticle.name) private knowledgeArticleModel: Model<KnowledgeArticle>,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file')) // Expects multipart/form-data with 'file' and optionally 'text'
  async handleIngestion(
    @UploadedFile() file?: Express.Multer.File,
    @Body('text') text?: string,
  ) {
    try {
      if (!file && !text) {
        throw new HttpException('Must provide either a file or text content', HttpStatus.BAD_REQUEST);
      }

      this.logger.log(`Received ingestion request. File exists: ${!!file}, Text exists: ${!!text}`);

      // 1. Process multimodal payload via Gemini to get structured JSON
      const imageBuffer = file?.buffer;
      const mimeType = file?.mimetype;
      
      const structuredData = await this.geminiService.generateStructuredSOP(text, imageBuffer, mimeType);
      
      // 2. Save the result to MongoDB
      const rawContent = text || (file ? `[Uploaded file: ${file.originalname}]` : 'Raw input');
      
      const newArticle = new this.knowledgeArticleModel({
        title: structuredData.title,
        summary: structuredData.summary,
        category: structuredData.category,
        structuredSteps: structuredData.structuredSteps,
        originalContent: rawContent,
        // (Optional) Integrate with S3/GCS here and save remote URL
        sourceFileUrl: file ? file.originalname : null,
      });

      const savedArticle = await newArticle.save();

      // 3. Return the created document status
      return {
        status: 'success',
        message: 'Successfully generated and persisted SOP from raw input.',
        data: savedArticle
      };
    } catch (error) {
      this.logger.error('Failed to process ingestion', error);
      throw new HttpException(
        {
          status: 'error',
          message: error.message || 'Internal server error during ingestion',
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
