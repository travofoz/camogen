"use client";

import { useEffect, useRef, useState } from 'react';
import { Point } from '../utils/perspective';

export function useAutoSnap(videoElement: HTMLVideoElement | null, isActive: boolean, onCornersDetected: (corners: Point[]) => void) {
  const [isLoaded, setIsLoaded] = useState(false);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isActive) return;
    
    // Dynamically load OpenCV if not present
    if (!(window as any).cv) {
      const script = document.createElement('script');
      script.src = 'https://docs.opencv.org/4.8.0/opencv.js';
      script.async = true;
      script.onload = () => {
        // OpenCV.js takes a moment to initialize its WASM
        const checkCv = setInterval(() => {
          if ((window as any).cv && (window as any).cv.Mat) {
            clearInterval(checkCv);
            setIsLoaded(true);
          }
        }, 100);
      };
      document.body.appendChild(script);
    } else {
      setIsLoaded(true);
    }
  }, [isActive]);

  useEffect(() => {
    if (!isActive || !isLoaded || !videoElement) return;

    const cv = (window as any).cv;
    
    // Create a hidden canvas to read video frames
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let src: any, dst: any, contours: any, hierarchy: any;

    const processFrame = () => {
      if (videoElement.readyState === videoElement.HAVE_ENOUGH_DATA) {
        // Match canvas to video dimensions
        if (canvas.width !== videoElement.videoWidth) {
          canvas.width = videoElement.videoWidth;
          canvas.height = videoElement.videoHeight;
        }

        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

        try {
          if (!src) src = new cv.Mat(canvas.height, canvas.width, cv.CV_8UC4);
          if (!dst) dst = new cv.Mat(canvas.height, canvas.width, cv.CV_8UC1);
          if (!contours) contours = new cv.MatVector();
          if (!hierarchy) hierarchy = new cv.Mat();

          src.data.set(ctx.getImageData(0, 0, canvas.width, canvas.height).data);

          // 1. Grayscale
          cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY, 0);
          
          // 2. Blur to reduce noise
          const ksize = new cv.Size(5, 5);
          cv.GaussianBlur(dst, dst, ksize, 0, 0, cv.BORDER_DEFAULT);
          
          // 3. Canny edge detection
          cv.Canny(dst, dst, 50, 150, 3, false);
          
          // 4. Find contours
          cv.findContours(dst, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

          let maxArea = 0;
          let bestApprox = new cv.Mat();

          for (let i = 0; i < contours.size(); ++i) {
            const cnt = contours.get(i);
            const area = cv.contourArea(cnt);
            if (area > 5000 && area > maxArea) {
              const perimeter = cv.arcLength(cnt, true);
              const approx = new cv.Mat();
              cv.approxPolyDP(cnt, approx, 0.02 * perimeter, true);
              
              if (approx.rows === 4) {
                maxArea = area;
                approx.copyTo(bestApprox);
              }
              approx.delete();
            }
            cnt.delete();
          }

          if (maxArea > 0 && bestApprox.rows === 4) {
            const points: Point[] = [];
            for (let i = 0; i < 4; i++) {
              points.push({
                x: bestApprox.data32S[i * 2],
                y: bestApprox.data32S[i * 2 + 1]
              });
            }

            // Map video coords back to screen viewport coords
            const rect = videoElement.getBoundingClientRect();
            const scaleX = rect.width / canvas.width;
            const scaleY = rect.height / canvas.height;

            const screenPoints = points.map(p => ({
              x: p.x * scaleX + rect.left,
              y: p.y * scaleY + rect.top
            }));

            // Sort points: TL, TR, BR, BL
            // Sort by Y to get top 2 and bottom 2
            screenPoints.sort((a, b) => a.y - b.y);
            const top = screenPoints.slice(0, 2).sort((a, b) => a.x - b.x);
            const bottom = screenPoints.slice(2, 4).sort((a, b) => b.x - a.x); // BR then BL

            onCornersDetected([top[0], top[1], bottom[0], bottom[1]]);
          }
          bestApprox.delete();
        } catch (err) {
          console.warn("OpenCV Processing Error:", err);
        }
      }

      animationRef.current = requestAnimationFrame(processFrame);
    };

    animationRef.current = requestAnimationFrame(processFrame);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (src) src.delete();
      if (dst) dst.delete();
      if (contours) contours.delete();
      if (hierarchy) hierarchy.delete();
    };
  }, [isActive, isLoaded, videoElement, onCornersDetected]);

  return { isLoaded };
}
