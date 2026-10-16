export function optimizeBelowFoldImages() {
  document.querySelectorAll("main section:not(#home) img").forEach((image) => {
    image.loading = "lazy";
    image.decoding = "async";
  });
}
