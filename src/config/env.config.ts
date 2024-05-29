export const ENV_CONFIG = () => {
  return {
    PORT: process.env["PORT"],
    NODE_ENV: process.env["NODE_ENV"],
  };
};
