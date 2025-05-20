/// <reference path="../opencv.d.ts" />
// Détection de contraste faible via l'écart-type

/**
 * Calcule un score de contraste basé sur l'écart-type des niveaux de gris.
 * Plus l'écart-type est faible, plus le contraste est faible.
 * @param mat Image OpenCV (cv.Mat)
 * @returns Score de contraste (nombre réel)
 */
export function detectContrast(mat: cv.Mat): number {
  if (!(mat instanceof cv.Mat)) throw new Error("Input must be a cv.Mat");
  // Conversion en niveaux de gris si besoin
  let gray: cv.Mat;
  if (mat.channels() === 1) {
    gray = mat.clone();
  } else {
    gray = new cv.Mat();
    cv.cvtColor(mat, gray, cv.COLOR_RGBA2GRAY, 0);
  }
  // Calcul de l'écart-type
  const mean = new cv.Mat();
  const stddev = new cv.Mat();
  cv.meanStdDev(gray, mean, stddev);
  const std = (stddev as any).doubleAt(0, 0);
  // Nettoyage mémoire
  gray.delete();
  mean.delete();
  stddev.delete();
  return std;
}
