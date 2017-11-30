export default function(options) {
  return function(files, metalsmith) {
    let metadata = metalsmith.metadata();
    Object.assign(metadata, options);
  }
}