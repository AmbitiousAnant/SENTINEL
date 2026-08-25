import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sih.monitor',
  appName: 'Mental Health Monitor',
  webDir: 'out',
  server: {
    cleartext: true
  }
};

export default config;
