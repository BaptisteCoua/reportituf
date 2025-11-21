function numberToColor(id: number) {
  let hash = id;
  hash = ((hash >> 16) ^ hash) * 0xffd9f3b;
  hash = ((hash >> 16) ^ hash) * 0xffd9f3b;
  hash = (hash >> 16) ^ hash;
  let hue = hash % 240;
  const saturation = 100;
  const lightness = 30;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export default numberToColor;
