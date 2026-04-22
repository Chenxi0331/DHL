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
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnowledgeArticleSchema = exports.KnowledgeArticle = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let KnowledgeArticle = class KnowledgeArticle {
};
exports.KnowledgeArticle = KnowledgeArticle;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], KnowledgeArticle.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], KnowledgeArticle.prototype, "summary", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], KnowledgeArticle.prototype, "structuredSteps", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], KnowledgeArticle.prototype, "originalContent", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], KnowledgeArticle.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], KnowledgeArticle.prototype, "sourceFileUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['Draft', 'Verified'], default: 'Draft' }),
    __metadata("design:type", String)
], KnowledgeArticle.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['Email', 'Chat', 'Manual', 'Other'], default: 'Manual' }),
    __metadata("design:type", String)
], KnowledgeArticle.prototype, "sourceType", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], KnowledgeArticle.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], KnowledgeArticle.prototype, "updatedAt", void 0);
exports.KnowledgeArticle = KnowledgeArticle = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], KnowledgeArticle);
exports.KnowledgeArticleSchema = mongoose_1.SchemaFactory.createForClass(KnowledgeArticle);
//# sourceMappingURL=knowledge-article.schema.js.map