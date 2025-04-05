const logger = {
  debug: (message: string, meta?: any) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(message, meta);
    }
  },
  info: (message: string, meta?: any) => {
    console.log(message, meta);
  },
  error: (message: string, error?: any) => {
    console.error(message, error);
  },
  warn: (message: string, meta?: any) => {
    console.warn(message, meta);
  }
};

export default logger;
