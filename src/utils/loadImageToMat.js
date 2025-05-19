// Fonctions utilitaires pour charger une image en cv.Mat
// Charge une image (File, URL, base64) en cv.Mat (RGBA)
// Retourne une Promise<cv.Mat>
export function loadImageToMat(fileOrUrl) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "Anonymous";
    img.onload = async () => {
      if (!cv || !cv.Mat) {
        reject(new Error("OpenCV.js not loaded"));
        return;
      }
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      let mat = new cv.Mat(img.height, img.width, cv.CV_8UC4);
      mat.data.set(imageData.data);
      resolve(mat);
    };
    img.onerror = reject;
    if (typeof fileOrUrl === "string") {
      img.src = fileOrUrl;
    } else {
      img.src = URL.createObjectURL(fileOrUrl);
    }
  });
}
