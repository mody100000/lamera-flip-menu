import React, { useState, useRef, useEffect } from 'react';
import menuImg from "@assets/menu.jpg";
import { performFullImageOCR, performOCR } from "../../Utility/ORC";

// Get default selection size based on screen width
const getSelectionSize = () => {
  const screenWidth = window.innerWidth;

  if (screenWidth < 640) {  // Tailwind's 'sm' breakpoint
    return {
      width: 140,   // Smaller width for mobile
      height: 25    // Maintain the same height
    };
  }

  return {
    width: 250,
    height: 25
  };
};

const DEFAULT_SELECTION_SIZE = getSelectionSize();

window.addEventListener('resize', () => {
  Object.assign(DEFAULT_SELECTION_SIZE, getSelectionSize());
});

const Menu = ({ onTextDetected }) => {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (imageLoaded && imageRef.current) {
      performFullImageOCR(imageRef.current);
      updateCanvas();
    }
  }, [imageLoaded]);

  const updateCanvas = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;

    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    canvas.width = img.clientWidth;
    canvas.height = img.clientHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const getCoordinates = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const clientX = event.touches ? event.touches[0]?.clientX : event.clientX;
    const clientY = event.touches ? event.touches[0]?.clientY : event.clientY;

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const onCanvasClick = async (e) => {
    const coords = getCoordinates(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const x = Math.max(0, coords.x - DEFAULT_SELECTION_SIZE.width / 1.5);
    const y = Math.max(0, coords.y - DEFAULT_SELECTION_SIZE.height / 2);

    // Draw selection box
    ctx.fillStyle = 'rgba(66, 135, 245, 0.3)';
    ctx.strokeStyle = '#4287f5';
    ctx.lineWidth = 2;
    ctx.fillRect(x, y, DEFAULT_SELECTION_SIZE.width, DEFAULT_SELECTION_SIZE.height);
    ctx.strokeRect(x, y, DEFAULT_SELECTION_SIZE.width, DEFAULT_SELECTION_SIZE.height);

    setIsLoading(true);

    try {
      const img = imageRef.current;
      // Create tempCanvas for OCR
      const tempCanvas = document.createElement('canvas');
      const scaleX = img.naturalWidth / img.clientWidth;
      const scaleY = img.naturalHeight / img.clientHeight;

      tempCanvas.width = DEFAULT_SELECTION_SIZE.width * scaleX;
      tempCanvas.height = DEFAULT_SELECTION_SIZE.height * scaleY;

      const tempCtx = tempCanvas.getContext('2d');
      tempCtx.drawImage(
        img,
        x * scaleX, y * scaleY,
        DEFAULT_SELECTION_SIZE.width * scaleX,
        DEFAULT_SELECTION_SIZE.height * scaleY,
        0, 0,
        DEFAULT_SELECTION_SIZE.width * scaleX,
        DEFAULT_SELECTION_SIZE.height * scaleY
      );

      const croppedImage = tempCanvas.toDataURL('image/jpeg').split(',')[1];
      const { detectedText } = await performOCR(croppedImage);

      // Call the parent handler with detected text
      onTextDetected(detectedText);
    } catch (error) {
      console.error('OCR Error:', error);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        updateCanvas();
      }, 1000);
    }
  };

  return (
    <div className="w-full h-screen relative overflow-hidden">
      <img
        ref={imageRef}
        src={menuImg}
        alt="menu image"
        onLoad={() => setImageLoaded(true)}
        className="w-full h-full fixed top-0 left-0 z-10"
      />

      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 p-4 rounded-lg z-10 text-center pointer-events-none md:hidden">
        Click on text to scan
      </div>

      <canvas
        ref={canvasRef}
        onClick={onCanvasClick}
        className="w-full h-full fixed top-0 left-0 z-10 cursor-pointer opacity-30 hover:opacity-100 transition-opacity duration-300"
        style={{ touchAction: 'none' }}
      />

      {isLoading && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 p-4 rounded-lg z-20">
          Scanning text...
        </div>
      )}
    </div>
  );
};

export default Menu;