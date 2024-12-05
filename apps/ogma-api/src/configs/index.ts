import { Store } from 'confidence';

const doc = {
  port: {
    $env: 'PORT',
    $default: 3000
  },
  isProduction: {
    $filter: { $env: 'NODE_ENV' },
    production: true,
    $default: false,
  },
};

const store = new Store(doc);
export const getConfig = (key: string) => store.get(key);
