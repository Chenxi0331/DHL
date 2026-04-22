"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var IngestionController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IngestionController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const gemini_service_1 = require("./gemini.service");
const knowledge_article_schema_1 = require("./schemas/knowledge-article.schema");
const auth_guard_1 = require("../auth/auth.guard");
let IngestionController = IngestionController_1 = class IngestionController {
    constructor(geminiService, knowledgeArticleModel) {
        this.geminiService = geminiService;
        this.knowledgeArticleModel = knowledgeArticleModel;
        this.logger = new common_1.Logger(IngestionController_1.name);
    }
    async handleIngestion(file, text, sourceType) {
        try {
            if (!file && !text) {
                throw new common_1.HttpException('Must provide either a file or text content', common_1.HttpStatus.BAD_REQUEST);
            }
            this.logger.log(`Received ingestion request. File exists: ${!!file}, Text exists: ${!!text}`);
            const imageBuffer = file?.buffer;
            const mimeType = file?.mimetype;
            const structuredData = await this.geminiService.generateStructuredSOP(text, imageBuffer, mimeType);
            const rawContent = text || (file ? `[Uploaded file: ${file.originalname}]` : 'Raw input');
            const newArticle = new this.knowledgeArticleModel({
                title: structuredData.title,
                summary: structuredData.summary,
                category: structuredData.category,
                structuredSteps: structuredData.structuredSteps,
                originalContent: rawContent,
                sourceFileUrl: file ? file.originalname : null,
                sourceType: sourceType || 'Manual',
            });
            const savedArticle = await newArticle.save();
            return {
                status: 'success',
                message: 'Successfully generated and persisted SOP from raw input.',
                data: savedArticle
            };
        }
        catch (error) {
            this.logger.error('Failed to process ingestion', error);
            throw new common_1.HttpException({
                status: 'error',
                message: error.message || 'Internal server error during ingestion',
            }, error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async searchArticles(q) {
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
        }
        catch (error) {
            this.logger.error('Failed to search articles', error);
            throw new common_1.HttpException('Failed to fetch articles', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.IngestionController = IngestionController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('text')),
    __param(2, (0, common_1.Body)('sourceType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], IngestionController.prototype, "handleIngestion", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IngestionController.prototype, "searchArticles", null);
exports.IngestionController = IngestionController = IngestionController_1 = __decorate([
    (0, common_1.Controller)('ingest'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(1, (0, mongoose_1.InjectModel)(knowledge_article_schema_1.KnowledgeArticle.name)),
    __metadata("design:paramtypes", [gemini_service_1.GeminiService,
        mongoose_2.Model])
], IngestionController);
//# sourceMappingURL=ingestion.controller.js.map