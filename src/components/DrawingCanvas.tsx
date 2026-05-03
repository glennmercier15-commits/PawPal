import React, { useRef, useState, useEffect } from 'react';

interface DrawingCanvasProps {
  onSave: (dataUrl: string) => void;
  onCancel: () => void;
}

const PEN_COLORS = ['#FF9ECA', '#B388FF', '#80DEEA', '#FF6B6B', '#FFD54F', '#69F0AE', '#5D3A6B'];
const BG_COLORS  = ['#FFF9FB', '#FFF3E0', '#E8F5E9', '#EDE7F6', '#FCE4EC'];
const SIZES = [2, 4, 8, 14];

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ onSave, onCancel }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState('#FF9ECA');
  const [bgColor, setBgColor] = useState('#FFF9FB');
  const [penSize, setPenSize] = useState(4);
  const [hasDrawing, setHasDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // We will composite the background color when saving to preserve transparency during drawing
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, []);

  useEffect(() => {
     const canvas = canvasRef.current;
     if (canvas) {
       const ctx = canvas.getContext('2d');
       if (ctx) {
         ctx.strokeStyle = penColor;
         ctx.lineWidth = penSize;
       }
     }
  }, [penColor, penSize]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
      // Prevent scrolling while drawing on mobile
      document.body.style.overflow = 'hidden';
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    ctx.lineTo(x, y);
    ctx.stroke();
    if (!hasDrawing) setHasDrawing(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    document.body.style.overflow = 'auto';
  };

  const handleSaveCheck = () => {
    if (!hasDrawing) {
      alert('Draw something first! 🖌️');
      return;
    }
    const canvas = canvasRef.current;
    if (canvas) {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const ctx = tempCanvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        ctx.drawImage(canvas, 0, 0);
        const dataUrl = tempCanvas.toDataURL('image/jpeg', 0.8);
        onSave(dataUrl);
      }
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    setHasDrawing(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-[20px] font-bold text-pal-text text-center mb-1">🎨 Draw for Your Pet!</h2>

      {/* Tools */}
      <div className="flex flex-col gap-3 bg-pal-card p-4 rounded-3xl border border-pal-primary/10 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-[13px] text-pal-text font-semibold w-12">✏️ Pen:</span>
          <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-1">
            {PEN_COLORS.map(c => (
              <button
                key={c}
                onClick={() => setPenColor(c)}
                className={`w-[26px] h-[26px] rounded-full border-2 shrink-0 transition-transform ${penColor === c ? 'border-pal-text scale-125' : 'border-transparent'}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 mt-1">
          <span className="text-[13px] text-pal-text font-semibold w-12">🖼️ BG:</span>
          <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-1">
            {BG_COLORS.map(c => (
              <button
                key={c}
                onClick={() => setBgColor(c)}
                className={`w-[26px] h-[26px] rounded-full border-2 shrink-0 transition-transform ${bgColor === c ? 'border-pal-text scale-125' : 'border-black/5'}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 mt-1">
          <span className="text-[13px] text-pal-text font-semibold w-12">📏 Size:</span>
          <div className="flex gap-3 items-center">
            {SIZES.map(size => (
              <button
                key={size}
                onClick={() => setPenSize(size)}
                className={`w-[36px] h-[36px] rounded-full bg-pal-background flex items-center justify-center shrink-0 ${penSize === size ? 'border-2 border-pal-primary' : 'border-2 border-transparent'}`}
              >
                <div style={{ width: size * 1.8, height: size * 1.8, borderRadius: size, backgroundColor: penColor }} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div 
        className="rounded-[20px] shadow-sm border-2 border-pal-primary overflow-hidden relative touch-none w-full max-w-[350px] mx-auto"
        style={{ backgroundColor: bgColor, height: 280 }}
      >
        <canvas
          ref={canvasRef}
          width={500}
          height={350}
          className="w-full h-full cursor-crosshair touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>

      <div className="flex gap-3 justify-center mt-2">
        <button
          onClick={onCancel}
          className="px-5 py-3 bg-pal-background text-pal-text/60 font-bold rounded-[20px] active:bg-pal-text/10"
        >
          Cancel
        </button>
        <button
          onClick={clearCanvas}
          className="px-5 py-3 bg-pal-card text-pal-text font-bold rounded-[20px] border-[1.5px] border-pal-primary active:bg-pal-primary/10"
        >
          🗑️ Clear
        </button>
        <button
          onClick={handleSaveCheck}
          className="flex-1 py-3 bg-pal-primary text-white font-bold rounded-[20px] shadow-sm active:scale-95 transition-transform"
        >
          💾 Save Drawing
        </button>
      </div>
    </div>
  );
};
