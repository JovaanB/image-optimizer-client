// Analyse globale de l'image : combine blur, contraste, zones vides
// Retourne un objet avec scores et feedbacks
import { detectBlur } from "./utils/detectBlur.js";
import { detectContrast } from "./utils/detectContrast.js";

export function analyzeImage(mat, options = {}) {
  if (!(mat instanceof cv.Mat)) throw new Error("Input must be a cv.Mat");
  // Scores
  const blurScore = detectBlur(mat);
  const contrastScore = detectContrast(mat);

  // Seuils empiriques (à ajuster selon besoin)
  const blurThreshold = 100; // <100 = flou
  const contrastThreshold = 20; // <20 = faible contraste

  // Feedbacks
  const feedbacks = [];
  if (blurScore < blurThreshold) feedbacks.push("L'image semble floue");
  if (contrastScore < contrastThreshold)
    feedbacks.push("Contraste trop faible");

  return {
    blurScore,
    contrastScore,
    feedbacks,
    isReadable: feedbacks.length === 0,
  };
}
