import { resizeImage } from "./resizeImage.js";
import type { ProcessImageOptions } from "../types";

export function optimizeImage(
  mat: cv.Mat,
  {
    maxWidth = 1024,
    maxHeight = 1024,
    grayscale = false,
    quality = 0.7,
  }: ProcessImageOptions = {}
): { matOptimized: cv.Mat; dataUrl: string; width: number; height: number } {
  if (!(mat instanceof cv.Mat)) throw new Error("Input must be a cv.Mat");
  let resized = mat;
  let resizedIsTemp = false;
  if (mat.cols > maxWidth || mat.rows > maxHeight) {
    resized = resizeImage(mat, maxWidth, maxHeight);
    resizedIsTemp = true;
  }
  let processed = resized;
  let processedIsTemp = false;
  if (grayscale && resized.channels() > 1) {
    processed = new cv.Mat();
    cv.cvtColor(resized, processed, cv.COLOR_RGBA2GRAY, 0);
    processedIsTemp = true;
  }
  const canvas = document.createElement("canvas");
  canvas.width = processed.cols;
  canvas.height = processed.rows;
  cv.imshow(canvas, processed);
  const dataUrl = canvas.toDataURL("image/jpeg", quality);
  if (processedIsTemp) processed.delete();
  if (resizedIsTemp && resized !== processed) resized.delete();
  return {
    matOptimized: mat,
    dataUrl,
    width: canvas.width,
    height: canvas.height,
  };
}
