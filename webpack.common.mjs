import path from 'path';
import { fileURLToPath } from 'url';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import webpack from 'webpack';
import TerserJsPlugin from 'terser-webpack-plugin';
import Dotenv from 'dotenv-webpack';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isEnvProduction = process.env.NODE_ENV === 'production';

const isEnvDevelopment =
  process.env.NODE_ENV === 'development' || process.env.WORK_DEV === '1';

export const commonConfig = {
  devtool: isEnvDevelopment ? 'source-map' : false,
  mode: isEnvProduction ? 'production' : 'development',
  output: { path: path.join(__dirname, 'dist') },
  node: { __dirname: false, __filename: false },
  plugins: [
    new webpack.NormalModuleReplacementPlugin(/^\S+\/\S+\.js$/, resource => {
      resource.request = resource.request.replace(/\.js$/, '');
    }),
    new Dotenv(),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: './tsconfig.json',
        extensions: ['.js', '.json', '.ts', '.tsx'],
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.m?js/,
        resolve: { fullySpecified: false },
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'esbuild-loader',
      },
      {
        test: /\.(less|scss|css)$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                strictMath: true,
              },
            },
          },
        ],
      },
      {
        test: /\.(webp|webm|jpg|png|svg|ico|icns|mp3|gif)$/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
        },
      },
    ],
  },
  optimization: {
    minimize: !isEnvDevelopment,
    minimizer: isEnvDevelopment
      ? undefined
      : [
          new TerserJsPlugin({
            minify: TerserJsPlugin.swcMinify,
            parallel: true,
            extractComments: 'all',
          }),
        ],
    removeAvailableModules: true,
    removeEmptyChunks: true,
    splitChunks: false,
  },
};
