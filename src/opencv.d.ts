// Déclaration globale pour OpenCV.js (cv)
declare namespace cv {
  class Mat {
    static zeros(rows: number, cols: number, arg2: number): Mat;
    constructor(...args: any[]);
    cols: number;
    rows: number;
    channels(): number;
    clone(): Mat;
    convertTo: (m: Mat, type: number, alpha?: number, beta?: number) => void;
    floatAt(row: number, col: number): number;
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
  class Scalar {
    constructor(...args: number[]);
    val: number[];
  }
  function cvtColor(src: Mat, dst: Mat, code: number, dstCn?: number): void;
  function Laplacian(src: Mat, dst: Mat, ddepth: number): void;
  function meanStdDev(src: Mat, mean: Mat, stddev: Mat): void;
  function compare(src1: Mat, src2: Mat, dst: Mat, cmpop: number): void;
  function GaussianBlur(
    src: Mat,
    dst: Mat,
    ksize: Size,
    sigmaX: number,
    sigmaY?: number
  ): void;
  function multiply(
    src1: Mat,
    src2: Mat,
    dst: Mat,
    scale?: number,
    dtype?: number
  ): void;
  function subtract(src1: Mat, src2: Mat, dst: Mat, mask?: Mat): void;
  function add(src1: Mat, src2: Mat, dst: Mat, mask?: Mat): void;
  function divide(src1: Mat, src2: Mat, dst: Mat, scale?: number): void;
  function sqrt(src: Mat, dst: Mat): void;
  function matFromArray(
    rows: number,
    cols: number,
    type: number,
    data: number[]
  ): Mat;
  function max(src1: Mat, src2: Mat, dst: Mat): void;
  function mean(src: Mat): number;
  function warpAffine(
    src: Mat,
    dst: Mat,
    M: Mat,
    dsize: Size,
    flags?: number,
    borderMode?: number,
    borderValue?: number
  ): void;
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
  const CMP_GT: number;
  const CMP_LT: number;
  const CV_32F: number;
  const COLOR_BGR2GRAY: number;
  const INTER_CUBIC: number;
  const THRESH_BINARY: number;
  const THRESH_BINARY_INV: number;
  const INTER_AREA: number;

  export function compare(structdis: Mat, arg1: number, pos: Mat, CMP_GT: any) {
    throw new Error("Function not implemented.");
  }
}

declare const cv: typeof cv;
