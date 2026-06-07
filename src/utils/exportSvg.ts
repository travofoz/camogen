import { Polygon } from './camoEngine';

export function exportToSvg(polygons: Polygon[], width: number, height: number): void {
  let svgContent = `<?xml version="1.0" encoding="utf-8"?>\n`;
  svgContent += `<!-- Generator: M90 AR Camouflage Engine -->\n`;
  svgContent += `<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n`;
  svgContent += `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">\n`;
  
  for (const poly of polygons) {
    const pointsStr = poly.points.map(p => `${p.x},${p.y}`).join(' ');
    svgContent += `  <polygon points="${pointsStr}" fill="${poly.color}" stroke="#000" stroke-width="0.5" />\n`;
  }
  
  svgContent += `</svg>`;
  
  const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `m90-camo-${Date.now()}.svg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
