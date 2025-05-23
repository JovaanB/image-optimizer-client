// Point d'entrée principal de la librairie
import { optimizeImage } from "./utils/optimizeImage.js";
import { analyzeImage } from "./analyzer.js";
import type { ProcessImageResult, ProcessImageOptions } from "./types";
import { DEFAULT_THRESHOLDS } from "./constants.js";
import { computeSSIM } from "./utils/computeSSIM.js";
import { computePSNR } from "./utils/computePSNR.js";

/**
 * Pipeline principal : optimise, analyse et contrôle la qualité d'une image OpenCV.
 * @param mat Image OpenCV (cv.Mat)
 * @param options Options d'optimisation et d'analyse (voir ProcessImageOptions)
 * @returns Résultat complet (image optimisée, scores, feedbacks, etc.)
 */
export async function processImage(
  mat: cv.Mat,
  options: ProcessImageOptions = {}
): Promise<ProcessImageResult> {
  // Fusionne options utilisateur et valeurs par défaut
  const thresholds = {
    minBlur: options.minBlur ?? DEFAULT_THRESHOLDS.minBlur,
    minContrast: options.minContrast ?? DEFAULT_THRESHOLDS.minContrast,
    minSSIM: options.minSSIM ?? DEFAULT_THRESHOLDS.minSSIM,
    minPSNR: options.minPSNR ?? DEFAULT_THRESHOLDS.minPSNR,
  };
  // Optimisation (redimensionnement, compression, etc.)
  const optimized = await optimizeImage(mat, options);

  // Analyse qualité (flou, contraste) avec seuils dynamiques
  const analysis = analyzeImage(optimized.matOptimized, {
    minBlur: thresholds.minBlur,
    minContrast: thresholds.minContrast,
  });

  // Calcul du SSIM
  const ssim = computeSSIM({
    originalMat: mat,
    optimizedMat: optimized.matOptimized,
  });

  // Calcul du PSNR
  const psnr = computePSNR({
    originalMat: mat,
    optimizedMat: optimized.matOptimized,
  });

  // Conversion dataUrl -> Blob pour téléchargement
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
    ssim,
    psnr,
    blob,
    originalSizePx: { width: mat.cols, height: mat.rows },
    optimizedSizePx: {
      width: optimized.width,
      height: optimized.height,
    },
    minBlur: thresholds.minBlur,
    minContrast: thresholds.minContrast,
    minSSIM: thresholds.minSSIM,
    minPSNR: thresholds.minPSNR,
  };
}

export { optimizeImage, analyzeImage };
