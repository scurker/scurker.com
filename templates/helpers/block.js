module.exports = function(name) {
  return ((this.blocks && this.blocks[name]) || []).join('\n');
};