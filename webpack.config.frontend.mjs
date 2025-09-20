import { merge } from 'webpack-merge';
import { commonConfig } from './webpack.common.mjs';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const preloadConfig = merge(commonConfig, {
  entry: './src/preload/preload.ts',
  target: 'electron-preload',
  output: { filename: 'preload.bundle.js' },
});

const rendererConfig = merge(commonConfig, {
  entry: './src/frontend/index.tsx',
  target: 'electron-renderer',
  output: { filename: 'renderer.bundle.js' },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/frontend/index.html'),
    }),
  ],

  devServer: {
    compress: true,
    port: 8888,
    host: '127.0.0.1',
  },
});

export default [preloadConfig, rendererConfig];
