import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { SnackbarProvider } from 'notistack';
import { useTranslation } from 'react-i18next';
// routes
import Router from './routes';
// theme
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/charts/BaseOptionChart';
import './service/i18n';
import LanguageContext from './contexts/LanguageContext';

// ----------------------------------------------------------------------

export default function App() {
  const { i18n } = useTranslation();

  return (
    <HelmetProvider>
      <SnackbarProvider maxSnack={1}>
        <LanguageContext.Provider
          // eslint-disable-next-line react/jsx-no-constructed-context-values
          value={{
            language: 'en',
            changeLanguage: () => {
              i18n.changeLanguage(i18n.language === 'en' ? 'zh' : 'en').catch(console.log);
            }
          }}
        >
          <BrowserRouter>
            <ThemeConfig>
              <ScrollToTop />
              <GlobalStyles />
              <BaseOptionChartStyle />
              <Router />
            </ThemeConfig>
          </BrowserRouter>
        </LanguageContext.Provider>
      </SnackbarProvider>
    </HelmetProvider>
  );
}
