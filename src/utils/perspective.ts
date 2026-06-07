export type Point = { x: number; y: number };

// Solves a system of linear equations A * x = B using Gaussian elimination
function solve(A: number[][], B: number[]): number[] | null {
  const n = A.length;
  for (let i = 0; i < n; i++) {
    // Find pivot
    let maxEl = Math.abs(A[i][i]);
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(A[k][i]) > maxEl) {
        maxEl = Math.abs(A[k][i]);
        maxRow = k;
      }
    }

    // Swap maximum row with current row
    for (let k = i; k < n; k++) {
      const tmp = A[maxRow][k];
      A[maxRow][k] = A[i][k];
      A[i][k] = tmp;
    }
    const tmp = B[maxRow];
    B[maxRow] = B[i];
    B[i] = tmp;

    // Make all rows below this one 0 in current column
    for (let k = i + 1; k < n; k++) {
      const c = -A[k][i] / A[i][i];
      for (let j = i; j < n; j++) {
        if (i === j) {
          A[k][j] = 0;
        } else {
          A[k][j] += c * A[i][j];
        }
      }
      B[k] += c * B[i];
    }
  }

  // Solve equation Ax=B for an upper triangular matrix A
  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let sum = 0;
    for (let j = i + 1; j < n; j++) {
      sum += A[i][j] * x[j];
    }
    if (A[i][i] === 0) return null; // Singular matrix
    x[i] = (B[i] - sum) / A[i][i];
  }
  return x;
}

export function getTransform(src: Point[], dst: Point[]): string {
  // A * H = B
  const A: number[][] = [];
  const B: number[] = [];

  for (let i = 0; i < 4; i++) {
    A.push([src[i].x, src[i].y, 1, 0, 0, 0, -src[i].x * dst[i].x, -src[i].y * dst[i].x]);
    B.push(dst[i].x);
    A.push([0, 0, 0, src[i].x, src[i].y, 1, -src[i].x * dst[i].y, -src[i].y * dst[i].y]);
    B.push(dst[i].y);
  }

  const h = solve(A, B);
  if (!h) return 'none';

  const H = [
    h[0], h[3], 0, h[6],
    h[1], h[4], 0, h[7],
       0,    0, 1,    0,
    h[2], h[5], 0,    1
  ];

  return `matrix3d(${H.join(',')})`;
}
