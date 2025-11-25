import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface TotalTimeDisplayProps {
  totalSeconds: number;
  shiftSeconds: number;
  isRecording: boolean;
}

export default function TotalTimeDisplay({ totalSeconds, shiftSeconds, isRecording }: TotalTimeDisplayProps) {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isRecording && glowRef.current) {
      gsap.to(glowRef.current, {
        opacity: 0.6,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      });
    } else if (glowRef.current) {
      gsap.killTweensOf(glowRef.current);
      gsap.to(glowRef.current, { opacity: 0, duration: 0.3 });
    }
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const percentage = (totalSeconds / shiftSeconds) * 100;

  return (
    <div className="relative">
      <div className="bg-gradient-to-r from-blue-950/50 to-cyan-950/50 border border-blue-500/30 rounded-lg p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Working Time</p>
            <p className="text-4xl font-mono font-bold text-foreground tracking-wider" data-testid="text-total-time">
              {formatTime(totalSeconds)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground mb-1">Target</p>
            <p className="text-2xl font-mono text-blue-400">
              {formatTime(shiftSeconds)}
            </p>
          </div>
        </div>
        
        <div className="relative h-2 bg-black/50 rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500 rounded-full"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
          <div 
            ref={glowRef}
            className="absolute top-0 left-0 h-full bg-blue-400 blur-sm opacity-0"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        
        <div className="mt-2 text-right">
          <span className="text-sm font-mono text-muted-foreground">
            {percentage.toFixed(1)}% Complete
          </span>
        </div>
      </div>
      
      {isRecording && (
        <div className="absolute -top-1 -right-1">
          <div className="relative">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <div className="absolute inset-0 w-3 h-3 bg-red-500 rounded-full animate-ping" />
          </div>
        </div>
      )}
    </div>
  );
}
