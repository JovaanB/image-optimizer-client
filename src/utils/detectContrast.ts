/// <reference path="../opencv.d.ts" />
// Détection de contraste faible via l'écart-type

export function detectContrast(mat: cv.Mat): number {
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
  // @ts-ignore: OpenCV.js expose doubleAt dynamiquement
  const std = (stddev as any).doubleAt(0, 0);
  gray.delete();
  mean.delete();
  stddev.delete();
  return std;
}
