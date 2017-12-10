module.exports = function(name, context) {
  let blocks = this.blocks || (this.blocks = {})
    , block = blocks[name] || (blocks[name] = []);
  block.push(context.fn(this));
};