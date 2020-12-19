import mongoConfig from './mongoConfig';
import authConfig from './authConfig';

const devEnvironment = process.env.NODE_ENV === 'development';
const appPort = process.env.PORT || '8000';

export { devEnvironment, appPort };
export { mongoConfig, authConfig };
