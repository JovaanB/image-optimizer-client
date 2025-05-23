import { resizeImage } from "./resizeImage";

/**
 * Calcule le PSNR entre deux images (originalMat, optimizedMat)
 */
export function computePSNR({
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
  let psnr: number | null = null;
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
  if (originalForCompare !== originalMat) originalForCompare.delete();
  return psnr;
}
