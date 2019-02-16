Object.defineProperty(module.exports, 'dispatch', {
  get: function() {
    return global.__rematch_dispatch;
  },
});
