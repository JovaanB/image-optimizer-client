// Détection de contraste faible via l'écart-type
// Détecte le contraste d'une image via l'écart-type des pixels (grayscale)
// Retourne l'écart-type (plus il est bas, plus le contraste est faible)
export function detectContrast(mat) {
  if (!(mat instanceof cv.Mat)) throw new Error("Input must be a cv.Mat");
  let gray = new cv.Mat();
  if (mat.channels() === 1) {
    gray = mat.clone();
  } else {
    cv.cvtColor(mat, gray, cv.COLOR_RGBA2GRAY, 0);
  }
  const mean = new cv.Mat();
  const stddev = new cv.Mat();
  cv.meanStdDev(gray, mean, stddev);
  const std = stddev.doubleAt(0, 0);
  gray.delete();
  mean.delete();
  stddev.delete();
  return std;
}
