import { Box, ChakraProvider } from '@chakra-ui/react';

import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <Box
        w='100%'
        minH='100vh'
        p={{ base: 4, md: 8 }}
        pb={16}
        bgColor='blue.700'
        color='whitesmoke'
      >
        <Component {...pageProps} />
      </Box>
    </ChakraProvider>
  );
}

export default MyApp;
