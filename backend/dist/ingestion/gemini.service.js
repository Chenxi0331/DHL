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
var GeminiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiService = void 0;
const common_1 = require("@nestjs/common");
const genai_1 = require("@google/genai");
let GeminiService = GeminiService_1 = class GeminiService {
    constructor() {
        this.logger = new common_1.Logger(GeminiService_1.name);
        this.ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    async generateStructuredSOP(text, imageBuffer, mimeType) {
        const systemInstruction = `
      You are an expert logistics coordinator for DHL.
      Your task is to transform raw input (messy text, chat logs, or images of notes) into a structured Standard Operating Procedure (SOP).
      Extract the core intent and logical steps from the provided context.
      
      Respond STRICTLY in JSON using the following exact schema (no markdown formatting, just JSON):
      {
        "title": "A short, descriptive title",
        "category": "One of: [Shipping, Customs, Warehousing, General]",
        "summary": "A 1-2 sentence summary of the SOP goal",
        "structuredSteps": [
          "Step 1: Do this...",
          "Step 2: Do that..."
        ]
      }
    `;
        const contents = [];
        if (text) {
            contents.push(text);
        }
        if (imageBuffer && mimeType) {
            contents.push({
                inlineData: {
                    data: imageBuffer.toString('base64'),
                    mimeType: mimeType,
                },
            });
        }
        if (contents.length === 0) {
            throw new Error('No valid text or image provided to Gemini.');
        }
        try {
            this.logger.log('Calling Gemini AI to parse and generate structure...');
            const response = await this.ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: contents,
                config: {
                    systemInstruction: systemInstruction,
                    responseMimeType: 'application/json',
                    temperature: 0.1,
                },
            });
            const responseText = response.text;
            if (!responseText)
                throw new Error('Empty response from model');
            return JSON.parse(responseText);
        }
        catch (error) {
            this.logger.error('Failed to generate SOP from Gemini', error);
            throw error;
        }
    }
};
exports.GeminiService = GeminiService;
exports.GeminiService = GeminiService = GeminiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], GeminiService);
//# sourceMappingURL=gemini.service.js.map