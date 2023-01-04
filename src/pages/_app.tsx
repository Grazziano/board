import type { AppProps } from 'next/app';
import { Header } from '../components/Header';
import '../styles/global.scss';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

import { SessionProvider } from 'next-auth/react';

export default function App({ Component, pageProps }: AppProps) {
  const initialOptions = {
    'client-id':
      'AdHHDtiXl4f9q8j0Ghzo5baTq-ohaPSrxN91MG1pQF-zGY_JvDJ7qKRmdQHVVtQIdgYlvoxI5PWDpUqN',
    currency: 'BRL',
    intent: 'capture',
  };

  return (
    <SessionProvider session={pageProps.session}>
      <PayPalScriptProvider options={initialOptions}>
        <Header />
        <Component {...pageProps} />
      </PayPalScriptProvider>
    </SessionProvider>
  );
}
