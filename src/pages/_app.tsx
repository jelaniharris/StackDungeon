import { AppProps } from 'next/app';

import '@/styles/globals.scss';

import { Providers } from '@/store/provider';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Providers>
      <Component {...pageProps} />
    </Providers>
  );
}

export default MyApp;
