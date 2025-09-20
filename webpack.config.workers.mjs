import fs from 'fs';
import path from 'path';
import { merge } from 'webpack-merge';
import { commonConfig } from './webpack.common.mjs';

const exportWorkersList = [];
const exportWorkersListIgnore = [];
const workersMainDir = './src/backend/workers';

const workersIgnoreList = [];

const worker = workerName => {
  return merge(commonConfig, {
    entry: `./src/backend/workers/${workerName}.ts`,
    target: 'node',
    output: { filename: `workers/${workerName}.js` },
    plugins: [],
  });
};

const scanWorkersDir = (folder = workersMainDir) => {
  fs.readdirSync(folder).forEach(file => {
    const filePath = `${folder}/${file}`.replace(`${workersMainDir}/`, '');

    if (workersIgnoreList.includes(filePath)) {
      exportWorkersListIgnore.push(filePath.replace('.ts', ''));
    } else if (!file.startsWith('worker.')) {
      if (fs.statSync(path.join(folder, file)).isDirectory()) {
        scanWorkersDir(`${folder}/${file}`);
      } else {
        exportWorkersList.push(filePath.replace('.ts', ''));
      }
    }
  });
};

console.log(`Scan workers started`);
console.time(`Scan workers ended`);
scanWorkersDir();
console.timeEnd(`Scan workers ended`);

if (exportWorkersList.length > 0) {
  console.log(
    `Build x${exportWorkersList.length} workers (${exportWorkersList.join(', ')})`
  );
}

if (exportWorkersListIgnore.length > 0) {
  console.log(
    `Ignore x${exportWorkersListIgnore.length} workers (${exportWorkersListIgnore.join(', ')})`
  );
}

export default [...exportWorkersList.map(q => worker(q))];
