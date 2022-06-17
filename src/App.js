import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { SnackbarProvider } from 'notistack';
// routes
import Router from './routes';
// theme
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/charts/BaseOptionChart';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <HelmetProvider>
      <SnackbarProvider maxSnack={1}>
        <BrowserRouter>
          <ThemeConfig>
            <ScrollToTop />
            <GlobalStyles />
            <BaseOptionChartStyle />
            <Router />
          </ThemeConfig>
        </BrowserRouter>
      </SnackbarProvider>
    </HelmetProvider>
  );
}
