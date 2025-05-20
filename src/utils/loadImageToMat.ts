/// <reference path="../opencv.d.ts" />
// Charge une image (File, URL, base64) en cv.Mat (RGBA)

export function loadImageToMat(fileOrUrl: File | string): Promise<cv.Mat> {
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
      if (!ctx) {
        reject(new Error("Canvas context 2D not available"));
        return;
      }
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
