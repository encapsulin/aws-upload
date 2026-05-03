export function get(url) {
  return  fetch(url)
    .then((res) => res.text())
    .then((text) => JSON.parse(text));
}