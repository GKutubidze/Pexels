import React, { useRef, useEffect, useState } from 'react';

interface LazyVideoProps {
  src: string;
  poster?: string;
  className?: string;
  width?: string | number;
  height?: string | number;
  onMouseEnter?: (event: React.MouseEvent<HTMLVideoElement, MouseEvent>) => void;
  onMouseLeave?: (event: React.MouseEvent<HTMLVideoElement, MouseEvent>) => void;
  preload?: string;
  muted?: boolean;
  loop?: boolean;
}

const LazyVideo: React.FC<LazyVideoProps> = ({
  src,
  poster,
  className,
  width,
  height,
  onMouseEnter,
  onMouseLeave,
  preload = 'metadata',
  muted = true,
  loop = true,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const videoElement = videoRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsLoaded(true);
            observer.unobserve(videoElement!);
          }
        });
      },
      {
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    if (videoElement) {
      observer.observe(videoElement);
    }

    return () => {
      if (videoElement) {
        observer.unobserve(videoElement);
      }
    };
  }, []);

  return (
    <video
      ref={videoRef}
      width={width}
      height={height}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      preload={preload}
      muted={muted}
      loop={loop}
      className={className}
      poster={poster}
    >
      {isLoaded && <source src={src} type="video/mp4" />}
    </video>
  );
};

export default LazyVideo;
