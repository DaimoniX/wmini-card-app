export function toRGBString(r : number, g : number, b : number) {
  return `rgb(${r}, ${g}, ${b})`;
}

export function fromRGBString(rgb : string) {
  var match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (match === null)
    return undefined;
  return [
    parseInt(match[1]),
    parseInt(match[2]),
    parseInt(match[3])
  ];
}