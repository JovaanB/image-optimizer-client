import { resizeImage } from "./resizeImage.js";

/**
 * Calcule SSIM et PSNR entre deux images (originalMat, optimizedMat)
 * Si les tailles diffèrent, redimensionne l'originale pour matcher l'optimisée.
 */
export function computeSSIM_PSNR({
  originalMat,
  optimizedMat,
  minSSIM,
  minPSNR,
}: {
  originalMat: cv.Mat;
  optimizedMat: cv.Mat;
  minSSIM?: number;
  minPSNR?: number;
}): {
  ssim: number | null;
  psnr: number | null;
  minSSIM?: number;
  minPSNR?: number;
} {
  let ssim: number | null = null,
    psnr: number | null = null;

  // Si tailles différentes, on redimensionne l'originale pour matcher l'optimisée
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
      return { ssim: null, psnr: null };
    }
  }

  try {
    let mse = 0;
    for (let r = 0; r < originalForCompare.rows; r++) {
      for (let c = 0; c < originalForCompare.cols; c++) {
        for (let ch = 0; ch < originalForCompare.channels(); ch++) {
          const v1 =
            originalForCompare.data[
              (r * originalForCompare.cols + c) *
                originalForCompare.channels() +
                ch
            ];
          const v2 =
            optimizedMat.data[
              (r * optimizedMat.cols + c) * optimizedMat.channels() + ch
            ];
          mse += (v1 - v2) * (v1 - v2);
        }
      }
    }
    mse /=
      originalForCompare.rows *
      originalForCompare.cols *
      originalForCompare.channels();
    if (mse === 0) {
      psnr = 99;
    } else {
      psnr = 10 * Math.log10((255 * 255) / mse);
    }
  } catch (e) {
    psnr = null;
  }

  // Calcul SSIM (Structural Similarity Index, version simplifiée sur niveaux de gris)
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
  // (aucun changement dans le calcul, mais on retourne les seuils si fournis)
  return { ssim, psnr, minSSIM, minPSNR };
}
