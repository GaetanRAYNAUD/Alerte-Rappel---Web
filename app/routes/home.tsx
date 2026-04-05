import CameraAltIcon from '@mui/icons-material/CameraAlt';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import SearchIcon from '@mui/icons-material/Search';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useCallback, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { AlerteRecallDialog } from '~/components/AlerteRecallDialog';
import { BarcodeScanner } from '~/components/BarcodeScanner/BarcodeScanner';
import fr from '~/i18n/messages/fr.json';
import type { Alert as AlertType } from '~/store/alertesApi';
import { useLazyGetAlerteByCodeBarresQuery } from '~/store/alertesApi';

export function meta() {
  return [
    { title: fr['app.title'] },
    { name: 'description', content: fr['app.subtitle'] }
  ];
}

const features = [
  { icon: CameraAltIcon, titleId: 'home.feature.scan.title', descId: 'home.feature.scan.description' },
  { icon: ImageSearchIcon, titleId: 'home.feature.upload.title', descId: 'home.feature.upload.description' },
  { icon: SearchIcon, titleId: 'home.feature.search.title', descId: 'home.feature.search.description' }
] as const;

export default function Home() {
  const intl = useIntl();
  const [triggerSearch] = useLazyGetAlerteByCodeBarresQuery();
  const [notFoundCode, setNotFoundCode] = useState<string | null>(null);
  const [matchedAlerte, setMatchedAlerte] = useState<AlertType | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const prevImageUrlRef = useRef<string | null>(null);

  const handleImageCapture = useCallback((url: string | null) => {
    if (prevImageUrlRef.current) {
      URL.revokeObjectURL(prevImageUrlRef.current);
    }
    prevImageUrlRef.current = url;
    setImageUrl(url);
  }, []);

  const handleResult = useCallback(async (code: string) => {
    setNotFoundCode(null);
    try {
      const { data: alerte } = await triggerSearch(code, true);
      if (alerte) {
        setMatchedAlerte(alerte);
      } else {
        setNotFoundCode(code);
      }
    } catch {
      setNotFoundCode(code);
    }
  }, [triggerSearch]);

  return (
    <Box>
      {/* Hero */}
      <Box sx={{ textAlign: 'center', py: { xs: 4, sm: 8 } }}>
        {!scanning && (
          <>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{ fontWeight: 'bold', fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' } }}
            >
              {intl.formatMessage({ id: 'home.hero.title' })}
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ mb: 5, maxWidth: 600, mx: 'auto', fontSize: { xs: '1rem', sm: '1.25rem' } }}
            >
              {intl.formatMessage({ id: 'home.hero.subtitle' })}
            </Typography>
          </>
        )}

        <Box sx={{ maxWidth: 500, mx: 'auto' }}>
          <BarcodeScanner
            onResult={handleResult}
            onImageCapture={handleImageCapture}
            onScanningChange={setScanning}
          />
          {notFoundCode && (
            <Alert severity="info" sx={{ mt: 2 }}>
              {intl.formatMessage({ id: 'scanner.notFound' }, { code: notFoundCode })}
            </Alert>
          )}
          {imageUrl && (
            <Box
              component="img"
              src={imageUrl}
              alt="Uploaded barcode"
              sx={{
                mt: 2,
                maxWidth: '100%',
                maxHeight: 200,
                borderRadius: 2,
                objectFit: 'contain'
              }}
            />
          )}
        </Box>
      </Box>

      {/* Feature cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
          gap: 3,
          mt: 2
        }}
      >
        {features.map(({ icon: Icon, titleId, descId }) => (
          <Card key={titleId} variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Icon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                {intl.formatMessage({ id: titleId })}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {intl.formatMessage({ id: descId })}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <AlerteRecallDialog alerte={matchedAlerte} onClose={() => setMatchedAlerte(null)} />
    </Box>
  );
}
