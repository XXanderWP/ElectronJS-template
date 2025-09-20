import { merge } from 'webpack-merge';
import { commonConfig } from './webpack.common.mjs';
import CopyPlugin from 'copy-webpack-plugin';

export default [
  merge(commonConfig, {
    entry: './src/backend/index.ts',
    target: 'electron-main',
    output: { filename: 'main.bundle.js' },
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: 'logo.png',
            to: 'logo.png',
          },
          {
            from: 'package.json',
            to: 'package.json',
            transform: (content, _path) => {
              const jsonContent = JSON.parse(content);
              const electronVersion = jsonContent.devDependencies.electron;

              delete jsonContent.devDependencies;
              delete jsonContent.optionalDependencies;
              delete jsonContent.scripts;
              delete jsonContent.build;
              delete jsonContent.description;
              delete jsonContent.keywords;
              delete jsonContent.homepage;
              delete jsonContent.bugs;
              delete jsonContent.repository;

              jsonContent.main = './main.bundle.js';
              jsonContent.scripts = { start: 'electron ./main.bundle.js' };
              jsonContent.devDependencies = { electron: electronVersion };

              return JSON.stringify(jsonContent, undefined, 2);
            },
          },
        ],
      }),
    ],
  }),
];
