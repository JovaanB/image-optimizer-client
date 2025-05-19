// Redimensionnement d'image à une taille max tout en gardant le ratio
// Redimensionne une image cv.Mat à une taille maximale (maxWidth, maxHeight) en conservant le ratio
// Retourne un nouvel objet cv.Mat
export function resizeImage(mat, maxWidth = 1024, maxHeight = 1024) {
  if (!(mat instanceof cv.Mat)) throw new Error("Input must be a cv.Mat");
  const width = mat.cols;
  const height = mat.rows;
  if (width <= maxWidth && height <= maxHeight) {
    return mat.clone(); // Pas besoin de redimensionner
  }
  const widthRatio = maxWidth / width;
  const heightRatio = maxHeight / height;
  const scale = Math.min(widthRatio, heightRatio);
  const newWidth = Math.round(width * scale);
  const newHeight = Math.round(height * scale);
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
