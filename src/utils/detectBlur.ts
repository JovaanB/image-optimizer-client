/**
 * Calcule un score de flou basé sur la variance du Laplacien.
 * Plus la variance est faible, plus l'image est floue.
 * @param mat Image OpenCV (cv.Mat)
 * @returns Score de flou (nombre réel)
 */
export function detectBlur(mat: cv.Mat): number {
  if (!(mat instanceof cv.Mat)) throw new Error("Input must be a cv.Mat");
  // Conversion en niveaux de gris si besoin
  let gray: cv.Mat;
  if (mat.channels() === 1) {
    gray = mat.clone();
  } else {
    gray = new cv.Mat();
    cv.cvtColor(mat, gray, cv.COLOR_RGBA2GRAY, 0);
  }
  // Calcul du Laplacien
  const laplacian = new cv.Mat();
  cv.Laplacian(gray, laplacian, (cv as any).CV_64F);
  // Calcul de la variance
  const mean = new cv.Mat();
  const stddev = new cv.Mat();
  cv.meanStdDev(laplacian, mean, stddev);
  const variance = Math.pow((stddev as any).doubleAt(0, 0), 2);
  // Nettoyage mémoire
  gray.delete();
  laplacian.delete();
  mean.delete();
  stddev.delete();
  return variance;
}
