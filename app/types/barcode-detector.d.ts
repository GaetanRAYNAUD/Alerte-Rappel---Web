/**
 * BarcodeDetector API — Web API
 * @see https://developer.mozilla.org/en-US/docs/Web/API/BarcodeDetector
 */

type BarcodeFormatNative =
  | 'aztec'
  | 'code_128'
  | 'code_39'
  | 'code_93'
  | 'codabar'
  | 'data_matrix'
  | 'ean_13'
  | 'ean_8'
  | 'itf'
  | 'pdf417'
  | 'qr_code'
  | 'upc_a'
  | 'upc_e'
  | 'unknown';

interface BarcodeDetectorOptions {
  formats?: BarcodeFormatNative[];
}

interface DetectedBarcode {
  boundingBox: DOMRectReadOnly;
  cornerPoints: { x: number; y: number }[];
  format: BarcodeFormatNative;
  rawValue: string;
}

declare class BarcodeDetector {
  constructor(options?: BarcodeDetectorOptions);
  static getSupportedFormats(): Promise<BarcodeFormatNative[]>;
  detect(source: ImageBitmapSource): Promise<DetectedBarcode[]>;
}
