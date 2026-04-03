import { reactRouter } from '@react-router/dev/vite';
import basicSsl from '@vitejs/plugin-basic-ssl';
import { defineConfig, type UserConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => {
  const isLocalEnv = mode === 'development';

  const config: UserConfig = {
    plugins: [reactRouter(), tsconfigPaths()]
  };

  if (isLocalEnv) {
    config.plugins?.push(basicSsl());
    config.server = {
      host: true,
      port: 3000
    };
  }

  return config;
});
