module.exports = function(value, test, context) {
  if(value && value === test) {
    return context.fn(this);
  } else {
    return context.inverse(this);
  }
};