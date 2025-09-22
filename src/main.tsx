import React from 'react';
import ReactDOM from 'react-dom/client';

// Chakra UI
import {
  ChakraProvider,
  ColorModeScript,
  extendTheme,
  type ThemeConfig,
} from '@chakra-ui/react';

// React Router
import { BrowserRouter } from 'react-router-dom';

// App Components
import App from './App';
import { CyphrProvider } from './CypherProvider';

console.log('VITE_WC_PROJECT_ID:', import.meta.env.VITE_WC_PROJECT_ID);
console.log('VITE_TEST:', import.meta.env.VITE_TEST);

// 🌈 Theme Setup
const themeConfig: ThemeConfig = {
  initialColorMode: 'system',
  useSystemColorMode: true,
};
const theme = extendTheme({ config: themeConfig });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <ChakraProvider theme={theme}>
      {/* ✅ Only use CypherProvider (includes Wagmi + Query + Context) */}
      <CyphrProvider
        projectId={import.meta.env.VITE_WC_PROJECT_ID}
        rpcUrl={import.meta.env.VITE_RPC_URL}
        secretKey={import.meta.env.VITE_SECRET_KEY} // if using one
        initialState={undefined}
      >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </CyphrProvider>
    </ChakraProvider>
  </React.StrictMode>
);
