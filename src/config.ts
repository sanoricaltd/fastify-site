export const evnOptions = {
  schema: {
    type: 'object',
    required: ['SITE_CODE', 'DOMAIN'],
    properties: {
      SITE_CODE: {
        type: 'string',
      },
      DOMAIN: {
        type: 'string',
      },
      PORT: {
        type: 'string',
        default: '8080',
      },
      API_URI: {
        type: 'string',
        default: 'https://pixprotection.com',
      },
      // SENTRY_DSN: {
      //   type: 'string',
      //   default: 'https://6f95987657f91d65738ef436037dd981@o1327791.ingest.us.sentry.io/4507928643371008',
      // },
      LOADING_SCREEN_VARIATION: {
        type: 'string',
        default: '1',
      },
      LIGHT_THEME_CODE: {
        type: 'string',
        default: '1',
      },
      DARK_THEME_CODE: {
        type: 'string',
        default: '1',
      },
    },
  },
  dotenv: true,
};

export const loadingColorPalettes: Record<
  string,
  {
    background: string;
    foreground: string;
    accent: string;
  }
> = {
  // Light Colors
  // -=-=-=-=-=-=-=-=-=-=

  1: {
    // peachy_sunrise
    background: '#f9f9f9',
    foreground: '#333333',
    accent: '#ffcc80',
  },
  2: {
    // misty_blue
    background: '#fafafa',
    foreground: '#1c1c1c',
    accent: '#b0bec5',
  },
  3: {
    // nordic_sun
    background: '#f2f2f2',
    foreground: '#2c3e50',
    accent: '#f39c12',
  },
  4: {
    // miami_sunset
    background: '#faf3e0',
    foreground: '#2d3436',
    accent: '#ff7675',
  },
  5: {
    // tropical_splash
    background: '#5ac1f1',
    foreground: '#222',
    accent: '#fece68',
  },
  6: {
    // desert_dusk
    background: '#f4e1d2',
    foreground: '#4a403a',
    accent: '#f08a5d',
  },
  7: {
    // lavender_dreams
    background: '#f3e5f5',
    foreground: '#4a148c',
    accent: '#d500f9',
  },
  8: {
    // arctic_breeze
    background: '#e0f7fa',
    foreground: '#00796b',
    accent: '#00bcd4',
  },

  // Dark Colors
  // -=-=-=-=-=-=-=-=-=-=

  9: {
    // dark_rose
    background: '#121212',
    foreground: '#e0e0e0',
    accent: '#ff4081',
  },
  10: {
    // neon_ocean
    background: '#0a0f1e',
    foreground: '#cfd8dc',
    accent: '#00e5ff',
  },
  11: {
    // gothic_crimson
    background: '#1c1c24',
    foreground: '#f5f5f5',
    accent: '#e74c3c',
  },
  12: {
    // emerald_twilight
    background: '#001f3f',
    foreground: '#7fdbff',
    accent: '#2ecc40',
  },
  13: {
    // copper_rust
    background: '#3e2723',
    foreground: '#ffe0b2',
    accent: '#ff6f00',
  },
};
