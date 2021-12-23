// import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { SnackbarProvider } from 'notistack';
import { useEffect, useState } from 'react';
import '../styles/globals.css';
import { StoreProvider } from '../utils/Store';
import Loading from '../components/Loading';
function MyApp({ Component, pageProps }) {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    window.addEventListener('load', () => {
      setTimeout(() => setPageLoading(false), 800);
    });

    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);
  return (
    <>
      {pageLoading ? (
        <Loading />
      ) : (
        <SnackbarProvider
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <StoreProvider>
            <Component {...pageProps} />
          </StoreProvider>
        </SnackbarProvider>
      )}
    </>
  );
}
export default MyApp;
