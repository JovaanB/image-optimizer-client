// Point d'entrée principal de la librairie
import { optimizeImage } from "./utils/optimizeImage.js";
import { analyzeImage } from "./analyzer.js";
import type { ProcessImageResult, ProcessImageOptions } from "./types";

export function processImage(
  mat: cv.Mat,
  options: ProcessImageOptions = {}
): ProcessImageResult {
  const optimized = optimizeImage(mat, options);
  const analysis = analyzeImage(optimized.matOptimized, options);
  function dataUrlToBlob(dataUrl: string): Blob {
    const arr = dataUrl.split(","),
      mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new Blob([u8arr], { type: mime });
  }
  const blob = dataUrlToBlob(optimized.dataUrl);

  return {
    image: optimized.matOptimized,
    dataUrl: optimized.dataUrl,
    width: optimized.width,
    height: optimized.height,
    analysis,
    indicators: {
      blurScore: analysis.blurScore,
      contrastScore: analysis.contrastScore,
      isReadable: analysis.isReadable,
      feedbacks: analysis.feedbacks,
    },
    blob,
    originalSizePx: { width: mat.cols, height: mat.rows },
    optimizedSizePx: {
      width: optimized.matOptimized.cols,
      height: optimized.matOptimized.rows,
    },
  };
}

export { optimizeImage, analyzeImage };
