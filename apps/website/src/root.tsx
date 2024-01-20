import { component$, useContextProvider, useStore, useStyles$ } from '@builder.io/qwik';
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister,
} from '@builder.io/qwik-city';

import { APP_STATE_CONTEXT_ID } from './_state/app-state-context-id';
import { AppState } from './_state/app-state.type';
import { useCSSTheme } from './_state/use-css-theme';
import { OLD_APP_STATE_CONTEXT_ID } from './constants';
import globalStyles from './global.css?inline';
import { OldAppState } from './types';
import { RouterHead } from './components/router-head/router-head';

export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Don't remove the `<head>` and `<body>` elements.
   */
  useStyles$(globalStyles);

  const appState = useStore<AppState>({
    mode: 'dark',
    isSidebarOpened: false,
    featureFlags: {
      showFluffy: import.meta.env.DEV,
    },
  });

  useContextProvider(APP_STATE_CONTEXT_ID, appState);

  // TODO: remove this old state once refactored
  const state = useStore<OldAppState>({
    darkMode: false,
  });
  useContextProvider(OLD_APP_STATE_CONTEXT_ID, state);

  useCSSTheme(appState);

  return (
    <QwikCityProvider>
      <head>
        <meta charSet="utf-8" />
        <link rel="manifest" href="/manifest.json" />
        <RouterHead />
      </head>
      <body
        lang="en"
        class={{
          'overflow-y-hidden': appState.isSidebarOpened,
        }}
      >
        <RouterOutlet />
        <ServiceWorkerRegister />
      </body>
    </QwikCityProvider>
  );
});
