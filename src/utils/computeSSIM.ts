import { resizeImage } from "./resizeImage";

/**
 * Calcule le SSIM entre deux images (originalMat, optimizedMat)
 * Version simplifiée sur niveaux de gris
 */
export function computeSSIM({
  originalMat,
  optimizedMat,
}: {
  originalMat: cv.Mat;
  optimizedMat: cv.Mat;
}): number | null {
  let originalForCompare = originalMat;
  if (
    originalMat.rows !== optimizedMat.rows ||
    originalMat.cols !== optimizedMat.cols ||
    originalMat.channels() !== optimizedMat.channels()
  ) {
    try {
      originalForCompare = resizeImage(
        originalMat,
        optimizedMat.cols,
        optimizedMat.rows
      );
    } catch (e) {
      return null;
    }
  }
  let ssim: number | null = null;
  try {
    let gray1 = new cv.Mat();
    let gray2 = new cv.Mat();
    cv.cvtColor(originalForCompare, gray1, cv.COLOR_RGBA2GRAY, 0);
    cv.cvtColor(optimizedMat, gray2, cv.COLOR_RGBA2GRAY, 0);
    let mean1 = 0,
      mean2 = 0,
      std1 = 0,
      std2 = 0,
      covar = 0;
    const n = gray1.rows * gray1.cols;
    for (let i = 0; i < n; i++) {
      const v1 = gray1.data[i];
      const v2 = gray2.data[i];
      mean1 += v1;
      mean2 += v2;
    }
    mean1 /= n;
    mean2 /= n;
    for (let i = 0; i < n; i++) {
      const v1 = gray1.data[i];
      const v2 = gray2.data[i];
      std1 += (v1 - mean1) ** 2;
      std2 += (v2 - mean2) ** 2;
      covar += (v1 - mean1) * (v2 - mean2);
    }
    std1 = Math.sqrt(std1 / n);
    std2 = Math.sqrt(std2 / n);
    covar /= n;
    // SSIM formule simplifiée
    const C1 = 6.5025,
      C2 = 58.5225;
    ssim =
      ((2 * mean1 * mean2 + C1) * (2 * covar + C2)) /
      ((mean1 ** 2 + mean2 ** 2 + C1) * (std1 ** 2 + std2 ** 2 + C2));
    gray1.delete();
    gray2.delete();
  } catch (e) {
    ssim = null;
  }
  if (originalForCompare !== originalMat) originalForCompare.delete();
  return ssim;
}
