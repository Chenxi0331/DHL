import { Controller, Post, UseInterceptors, UploadedFile, Body, Logger, HttpException, HttpStatus, Get, Query, UseGuards, Put, Param, Delete } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GeminiService } from './gemini.service';
import { KnowledgeArticle } from './schemas/knowledge-article.schema';
import { AuthGuard } from '../auth/auth.guard';

@Controller('ingest')
// @UseGuards(AuthGuard)
export class IngestionController {
  private readonly logger = new Logger(IngestionController.name);

  constructor(
    private readonly geminiService: GeminiService,
    @InjectModel(KnowledgeArticle.name) private knowledgeArticleModel: Model<KnowledgeArticle>,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file')) // Expects multipart/form-data with 'file' and optionally 'text'
  async handleIngestion(
    @UploadedFile() file?: any,
    @Body('text') text?: string,
    @Body('sourceType') sourceType?: string,
  ) {
    try {
      if (!file && !text) {
        throw new HttpException('Must provide either a file or text content', HttpStatus.BAD_REQUEST);
      }

      this.logger.log(`Received ingestion request. File exists: ${!!file}, Text exists: ${!!text}`);

      // 1. Process multimodal payload via Gemini to get structured JSON
      const imageBuffer = file?.buffer;
      let mimeType = file?.mimetype;

      if (mimeType === 'application/octet-stream' && file?.originalname) {
        const ext = file.originalname.split('.').pop()?.toLowerCase();
        if (ext === 'txt') mimeType = 'text/plain';
        else if (ext === 'png') mimeType = 'image/png';
        else if (ext === 'jpg' || ext === 'jpeg') mimeType = 'image/jpeg';
        else if (ext === 'pdf') mimeType = 'application/pdf';
      }
      
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
        sourceType: sourceType || 'Manual',
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
          message: (error as Error).message || 'Internal server error during ingestion',
        },
        (error as any).status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('search')
  async searchArticles(@Query('q') q: string) {
    try {
      if (!q) {
        return await this.knowledgeArticleModel.find().sort({ createdAt: -1 }).exec();
      }
      
      const regex = new RegExp(q, 'i');
      return await this.knowledgeArticleModel.find({
        $or: [
          { title: { $regex: regex } },
          { summary: { $regex: regex } },
          { originalContent: { $regex: regex } },
          { category: { $regex: regex } }
        ]
      }).sort({ createdAt: -1 }).exec();
    } catch (error) {
      this.logger.error('Failed to search articles', error);
      throw new HttpException('Failed to fetch articles', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Put(':id')
  async updateArticle(@Param('id') id: string, @Body() updateData: Partial<KnowledgeArticle>) {
    try {
      const updatedArticle = await this.knowledgeArticleModel.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      ).exec();

      if (!updatedArticle) {
        throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
      }

      return {
        status: 'success',
        message: 'Successfully updated SOP',
        data: updatedArticle
      };
    } catch (error) {
      this.logger.error(`Failed to update article ${id}`, error);
      throw new HttpException(
        (error as any).message || 'Failed to update article',
        (error as any).status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(':id')
  async deleteArticle(@Param('id') id: string) {
    try {
      const deletedArticle = await this.knowledgeArticleModel.findByIdAndDelete(id).exec();
      
      if (!deletedArticle) {
        throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
      }

      return {
        status: 'success',
        message: 'Successfully deleted SOP'
      };
    } catch (error) {
      this.logger.error(`Failed to delete article ${id}`, error);
      throw new HttpException(
        (error as any).message || 'Failed to delete article',
        (error as any).status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
