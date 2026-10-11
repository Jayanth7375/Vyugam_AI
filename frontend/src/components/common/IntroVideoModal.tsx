import React, { useRef, useEffect, useState } from 'react';

interface IntroVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IntroVideoModal: React.FC<IntroVideoModalProps> = ({ isOpen, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsExiting(false);
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    setIsExiting(false);

    // Try unmuted autoplay first
    video.muted = false;
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Fallback to muted autoplay if browser blocks unmuted playback
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().catch((err) => {
            console.warn('Autoplay failed:', err);
          });
        }
      });
    }

    // Keyboard shortcut ESC to skip
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleDismiss();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleDismiss = () => {
    setIsExiting(true);
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setTimeout(() => {
      onClose();
      setIsExiting(false);
    }, 400);
  };

  const handleContainerClick = () => {
    const video = videoRef.current;
    if (video && video.muted) {
      // If browser started it in muted mode, unmute on first click
      video.muted = false;
    } else {
      // Clicking skips to site
      handleDismiss();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={handleContainerClick}
      className={`fixed inset-0 z-[9999] w-screen h-screen bg-black overflow-hidden cursor-pointer transition-opacity duration-500 select-none ${
        isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <video
        ref={videoRef}
        src="/intro-video.mp4"
        className="w-full h-full object-cover"
        playsInline
        autoPlay
        preload="auto"
        onEnded={handleDismiss}
      >
        <source src="/intro-video.mp4" type="video/mp4" />
        <source src="/Intro Video/Untitled design (6).mp4" type="video/mp4" />
      </video>
    </div>
  );
};

export default IntroVideoModal;
