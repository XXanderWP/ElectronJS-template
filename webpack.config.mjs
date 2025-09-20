import backend from './webpack.config.backend.mjs';
import frontend from './webpack.config.frontend.mjs';
import workers from './webpack.config.workers.mjs';

export default [...backend, ...frontend, ...workers];
