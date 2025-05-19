// Pipeline d'optimisation (resize, grayscale, compression)
// ...existing code...

// Optimise une image : resize, optionnellement grayscale, puis exporte en base64 (compression JPEG)
// Retourne { matOptimized, dataUrl, width, height }
import { resizeImage } from "./resizeImage.js";

export function optimizeImage(
  mat,
  { maxWidth = 1024, maxHeight = 1024, grayscale = false, quality = 0.7 } = {}
) {
  if (!(mat instanceof cv.Mat)) throw new Error("Input must be a cv.Mat");
  // 1. Resize
  let resized = mat;
  let resizedIsTemp = false;
  if (mat.cols > maxWidth || mat.rows > maxHeight) {
    resized = resizeImage(mat, maxWidth, maxHeight);
    resizedIsTemp = true;
  }
  // 2. Grayscale optionnel
  let processed = resized;
  let processedIsTemp = false;
  if (grayscale && resized.channels() > 1) {
    processed = new cv.Mat();
    cv.cvtColor(resized, processed, cv.COLOR_RGBA2GRAY, 0);
    processedIsTemp = true;
  }
  // 3. Export en base64 via canvas (JPEG compressé)
  const canvas = document.createElement("canvas");
  canvas.width = processed.cols;
  canvas.height = processed.rows;
  cv.imshow(canvas, processed);
  const dataUrl = canvas.toDataURL("image/jpeg", quality); // compression JPEG
  // Nettoyage
  if (processedIsTemp) processed.delete();
  if (resizedIsTemp && resized !== processed) resized.delete();
  return {
    matOptimized: mat, // On retourne l'original pour éviter d'accéder à un objet supprimé
    dataUrl,
    width: canvas.width,
    height: canvas.height,
  };
}
// ...existing code...
