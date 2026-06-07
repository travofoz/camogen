import { Polygon } from './camoEngine';

export function exportToSvg(polygons: Polygon[], width: number, height: number): void {
  let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">\n`;
  
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
