export function canvasToImage(canvas) {
  const img = new Image();
  img.src = canvas.toDataURL('image/png');
  return img;
}
