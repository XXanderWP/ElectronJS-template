// Prevent crash application/worker

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', String(reason));
});

process.on('uncaughtException', (err, origin) => {
  console.error(
    `Caught exception: ${err}\n` +
      `Exception origin: ${origin} | Stack: ${err.stack}`
  );
});
