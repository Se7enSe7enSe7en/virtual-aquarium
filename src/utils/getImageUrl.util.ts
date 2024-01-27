// https://stackoverflow.com/a/76104080
export function getImageUrl(imgUrl: string) {
  return new URL(`../assets/${imgUrl}`, import.meta.url).href
}