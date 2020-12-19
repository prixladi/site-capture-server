import { devEnvironment } from '../configs';

const appoloLogger = {
  debug: (message?: any): void => {
    if (devEnvironment) {
      console.debug(message);
    }
  },
  info: (message?: any): void => {
    if (devEnvironment) {
      console.debug(message);
    }
  },
  warn: (message?: any): void => {
    console.warn(message);
  },
  error: (message?: any): void => {
    console.error(message);
  },
};

export default appoloLogger;
