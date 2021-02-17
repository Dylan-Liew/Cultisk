module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true, // this may or may not be necessary - you can try without it
      externals: ['zerorpc', '@azure/storage-blob', '@azure/storage-blob-changefeed'], // this excludes zerorpc from the front end
    },
  },
};
