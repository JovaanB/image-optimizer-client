/// <reference path="./opencv.d.ts" />
import { detectBlur } from "./utils/detectBlur.js";
import { detectContrast } from "./utils/detectContrast.js";
import type { AnalyzeImageResult, ProcessImageOptions } from "./types";

export function analyzeImage(
  mat: cv.Mat,
  options: ProcessImageOptions = {}
): AnalyzeImageResult {
  if (!(mat instanceof cv.Mat)) throw new Error("Input must be a cv.Mat");
  const blurScore = detectBlur(mat);
  const contrastScore = detectContrast(mat);
  const blurThreshold = 100;
  const contrastThreshold = 20;
  const feedbacks: string[] = [];
  if (blurScore < blurThreshold) feedbacks.push("L'image semble floue");
  if (contrastScore < contrastThreshold)
    feedbacks.push("Contraste trop faible");

  return {
    blurScore,
    contrastScore,
    feedbacks,
    isReadable: feedbacks.length === 0,
  };
}
