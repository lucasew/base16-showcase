import * as Sentry from '@sentry/sveltekit';

Sentry.init({
  dsn: 'https://0ac0f8d6ff028ab222c24dc037b869b6@o4508616651505664.ingest.us.sentry.io/4510855919828992',


  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: import.meta.env.DEV,
});