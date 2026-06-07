const fs = require('fs');
const m90Colors = ['#1b3318', '#3e5c2f', '#a19c86', '#111111'];
function generateSplinterPattern(width, height, scale = 65, jitterFactor = 0.85) {
  const cols = Math.ceil(width / scale) + 3;
  const rows = Math.ceil(height / scale) + 3;
  const gridPoints = [];
  for (let r = 0; r < rows; r++) {
    gridPoints[r] = [];
    for (let c = 0; c < cols; c++) {
      const originX = (c - 1) * scale;
      const originY = (r - 1) * scale;
      const maxOffset = scale * jitterFactor * 0.5;
      const dispX = (Math.random() - 0.5) * maxOffset;
      const dispY = (Math.random() - 0.5) * maxOffset;
      gridPoints[r][c] = { x: originX + dispX, y: originY + dispY };
    }
  }
  const polygons = [];
  for (let r = 0; r < rows - 1; r++) {
    for (let c = 0; c < cols - 1; c++) {
      const nodeNW = gridPoints[r][c];
      const nodeNE = gridPoints[r][c+1];
      const nodeSW = gridPoints[r+1][c];
      const nodeSE = gridPoints[r+1][c+1];
      polygons.push({ points: [nodeNW, nodeNE, nodeSW], color: m90Colors[0] });
      polygons.push({ points: [nodeNE, nodeSE, nodeSW], color: m90Colors[0] });
    }
  }
  return polygons;
}
const polygons = generateSplinterPattern(1200, 1200);
let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200" width="1200" height="1200">\n`;
for (const poly of polygons) {
  const pointsStr = poly.points.map(p => `${p.x},${p.y}`).join(' ');
  svgContent += `  <polygon points="${pointsStr}" fill="${poly.color}" stroke="#000" stroke-width="0.5" />\n`;
}
svgContent += `</svg>`;
fs.writeFileSync('test.svg', svgContent);
