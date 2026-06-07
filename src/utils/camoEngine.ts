export const m90Colors = [
  '#1b3318', // Deep Forest Green
  '#3e5c2f', // Light Army Green
  '#a19c86', // Sandy Gray/Khaki
  '#111111'  // Tactical Black
];

export type Point = { x: number; y: number };
export type Polygon = {
  id: string;
  points: Point[];
  color: string;
  colorIndex: number;
};

export function generateSplinterPattern(
  width: number,
  height: number,
  scale: number = 65,
  jitterFactor: number = 0.85
): Polygon[] {
  const cols = Math.ceil(width / scale) + 3;
  const rows = Math.ceil(height / scale) + 3;
  
  const gridPoints: Point[][] = [];
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

  const polygons: Polygon[] = [];
  
  for (let r = 0; r < rows - 1; r++) {
    for (let c = 0; c < cols - 1; c++) {
      const nodeNW = gridPoints[r][c];
      const nodeNE = gridPoints[r][c+1];
      const nodeSW = gridPoints[r+1][c];
      const nodeSE = gridPoints[r+1][c+1];

      // Segment Alpha
      const c1 = Math.floor(Math.random() * m90Colors.length);
      polygons.push({
        id: `poly-${r}-${c}-a`,
        points: [nodeNW, nodeNE, nodeSW],
        color: m90Colors[c1],
        colorIndex: c1 + 1 // Paint by numbers (1-4)
      });

      // Segment Beta
      const c2 = Math.floor(Math.random() * m90Colors.length);
      polygons.push({
        id: `poly-${r}-${c}-b`,
        points: [nodeNE, nodeSE, nodeSW],
        color: m90Colors[c2],
        colorIndex: c2 + 1
      });
    }
  }
  
  return polygons;
}
