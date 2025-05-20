# image-optimizer-client

Librairie JavaScript/TypeScript pour optimiser et analyser la lisibilité des images côté client avec OpenCV.js.

## 🚀 Migration TypeScript

- **Tout le code source est en TypeScript** (`src/`)
- **Typage strict** pour toutes les fonctions et structures de données
- **Build automatique** dans `dist/` pour usage navigateur ES modules
- **Démo** (`demo.html`) interactive et configurable

## Fonctionnalités principales

- **Redimensionnement automatique** (écologie, performance, max 1024x1024 par défaut)
- **Détection de flou** (Laplacien)
- **Détection de contraste faible** (écart-type)
- **Détection de zones vides/blanches/noires**
- **Conversion optionnelle en niveaux de gris**
- **Aperçu et export optimisé avant upload**
- **Feedback utilisateur en direct**
- **Téléchargement de l'image optimisée**
- **Affichage des tailles originales et optimisées (px et Ko)**
- **Support multi-format natif** (JPEG, PNG, WebP)
- **Scores qualité avancés** : SSIM et PSNR
- **Seuils de qualité configurables** (flou, contraste, SSIM, PSNR)

## Démo rapide

Ouvrez `demo.html` dans un navigateur (avec un serveur local, ex : `python3 -m http.server`).

## Utilisation

```js
import { processImage } from "./dist/index.js";
import { loadImageToMat } from "./dist/utils/loadImageToMat.js";

const mat = await loadImageToMat(file);
const result = await processImage(mat, {
  maxWidth: 1024,
  maxHeight: 1024,
  quality: 0.7,
  format: "image/webp", // ou "image/jpeg", "image/png"
  minBlur: 300, // seuil de netteté minimal
  minContrast: 60, // seuil de contraste minimal
  minSSIM: 0.96, // seuil de similarité structurelle
  minPSNR: 32, // seuil de PSNR
});
mat.delete();
```

### Options possibles pour `processImage`

L'objet d'options (type `ProcessImageOptions`) accepte :

| Option      | Type    | Par défaut   | Description                                                     |
| ----------- | ------- | ------------ | --------------------------------------------------------------- |
| maxWidth    | number  | 1024         | Largeur maximale de l'image optimisée (px)                      |
| maxHeight   | number  | 1024         | Hauteur maximale de l'image optimisée (px)                      |
| grayscale   | boolean | false        | Convertir l'image en niveaux de gris avant export               |
| quality     | number  | 0.7          | Qualité JPEG/WebP (0 à 1) pour la compression                   |
| format      | string  | "image/jpeg" | Format d'export natif ("image/jpeg", "image/png", "image/webp") |
| minBlur     | number  | 280          | Seuil minimal de netteté (score Laplacien)                      |
| minContrast | number  | 50           | Seuil minimal de contraste (écart-type)                         |
| minSSIM     | number  | 0.999        | Seuil minimal de similarité structurelle (SSIM)                 |
| minPSNR     | number  | 35           | Seuil minimal de PSNR (rapport signal/bruit)                    |

Exemple :

```js
const result = await processImage(mat, {
  maxWidth: 800,
  grayscale: true,
  quality: 0.5,
  format: "image/webp",
  minSSIM: 0.97,
});
```

### Exemple de retour de processImage

```js
{
  image: cv.Mat, // image optimisée (OpenCV)
  dataUrl: 'data:image/webp;base64,...',
  width: 1024,
  height: 768,
  analysis: {
    blurScore: 123.4,
    contrastScore: 45.6,
    feedbacks: ['L\'image semble floue'],
    isReadable: false,
    blurOk: false, // booléen : la netteté dépasse-t-elle le seuil ?
    contrastOk: true // booléen : le contraste dépasse-t-il le seuil ?
  },
  ssim: 0.98, // score de similarité structurelle (voir ci-dessous)
  psnr: 34.2, // rapport signal/bruit (voir ci-dessous)
  blob: Blob, // pour téléchargement
  originalSizePx: { width: 2000, height: 3000 },
  optimizedSizePx: { width: 1024, height: 1536 },
  minSSIM: 0.95, // seuils utilisés pour l'analyse
  minPSNR: 30,
  minBlur: 280,
  minContrast: 50
}
```

### À propos de SSIM et PSNR

- **SSIM (Structural Similarity Index)** :

  - Mesure la similarité structurelle entre l'image originale et l'image optimisée (après redimensionnement).
  - Score entre 0 et 1 (1 = identique). Un score > 0.95 est généralement considéré comme très bon pour l'œil humain.
  - Permet de détecter les pertes de qualité visuelle non détectées par le simple PSNR.

- **PSNR (Peak Signal-to-Noise Ratio)** :
  - Mesure le rapport signal/bruit entre l'image originale et l'image optimisée (en dB).
  - Plus le score est élevé, meilleure est la qualité (typiquement > 30 dB pour une compression "quasi invisible").
  - Complémentaire au SSIM pour l'analyse quantitative.

Dans la démo, les scores SSIM et PSNR sont calculés automatiquement et comparés à vos seuils. Si l'un des scores est trop bas, une alerte s'affiche.

## Dépendances

- [OpenCV.js](https://docs.opencv.org/4.x/opencv.js) (CDN ou local)

## Structure

- `src/` : code source TypeScript
- `dist/` : build JavaScript ES modules pour navigateur
- `demo.html` : démo interactive

## Contribuer

- Fork, PR, issues bienvenus !
- Convention de commit : [Conventional Commits](https://www.conventionalcommits.org/)

## Licence

MIT
