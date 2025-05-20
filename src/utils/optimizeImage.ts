import { resizeImage } from "./resizeImage.js";
import type { ProcessImageOptions } from "../types";

/**
 * Optimise une image OpenCV (redimensionnement, conversion, compression JPEG).
 * Retourne la version optimisée en cv.Mat, le dataUrl, et les dimensions.
 * @param mat Image OpenCV (cv.Mat)
 * @param options Options d'optimisation (maxWidth, maxHeight, grayscale, quality)
 */
export async function optimizeImage(
  mat: cv.Mat,
  {
    maxWidth = 1024,
    maxHeight = 1024,
    grayscale = false,
    quality = 0.7,
    format = "image/jpeg", // support multi-format natif
  }: ProcessImageOptions = {}
): Promise<{
  matOptimized: cv.Mat;
  dataUrl: string;
  width: number;
  height: number;
}> {
  if (!(mat instanceof cv.Mat)) throw new Error("Input must be a cv.Mat");
  // Redimensionnement si besoin
  let resized: cv.Mat = mat;
  let resizedIsTemp = false;
  if (mat.cols > maxWidth || mat.rows > maxHeight) {
    resized = resizeImage(mat, maxWidth, maxHeight);
    resizedIsTemp = true;
  }
  // Conversion en niveaux de gris si demandé
  let processed: cv.Mat = resized;
  let processedIsTemp = false;
  if (grayscale && resized.channels() > 1) {
    processed = new cv.Mat();
    cv.cvtColor(resized, processed, cv.COLOR_RGBA2GRAY, 0);
    processedIsTemp = true;
  }
  // Export en dataUrl dans le format choisi
  const canvas = document.createElement("canvas");
  canvas.width = processed.cols;
  canvas.height = processed.rows;
  cv.imshow(canvas, processed);
  const dataUrl = canvas.toDataURL(format, quality);

  // Recharge la version compressée dans un nouveau cv.Mat pour garantir la fidélité du calcul SSIM/PSNR
  let matOptimized: cv.Mat = processed;
  try {
    const img = new window.Image();
    img.src = dataUrl;
    await new Promise((res) => (img.onload = res));
    const tmpCanvas = document.createElement("canvas");
    tmpCanvas.width = img.naturalWidth;
    tmpCanvas.height = img.naturalHeight;
    const ctx = tmpCanvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(
        0,
        0,
        tmpCanvas.width,
        tmpCanvas.height
      );
      matOptimized = new cv.Mat(tmpCanvas.height, tmpCanvas.width, cv.CV_8UC4);
      matOptimized.data.set(imageData.data);
      if (processed !== matOptimized) processed.delete();
    }
  } catch (e) {
    // fallback : on garde processed
  }
  // Nettoyage mémoire
  if (processedIsTemp && processed !== matOptimized) processed.delete();
  if (resizedIsTemp && resized !== processed) resized.delete();
  return {
    matOptimized,
    dataUrl,
    width: canvas.width,
    height: canvas.height,
  };
}
