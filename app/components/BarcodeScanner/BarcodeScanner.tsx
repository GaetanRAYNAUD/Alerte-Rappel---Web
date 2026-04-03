import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { alpha, useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { BarcodeFormat, DecodeHintType, type Result } from '@zxing/library';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

const QUIET_ZONE_PX = 30;
const SCAN_INTERVAL_MS = 400;

interface BarcodeScannerProps {
  onResult: (code: string) => void;
  onImageCapture?: (url: string | null) => void;
  onScanningChange?: (scanning: boolean) => void;
}

interface DecodedBarcode {
  text: string;
  format: string;
}

function addQuietZone(source: HTMLCanvasElement | HTMLVideoElement): HTMLCanvasElement {
  const w = source instanceof HTMLVideoElement ? source.videoWidth : source.width;
  const h = source instanceof HTMLVideoElement ? source.videoHeight : source.height;

  const padded = document.createElement('canvas');
  padded.width = w + QUIET_ZONE_PX * 2;
  padded.height = h + QUIET_ZONE_PX * 2;

  const ctx = padded.getContext('2d')!;
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, padded.width, padded.height);
  ctx.drawImage(source, QUIET_ZONE_PX, QUIET_ZONE_PX);

  return padded;
}

function getNativeBarcodeDetector(): BarcodeDetector | null {
  if ('BarcodeDetector' in window) {
    try {
      return new BarcodeDetector({
        formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39', 'qr_code']
      });
    } catch {
      return null;
    }
  }
  return null;
}

function createZxingReader(): BrowserMultiFormatReader {
  const hints = new Map();
  hints.set(DecodeHintType.POSSIBLE_FORMATS, [
    BarcodeFormat.EAN_13,
    BarcodeFormat.EAN_8,
    BarcodeFormat.UPC_A,
    BarcodeFormat.UPC_E,
    BarcodeFormat.CODE_128,
    BarcodeFormat.CODE_39,
    BarcodeFormat.QR_CODE
  ]);
  hints.set(DecodeHintType.TRY_HARDER, true);
  return new BrowserMultiFormatReader(hints);
}

async function decodeCanvas(canvas: HTMLCanvasElement): Promise<DecodedBarcode> {
  const padded = addQuietZone(canvas);

  // 1) Essai natif (Chrome / Android)
  const detector = getNativeBarcodeDetector();
  if (detector) {
    const results = await detector.detect(padded);
    if (results.length > 0) {
      return { text: results[0].rawValue, format: results[0].format };
    }
  }

  const reader = createZxingReader();
  const result: Result = await reader.decodeFromCanvas(padded);
  return { text: result.getText(), format: BarcodeFormat[result.getBarcodeFormat()] };
}

export function BarcodeScanner({ onResult, onImageCapture, onScanningChange }: BarcodeScannerProps) {
  const intl = useIntl();
  const theme = useTheme();

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [scanning, _setScanning] = useState(false);
  const setScanning = useCallback((value: boolean) => {
    _setScanning(value);
    onScanningChange?.(value);
  }, [onScanningChange]);
  const [decoding, setDecoding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const cleanupCamera = useCallback(() => {
    if (scanTimerRef.current) {
      clearTimeout(scanTimerRef.current);
      scanTimerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setScanning(false);
  }, []);

  useEffect(() => () => cleanupCamera(), [cleanupCamera]);

  const decodeFile = useCallback(
    async (file: File) => {
      setError(null);
      setDecoding(true);
      onImageCapture?.(null);

      const url = URL.createObjectURL(file);
      try {
        const img = new Image();
        img.src = url;
        await img.decode();

        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        canvas.getContext('2d')!.drawImage(img, 0, 0);

        const decoded = await decodeCanvas(canvas);
        onImageCapture?.(url);
        onResult(decoded.text);
      } catch (e) {
        console.error('Error decoding file:', e);
        URL.revokeObjectURL(url);
        setError(intl.formatMessage({ id: 'scanner.noCode' }));
      } finally {
        setDecoding(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    },
    [intl, onResult, onImageCapture]
  );

  const startCamera = useCallback(async () => {
    setError(null);
    setScanning(true);
    onImageCapture?.(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      streamRef.current = stream;

      const video = videoRef.current!;
      video.srcObject = stream;
      await video.play();

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;

      const scanFrame = async () => {
        if (!streamRef.current) {
          return;
        }

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);

        try {
          const decoded = await decodeCanvas(canvas);
          cleanupCamera();
          onResult(decoded.text);
          return;
        } catch {
        }

        scanTimerRef.current = setTimeout(scanFrame, SCAN_INTERVAL_MS);
      };

      scanTimerRef.current = setTimeout(scanFrame, 600);
    } catch {
      setScanning(false);
      setError(intl.formatMessage({ id: 'scanner.error' }));
    }
  }, [intl, onResult, onImageCapture, cleanupCamera]);

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        decodeFile(file);
      }
    },
    [decodeFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file?.type.startsWith('image/')) {
        decodeFile(file);
      }
    },
    [decodeFile]
  );

  return (
    <Box sx={ { display: 'flex', flexDirection: 'column', gap: 3 } }>
      { scanning ? (
        <>
          <Box sx={ { maxWidth: 480, mx: 'auto', width: '100%' } }>
            <video ref={ videoRef } playsInline muted style={ { width: '100%', borderRadius: 12 } }/>
          </Box>
          <Box sx={ { position: 'fixed', bottom: 24, left: 0, right: 0, textAlign: 'center', zIndex: 1300 } }>
            <Button variant="contained" color="error" onClick={ cleanupCamera } sx={ { borderRadius: 2, px: 4 } }>
              { intl.formatMessage({ id: 'scanner.stop' }) }
            </Button>
          </Box>
        </>
      ) : (
        <>
          <Box
            onDragOver={ (e) => {
              e.preventDefault();
              setDragOver(true);
            } }
            onDragLeave={ () => setDragOver(false) }
            onDrop={ handleDrop }
            onClick={ () => !decoding && fileInputRef.current?.click() }
            sx={ {
              border: '2px dashed',
              borderColor: dragOver ? 'primary.main' : 'divider',
              borderRadius: 3,
              p: { xs: 3, sm: 5 },
              textAlign: 'center',
              cursor: decoding ? 'wait' : 'pointer',
              transition: 'all 0.2s',
              bgcolor: dragOver ? alpha(theme.palette.primary.main, 0.06) : 'transparent',
              '&:hover': {
                borderColor: 'primary.light',
                bgcolor: alpha(theme.palette.primary.main, 0.03)
              }
            } }
          >
            { decoding ? (
              <CircularProgress size={ 40 }/>
            ) : (
              <>
                <CloudUploadIcon sx={ { fontSize: 48, color: 'text.secondary', mb: 1 } }/>
                <Typography variant="body1" color="text.secondary">
                  { intl.formatMessage({ id: 'home.uploadHint' }) }
                </Typography>
              </>
            ) }
            <input ref={ fileInputRef } type="file" accept="image/*" hidden onChange={ handleFileUpload }/>
          </Box>
          <Box sx={ { textAlign: 'center' } }>
            <Button
              variant="contained"
              size="large"
              startIcon={ <CameraAltIcon/> }
              onClick={ startCamera }
              sx={ { borderRadius: 2, px: 4 } }
            >
              { intl.formatMessage({ id: 'home.scanButton' }) }
            </Button>
          </Box>
        </>
      ) }

      { error && <Alert severity="warning">{ error }</Alert> }
    </Box>
  );
}
