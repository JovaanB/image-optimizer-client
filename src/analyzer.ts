/// <reference path="./opencv.d.ts" />
import { detectBlur } from "./utils/detectBlur.js";
import { detectContrast } from "./utils/detectContrast.js";
import type { AnalyzeImageResult } from "./types";
import { DEFAULT_THRESHOLDS } from "./constants.js";

/**
 * Analyse la qualité d'une image (flou, contraste) et génère des feedbacks lisibles.
 * @param mat Image OpenCV (cv.Mat)
 * @param opts Options d'analyse (seuils minBlur, minContrast)
 * @returns Résultat d'analyse (scores, feedbacks, lisibilité)
 */
export interface AnalyzeImageOptions {
  minBlur?: number;
  minContrast?: number;
}

export function analyzeImage(
  mat: cv.Mat,
  opts: AnalyzeImageOptions = {}
): AnalyzeImageResult {
  if (!(mat instanceof cv.Mat)) throw new Error("Input must be a cv.Mat");
  // Calcul des scores
  const blurScore = detectBlur(mat);
  const contrastScore = detectContrast(mat);
  // Seuils paramétrables ou valeurs par défaut
  const blurThreshold = opts.minBlur ?? DEFAULT_THRESHOLDS.minBlur;
  const contrastThreshold = opts.minContrast ?? DEFAULT_THRESHOLDS.minContrast;
  // Génération des feedbacks
  const feedbacks: string[] = [];
  if (blurScore < blurThreshold) {
    feedbacks.push(
      `L'image semble floue (score: ${blurScore.toFixed(
        1
      )} < seuil: ${blurThreshold})`
    );
  }
  if (contrastScore < contrastThreshold) {
    feedbacks.push(
      `Contraste trop faible (score: ${contrastScore.toFixed(
        1
      )} < seuil: ${contrastThreshold})`
    );
  }
  return {
    blurScore,
    contrastScore,
    feedbacks,
    isReadable: feedbacks.length === 0,
  };
}
