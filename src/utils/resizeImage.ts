/**
 * Redimensionne une image OpenCV (cv.Mat) à une taille maximale (maxWidth, maxHeight) en conservant le ratio.
 * Si l'image est déjà plus petite, retourne une copie.
 * @param mat Image OpenCV (cv.Mat)
 * @param maxWidth Largeur maximale (px)
 * @param maxHeight Hauteur maximale (px)
 * @returns Nouvelle image redimensionnée (cv.Mat)
 */
export function resizeImage(
  mat: cv.Mat,
  maxWidth = 1024,
  maxHeight = 1024
): cv.Mat {
  if (!(mat instanceof cv.Mat)) throw new Error("Input must be a cv.Mat");
  const width = mat.cols;
  const height = mat.rows;
  // Si l'image est déjà dans les limites, retourne une copie
  if (width <= maxWidth && height <= maxHeight) {
    return mat.clone();
  }
  // Calcul du ratio de redimensionnement
  const widthRatio = maxWidth / width;
  const heightRatio = maxHeight / height;
  const scale = Math.min(widthRatio, heightRatio);
  const newWidth = Math.round(width * scale);
  const newHeight = Math.round(height * scale);
  // Redimensionnement avec interpolation adaptée
  const resized = new cv.Mat();
  cv.resize(
    mat,
    resized,
    new cv.Size(newWidth, newHeight),
    0,
    0,
    cv.INTER_AREA
  );
  return resized;
}
