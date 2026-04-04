import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { config } from '~/config/env';

export interface Alert {
  alertNumber: string;
  publicationDate?: string;
  risks?: string[];
  riskDescription?: string;
  supplementaryRiskDescription?: string;
  product?: AlertProduct;
  commercialization?: AlertCommercialization;
  measures?: AlertMeasures;
  media?: AlertMedia;
  additionalInformation?: string;
}

export interface AlertProduct {
  specificName?: string;
  type?: string;
  description?: string;
  brand?: string;
  family?: string;
  category?: string;
  counterfeit?: boolean;
  barcodes?: string[];
  batchNumbers?: string[];
  modelReferences?: string[];
  packagingDescription?: string;
  productionDates?: string;
}

export interface AlertCommercialization {
  originCountryName?: string;
  alertCountryName?: string;
  reactingCountries?: string[];
  soldOnline?: boolean;
  marketingStartDate?: string;
  marketingEndDate?: string;
  distributors?: string;
}

export interface AlertMeasures {
  recallPublishedOnline?: boolean;
  measuresList?: AlertMeasureItem[];
  companyRecalls?: AlertCompanyRecall[];
  consumerActions?: string[];
  compensationTerms?: string;
  procedureEndDate?: string;
}

export interface AlertMeasureItem {
  category?: string;
  otherCategory?: string;
  type?: string;
  effectiveDate?: string;
}

export interface AlertCompanyRecall {
  url?: string;
  language?: string;
}

export interface AlertMedia {
  photos?: string[];
  recallSheetUrl?: string;
  recallPdfUrl?: string;
}

export interface PaginatedAlerts {
  content: Alert[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

export const alertesApi = createApi({
  reducerPath: 'alertesApi',
  baseQuery: fetchBaseQuery({ baseUrl: config.apiBaseUrl }),
  endpoints: (builder) => ({
    getAlerteById: builder.query<Alert, string>({
      query: (id) => `/public/alerts/${id}`
    }),
    getAlerteByCodeBarres: builder.query<Alert, string>({
      query: (barcode) => `/public/alerts/barcode/${barcode}`
    }),
    getLatestAlertes: builder.query<PaginatedAlerts, number>({
      query: (page) => `/public/alerts/latest?page=${page}`
    }),
    searchAlertes: builder.query<PaginatedAlerts, { q: string; page: number }>({
      query: ({ q, page }) => `/public/alerts/search?q=${encodeURIComponent(q)}&page=${page}`
    })
  })
});

export const {
  useGetAlerteByIdQuery,
  useGetAlerteByCodeBarresQuery,
  useLazyGetAlerteByCodeBarresQuery,
  useGetLatestAlertesQuery,
  useSearchAlertesQuery
} = alertesApi;
