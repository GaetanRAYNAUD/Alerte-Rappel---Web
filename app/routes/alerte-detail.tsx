import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Link, useParams } from 'react-router';
import fr from '~/i18n/messages/fr.json';
import { useGetAlerteByIdQuery } from '~/store/alertesApi';

export function meta() {
  return [
    { title: `${ fr['alerte.detail'] } — ${ fr['app.title'] }` }
  ];
}

export default function AlerteDetail() {
  const intl = useIntl();
  const { '*': splatId } = useParams();
  const { data: alerte, isLoading } = useGetAlerteByIdQuery(splatId!);

  useEffect(() => {
    if (alerte) {
      document.title = `${alerte.product?.specificName ?? alerte.alertNumber} — ${fr['app.title']}`;
    }
  }, [alerte]);

  if (isLoading) {
    return (
      <Box sx={ { display: 'flex', justifyContent: 'center', py: 4 } }>
        <CircularProgress/>
      </Box>
    );
  }

  if (!alerte) {
    return (
      <Box>
        <Alert severity="warning" sx={ { mb: 2 } }>
          { intl.formatMessage({ id: 'alerte.notFound' }) }
        </Alert>
        <Button component={ Link } to="/" startIcon={ <ArrowBackIcon/> }>
          { intl.formatMessage({ id: 'alerte.backHome' }) }
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Button component={ Link } to="/" startIcon={ <ArrowBackIcon/> } sx={ { mb: 2 } }>
        { intl.formatMessage({ id: 'alerte.backHome' }) }
      </Button>

      <Card>
        <CardContent>
          <Box sx={ { display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 } }>
            { alerte.media?.photos && alerte.media.photos.length > 0 && (
              <Box sx={ { flexShrink: 0 } }>
                <PhotoCarousel photos={ alerte.media.photos } alt={ alerte.product?.specificName ?? '' }/>
              </Box>
            ) }

            <Box sx={ { flex: 1 } }>
              <Typography variant="h5" gutterBottom sx={ { fontWeight: 'bold' } }>
                { alerte.product?.specificName ?? alerte.alertNumber }
              </Typography>

              { alerte.publicationDate && (
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  { intl.formatMessage({ id: 'alerte.datePublication' }) } : { intl.formatDate(alerte.publicationDate, {
                  year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                }) }
                </Typography>
              ) }

              { alerte.product?.description && (
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  { alerte.product.description }
                </Typography>
              ) }

              <Box sx={ { display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 } }>
                { alerte.product?.brand && <Chip label={ alerte.product.brand } size="small"/> }
                { alerte.product?.category && <Chip label={ alerte.product.category } size="small" variant="outlined"/> }
              </Box>

              { alerte.riskDescription && (
                <Alert severity="error" sx={ { mb: 2 } }>
                  <Typography variant="subtitle2" sx={ { fontWeight: 'bold' } }>
                    { intl.formatMessage({ id: 'alerte.motifRappel' }) }
                  </Typography>
                  <Typography variant="body2">{ alerte.riskDescription }</Typography>
                </Alert>
              ) }

              { alerte.product?.barcodes && alerte.product.barcodes.length > 0 && (
                <Box sx={ { display: 'flex', gap: 1, flexWrap: 'wrap' } }>
                  { alerte.product.barcodes.map((code) => (
                    <Chip
                      key={ code }
                      label={ `${ intl.formatMessage(
                        { id: 'alerte.codeBarres' },
                        { count: alerte.product!.barcodes!.length }
                      ) } : ${ code }` }
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  )) }
                </Box>
              ) }
            </Box>
          </Box>

        </CardContent>
      </Card>

      <Card sx={ { mt: 2 } }>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={ { fontWeight: 'bold' } }>
            { intl.formatMessage({ id: 'alerte.infoProduit' }) }
          </Typography>
          { alerte.product?.description && (
            <Field label={ intl.formatMessage({ id: 'alerte.description' }) } value={ alerte.product.description }/>
          ) }
          { alerte.product?.brand && (
            <Field label={ intl.formatMessage({ id: 'alerte.marque' }) } value={ alerte.product.brand }/>
          ) }
          { alerte.product?.category && (
            <Field label={ intl.formatMessage({ id: 'alerte.categorie' }) } value={ alerte.product.category }/>
          ) }
          { alerte.product?.family && (
            <Field label={ intl.formatMessage({ id: 'alerte.sousCategorie' }) } value={ alerte.product.family }/>
          ) }
          { alerte.product?.batchNumbers && alerte.product.batchNumbers.length > 0 && (
            <Alert severity="info" sx={ { mb: 2 } }>
              <Typography variant="subtitle2" sx={ { fontWeight: 'bold' } }>
                { intl.formatMessage({ id: 'alerte.numerosLots' }) }
              </Typography>
              <Box sx={ { display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 } }>
                { alerte.product.batchNumbers.map((lot) => (
                  <Chip key={ lot } label={ lot } size="small" color="info" variant="outlined"/>
                )) }
              </Box>
            </Alert>
          ) }
          { alerte.product?.productionDates && (
            <Alert severity="info" sx={ { mb: 2 } }>
              <Typography variant="subtitle2" sx={ { fontWeight: 'bold' } }>
                { intl.formatMessage({ id: 'alerte.datesProduction' }) }
              </Typography>
              <Typography variant="body2">{ alerte.product.productionDates }</Typography>
            </Alert>
          ) }
          { (alerte.commercialization?.marketingStartDate || alerte.commercialization?.marketingEndDate) && (
            <Field
              label={ intl.formatMessage({ id: 'alerte.dateCommercialisation' }) }
              value={ [
                alerte.commercialization.marketingStartDate && intl.formatDate(alerte.commercialization.marketingStartDate, { year: 'numeric', month: 'long', day: 'numeric' }),
                alerte.commercialization.marketingEndDate && intl.formatDate(alerte.commercialization.marketingEndDate, { year: 'numeric', month: 'long', day: 'numeric' })
              ].filter(Boolean).join(' — ') }
            />
          ) }
          { alerte.commercialization?.distributors && (
            <Field label={ intl.formatMessage({ id: 'alerte.distributeur' }) } value={ alerte.commercialization.distributors }/>
          ) }
          { alerte.commercialization?.reactingCountries && alerte.commercialization.reactingCountries.length > 0 && (
            <Field
              label={ intl.formatMessage({ id: 'alerte.zoneVente' }) }
              value={ alerte.commercialization.reactingCountries.map((code) => {
                const key = `country.${code}`;
                return intl.messages[key] ? intl.formatMessage({ id: key }) : code;
              }).join(', ') }
            />
          ) }
        </CardContent>
      </Card>

      <Card sx={ { mt: 2 } }>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={ { fontWeight: 'bold' } }>
            { intl.formatMessage({ id: 'alerte.infoRappel' }) }
          </Typography>
          { alerte.riskDescription && (
            <Field label={ intl.formatMessage({ id: 'alerte.motifRappel' }) } value={ alerte.riskDescription }/>
          ) }
          { alerte.risks && alerte.risks.length > 0 && (
            <Field label={ intl.formatMessage({ id: 'alerte.risques' }) } value={ alerte.risks.join(', ') }/>
          ) }
          { alerte.measures?.consumerActions && alerte.measures.consumerActions.length > 0 && (
            <Field label={ intl.formatMessage({ id: 'alerte.conduiteATenir' }) } value={ alerte.measures.consumerActions.join('\n') } multiline/>
          ) }
          { alerte.measures?.compensationTerms && (
            <Field label={ intl.formatMessage({ id: 'alerte.modalitesCompensation' }) } value={ alerte.measures.compensationTerms }/>
          ) }
          { alerte.measures?.procedureEndDate && (
            <Field
              label={ intl.formatMessage({ id: 'alerte.finProcedure' }) }
              value={ intl.formatDate(alerte.measures.procedureEndDate, { year: 'numeric', month: 'long', day: 'numeric' }) }
            />
          ) }
        </CardContent>
      </Card>
    </Box>
  );
}

function PhotoCarousel({ photos, alt }: { photos: string[]; alt: string }) {
  const [index, setIndex] = useState(0);
  const [modalIndex, setModalIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setModalIndex(index);
    setOpen(true);
  };

  return (
    <>
      <Box sx={ { display: 'flex', flexDirection: 'column', alignItems: 'center', my: 2 } }>
        <Box sx={ { position: 'relative', cursor: 'pointer' } } onClick={ handleOpen }>
          <Box
            component="img"
            src={ photos[index] }
            alt={ alt }
            sx={ { maxWidth: 250, maxHeight: 250, borderRadius: 1, objectFit: 'contain', display: 'block' } }
          />
          <IconButton
            size="small"
            sx={ {
              position: 'absolute',
              top: 8,
              right: 8,
              color: '#fff',
              bgcolor: 'rgba(0,0,0,0.4)',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' }
            } }
          >
            <ZoomInIcon fontSize="small"/>
          </IconButton>
          { photos.length > 1 && (
            <Box
              sx={ {
                position: 'absolute',
                bottom: 8,
                left: 0,
                right: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.5
              } }
            >
              <IconButton
                onClick={ (e) => { e.stopPropagation(); setIndex((i) => i - 1); } }
                disabled={ index === 0 }
                size="small"
                sx={ { color: '#fff', bgcolor: 'rgba(0,0,0,0.4)', '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' } } }
              >
                <ChevronLeftIcon fontSize="small"/>
              </IconButton>
              <Typography
                variant="caption"
                sx={ { bgcolor: 'rgba(0,0,0,0.6)', color: '#fff', px: 1, py: 0.25, borderRadius: 1 } }
              >
                { index + 1 } / { photos.length }
              </Typography>
              <IconButton
                onClick={ (e) => { e.stopPropagation(); setIndex((i) => i + 1); } }
                disabled={ index === photos.length - 1 }
                size="small"
                sx={ { color: '#fff', bgcolor: 'rgba(0,0,0,0.4)', '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' } } }
              >
                <ChevronRightIcon fontSize="small"/>
              </IconButton>
            </Box>
          ) }
        </Box>
      </Box>

      <Dialog open={ open } onClose={ () => setOpen(false) } maxWidth="lg">
        <Box sx={ { bgcolor: 'black', display: 'flex', flexDirection: 'column', alignItems: 'center' } }>
          <Box sx={ { position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' } }>
            <IconButton
              onClick={ () => setOpen(false) }
              sx={ { position: 'absolute', top: 8, right: 8, color: '#fff', bgcolor: 'rgba(0,0,0,0.4)', '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' }, zIndex: 1 } }
            >
              <CloseIcon/>
            </IconButton>
            { photos.length > 1 && (
              <IconButton
                onClick={ () => setModalIndex((i) => i - 1) }
                disabled={ modalIndex === 0 }
                sx={ { position: 'absolute', left: 8, color: '#fff', bgcolor: 'rgba(0,0,0,0.4)', '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' } } }
              >
                <ChevronLeftIcon/>
              </IconButton>
            ) }
            <Box
              component="img"
              src={ photos[modalIndex] }
              alt={ alt }
              sx={ { maxWidth: '90vw', maxHeight: '70vh', objectFit: 'contain' } }
            />
            { photos.length > 1 && (
              <IconButton
                onClick={ () => setModalIndex((i) => i + 1) }
                disabled={ modalIndex === photos.length - 1 }
                sx={ { position: 'absolute', right: 8, color: '#fff', bgcolor: 'rgba(0,0,0,0.4)', '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' } } }
              >
                <ChevronRightIcon/>
              </IconButton>
            ) }
          </Box>
          { photos.length > 1 && (
            <Box sx={ { display: 'flex', gap: 1, p: 1.5, overflowX: 'auto', width: '100%', bgcolor: '#fff', justifyContent: 'center' } }>
              { photos.map((url, i) => (
                <Box
                  key={ url }
                  component="img"
                  src={ url }
                  alt={ alt }
                  onClick={ () => setModalIndex(i) }
                  sx={ {
                    width: 60,
                    height: 60,
                    objectFit: 'cover',
                    borderRadius: 1,
                    cursor: 'pointer',
                    border: i === modalIndex ? '2px solid #fff' : '2px solid transparent',
                    opacity: i === modalIndex ? 1 : 0.5,
                    '&:hover': { opacity: 1 }
                  } }
                />
              )) }
            </Box>
          ) }
        </Box>
      </Dialog>
    </>
  );
}

function Field({ label, value, multiline }: { label: string; value: string; multiline?: boolean }) {
  return (
    <Box sx={ { mb: 2 } }>
      <Typography variant="subtitle2" color="text.secondary">{ label }</Typography>
      <Typography variant="body1" sx={ multiline ? { whiteSpace: 'pre-line' } : undefined }>{ value }</Typography>
    </Box>
  );
}
