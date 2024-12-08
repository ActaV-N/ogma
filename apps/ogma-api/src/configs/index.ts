import { Store } from "confidence";

const doc = {
  port: {
    $env: "PORT",
    $default: 3000,
  },
  isProduction: {
    $filter: { $env: "NODE_ENV" },
    production: true,
    $default: false,
  },
  db: {
    host: {
      $env: "DB_HOST",
    },
    port: {
      $env: "DB_PORT",
    },
    username: {
      $env: "DB_USERNAME",
    },
    password: {
      $env: "DB_PASSWORD",
    },
    database: {
      $env: "DB_DATABASE",
    },
  },
  anthropic: {
    apiKey: {
      $env: "ANTHROPIC_API_KEY",
    },
  },
};

const store = new Store(doc);
export const getConfig = (key: string) => store.get(key);
