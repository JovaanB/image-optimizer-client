/**
 * Options pour le pipeline d'optimisation et d'analyse d'image.
 *
 * @property maxWidth      Largeur maximale de l'image optimisée (px, défaut: 1024)
 * @property maxHeight     Hauteur maximale de l'image optimisée (px, défaut: 1024)
 * @property grayscale     Convertir l'image en niveaux de gris (défaut: false)
 * @property quality       Qualité JPEG (0 à 1, défaut: 0.7)
 * @property minBlur       Seuil minimal de netteté (score Laplacien, défaut: voir constants)
 * @property minContrast   Seuil minimal de contraste (écart-type, défaut: voir constants)
 * @property minSSIM       Seuil minimal de similarité structurelle (défaut: voir constants)
 * @property minPSNR       Seuil minimal de PSNR (défaut: voir constants)
 * @property format         Format d'export natif ("image/jpeg", "image/png", "image/webp", défaut: "image/jpeg")
 */
export interface ProcessImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  grayscale?: boolean;
  quality?: number;
  minBlur?: number;
  minContrast?: number;
  minSSIM?: number;
  minPSNR?: number;
  format?: "image/jpeg" | "image/png" | "image/webp";
}

export interface AnalyzeImageResult {
  blurScore: number;
  contrastScore: number;
  feedbacks: string[];
  isReadable: boolean;
}

export interface ProcessImageResult {
  image: cv.Mat;
  dataUrl: string;
  width: number;
  height: number;
  analysis: AnalyzeImageResult;
  ssim: number | null;
  psnr: number | null;
  blob: Blob;
  originalSizePx: { width: number; height: number };
  optimizedSizePx: { width: number; height: number };
  minSSIM?: number;
  minPSNR?: number;
  minBlur?: number;
  minContrast?: number;
}
