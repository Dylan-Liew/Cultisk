module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true, // this may or may not be necessary - you can try without it
      externals: ['zerorpc'], // this excludes zerorpc from the front end
    },
  },
};
