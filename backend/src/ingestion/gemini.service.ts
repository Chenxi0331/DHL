import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private readonly ai: GoogleGenAI;

  constructor() {
    // Requires process.env.GEMINI_API_KEY
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  /**
   * Translates messy input (text or screenshot) to structured JSON SOP
   */
  async generateStructuredSOP(
    text?: string,
    imageBuffer?: Buffer,
    mimeType?: string,
  ): Promise<{ title: string; summary: string; structuredSteps: string[]; category: string }> {
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

    const contents: any[] = [];
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
          temperature: 0.1, // more deterministic structured output
        },
      });

      const responseText = response.text;
      if (!responseText) throw new Error('Empty response from model');
      
      // Since responseMimeType is application/json, output should be safe to parse
      return JSON.parse(responseText);
    } catch (error) {
      this.logger.error('Failed to generate SOP from Gemini', error);
      throw error;
    }
  }
}
