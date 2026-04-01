import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { useCallback, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

interface BarcodeScannerProps {
  onResult: (code: string) => void;
}

export function BarcodeScanner({ onResult }: BarcodeScannerProps) {
  const intl = useIntl();
  const theme = useTheme();
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const controlsRef = useRef<{ stop: () => void } | null>(null);

  const [scanning, setScanning] = useState(false);
  const [decoding, setDecoding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const startCamera = useCallback(async () => {
    setError(null);
    setScanning(true);
    try {
      const reader = new BrowserMultiFormatReader();
      const controls = await reader.decodeFromVideoDevice(
        undefined,
        videoRef.current!,
        (result) => {
          if (result) {
            controls.stop();
            setScanning(false);
            onResult(result.getText());
          }
        }
      );
      controlsRef.current = controls;
    } catch {
      setScanning(false);
      setError(intl.formatMessage({ id: 'scanner.error' }));
    }
  }, [intl, onResult]);

  const stopCamera = useCallback(() => {
    controlsRef.current?.stop();
    controlsRef.current = null;
    setScanning(false);
  }, []);

  const decodeFile = useCallback(async (file: File) => {
    setError(null);
    setDecoding(true);

    try {
      const reader = new BrowserMultiFormatReader();
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.src = url;
      await img.decode();

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);

      const luminanceSource = new (await import('@zxing/library')).HTMLCanvasElementLuminanceSource(canvas);
      const binaryBitmap = new (await import('@zxing/library')).BinaryBitmap(
        new (await import('@zxing/library')).HybridBinarizer(luminanceSource)
      );
      const result = reader.decodeBitmap(binaryBitmap);
      URL.revokeObjectURL(url);

      onResult(result.getText());
    } catch {
      setError(intl.formatMessage({ id: 'scanner.noCode' }));
    } finally {
      setDecoding(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [intl, onResult]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) decodeFile(file);
  }, [decodeFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) {
      decodeFile(file);
    }
  }, [decodeFile]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Drop zone */}
      <Box
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !decoding && fileInputRef.current?.click()}
        sx={{
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
        }}
      >
        {decoding ? (
          <CircularProgress size={40} />
        ) : (
          <>
            <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
            <Typography variant="body1" color="text.secondary">
              {intl.formatMessage({ id: 'home.uploadHint' })}
            </Typography>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleFileUpload}
        />
      </Box>

      {/* Camera button */}
      <Box sx={{ textAlign: 'center' }}>
        {!scanning ? (
          <Button
            variant="contained"
            size="large"
            startIcon={<CameraAltIcon />}
            onClick={startCamera}
            sx={{ borderRadius: 2, px: 4 }}
          >
            {intl.formatMessage({ id: 'home.scanButton' })}
          </Button>
        ) : (
          <Button variant="outlined" color="error" onClick={stopCamera}>
            {intl.formatMessage({ id: 'scanner.stop' })}
          </Button>
        )}
      </Box>

      {/* Camera feed */}
      {scanning && (
        <Box sx={{ maxWidth: 480, mx: 'auto', width: '100%' }}>
          <video ref={videoRef} style={{ width: '100%', borderRadius: 12 }} />
        </Box>
      )}

      {error && <Alert severity="warning">{error}</Alert>}
    </Box>
  );
}
