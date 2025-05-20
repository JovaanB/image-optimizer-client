// Déclaration globale pour OpenCV.js (cv)
declare namespace cv {
  class Mat {
    constructor(...args: any[]);
    cols: number;
    rows: number;
    channels(): number;
    clone(): Mat;
    delete(): void;
    type(): number;
    data: Uint8ClampedArray;
    doubleAt?(row: number, col: number): number; // Ajout pour compatibilité OpenCV.js
  }
  class Size {
    constructor(width: number, height: number);
    width: number;
    height: number;
  }
  function cvtColor(src: Mat, dst: Mat, code: number, dstCn?: number): void;
  function Laplacian(src: Mat, dst: Mat, ddepth: number): void;
  function meanStdDev(src: Mat, mean: Mat, stddev: Mat): void;
  function calcHist(
    images: Mat[],
    channels: number[],
    mask: Mat,
    hist: Mat,
    histSize: number[],
    ranges: number[]
  ): void;
  function threshold(
    src: Mat,
    dst: Mat,
    thresh: number,
    maxval: number,
    type: number
  ): void;
  function countNonZero(src: Mat): number;
  function resize(
    src: Mat,
    dst: Mat,
    dsize: Size,
    fx?: number,
    fy?: number,
    interpolation?: number
  ): void;
  function imshow(
    canvasIdOrElement: string | HTMLCanvasElement,
    mat: Mat
  ): void;
  const COLOR_RGBA2GRAY: number;
  const CV_64F: number;
  const CV_8UC4: number;
  const THRESH_BINARY: number;
  const THRESH_BINARY_INV: number;
  const INTER_AREA: number;
}

declare const cv: typeof cv;
