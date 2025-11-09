// Production-safe logger utility
// In production, only errors are logged. In development, all logs are shown.

const isDevelopment = process.env.NODE_ENV === 'development'

export const logger = {
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args)
    }
  },

  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info(...args)
    }
  },

  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args)
    }
    // In production, you might want to send warnings to an error tracking service
    // Example: Sentry.captureMessage(args.join(' '), 'warning')
  },

  error: (...args: any[]) => {
    // Always log errors, even in production
    console.error(...args)
    // In production, send to error tracking service
    // Example: Sentry.captureException(args[0])
  },

  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.debug(...args)
    }
  },
}

export default logger
