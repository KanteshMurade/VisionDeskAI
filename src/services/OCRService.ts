import Tesseract from 'tesseract.js';

export interface OCRProgress {
  status: string;
  progress: number;
}

export class OCRService {
  private worker: Tesseract.Worker | null = null;

  async initializeWorker(): Promise<void> {
    if (this.worker) return;
    
    this.worker = await Tesseract.createWorker('eng', 1);
  }

  async recognizeText(imageDataUrl: string): Promise<string> {
    await this.initializeWorker();

    if (!this.worker) {
      throw new Error('OCR worker failed to initialize.');
    }

    try {
      const result = await this.worker.recognize(imageDataUrl);
      return result.data.text.trim();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`OCR failed: ${error.message}`);
      }
      throw new Error('OCR failed: Unknown error');
    }
  }

  async terminateWorker(): Promise<void> {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
    }
  }
}

export const ocrService = new OCRService();
