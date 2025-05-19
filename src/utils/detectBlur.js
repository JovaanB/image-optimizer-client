// Détection de flou via la variance du Laplacien
// Retourne un score de flou (plus il est bas, plus l'image est floue)
export function detectBlur(mat) {
  if (!(mat instanceof cv.Mat)) throw new Error("Input must be a cv.Mat");
  let gray = new cv.Mat();
  if (mat.channels() === 1) {
    gray = mat.clone();
  } else {
    cv.cvtColor(mat, gray, cv.COLOR_RGBA2GRAY, 0);
  }
  let laplacian = new cv.Mat();
  cv.Laplacian(gray, laplacian, cv.CV_64F);
  const mean = new cv.Mat();
  const stddev = new cv.Mat();
  cv.meanStdDev(laplacian, mean, stddev);
  const variance = Math.pow(stddev.doubleAt(0, 0), 2);
  gray.delete();
  laplacian.delete();
  mean.delete();
  stddev.delete();
  return variance;
}
