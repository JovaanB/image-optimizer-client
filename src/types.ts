export interface ProcessImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  grayscale?: boolean;
  quality?: number;
}

export interface AnalyzeImageResult {
  blurScore: number;
  contrastScore: number;
  feedbacks: string[];
  isReadable: boolean;
}

export interface ProcessImageResult {
  image: cv.Mat;
  dataUrl: string;
  width: number;
  height: number;
  analysis: AnalyzeImageResult;
  indicators: {
    blurScore: number;
    contrastScore: number;
    isReadable: boolean;
    feedbacks: string[];
  };
  blob: Blob;
  originalSizePx: { width: number; height: number };
  optimizedSizePx: { width: number; height: number };
}
