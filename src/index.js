// Point d'entrée principal de la librairie

import { optimizeImage } from "./utils/optimizeImage.js";
import { analyzeImage } from "./analyzer.js";

// Fonction principale pour traiter une image (cv.Mat)
export function processImage(mat, options = {}) {
  // Optimisation (resize, grayscale, compression)
  const optimized = optimizeImage(mat, options);
  // Analyse de lisibilité
  const analysis = analyzeImage(optimized.matOptimized, options);
  // Génère un blob à partir du dataUrl pour téléchargement
  function dataUrlToBlob(dataUrl) {
    const arr = dataUrl.split(","),
      mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new Blob([u8arr], { type: mime });
  }
  const blob = dataUrlToBlob(optimized.dataUrl);
  // Retourne tout pour l'UI : aperçu, scores, feedbacks, image optimisée, blob téléchargeable
  return {
    image: optimized.matOptimized,
    dataUrl: optimized.dataUrl,
    width: optimized.width,
    height: optimized.height,
    analysis,
    indicators: {
      blurScore: analysis.blurScore,
      contrastScore: analysis.contrastScore,
      isReadable: analysis.isReadable,
      feedbacks: analysis.feedbacks,
    },
    blob, // Pour téléchargement direct
  };
}

export { optimizeImage, analyzeImage };
