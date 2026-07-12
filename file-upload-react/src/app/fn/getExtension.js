export function getExtension(filename) {
  return filename.split('.').pop();
}

// console.log(getExtension('photo.jpg')); // jpg
// console.log(getExtension('archive.tar.gz')); // gz