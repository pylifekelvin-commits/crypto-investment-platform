import React, { useRef, useEffect, useState } from 'react';
import { useAppStore } from '../store';

interface VideoBackgroundProps {
  className?: string;
}

const VideoBackground: React.FC<VideoBackgroundProps> = ({ className = '' }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  const {
    videoSrc,
    isVideoPlaying,
    videoVolume,
    videoQuality,
    setVideoSrc,
    setVideoQuality,
    toggleVideo,
    setVideoVolume
  } = useAppStore();

  // Enhanced array of crypto-themed video sources
  const videoSources = [
    {
      src: 'https://videos.pexels.com/video-files/3141354/3141354-uhd_2560_1440_30fps.mp4',
      quality: 'high',
      description: 'Digital Technology Network',
      category: 'tech'
    },
    {
      src: 'https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4',
      quality: 'high',
      description: 'Blockchain Visualization',
      category: 'blockchain'
    },
    {
      src: 'https://videos.pexels.com/video-files/2818559/2818559-uhd_2560_1440_30fps.mp4',
      quality: 'high',
      description: 'Financial Data Flow',
      category: 'finance'
    },
    {
      src: 'https://videos.pexels.com/video-files/3129957/3129957-uhd_2560_1440_30fps.mp4',
      quality: 'high',
      description: 'Digital Currency Animation',
      category: 'crypto'
    },
    {
      src: 'https://videos.pexels.com/video-files/8092613/8092613-uhd_2560_1440_30fps.mp4',
      quality: 'high',
      description: 'Abstract Digital Particles',
      category: 'abstract'
    },
    {
      src: 'https://videos.pexels.com/video-files/7534543/7534543-uhd_2560_1440_25fps.mp4',
      quality: 'high',
      description: 'Cyber Security Network',
      category: 'security'
    },
    {
      src: 'https://videos.pexels.com/video-files/6579123/6579123-uhd_2560_1440_30fps.mp4',
      quality: 'high',
      description: 'Futuristic Digital Grid',
      category: 'futuristic'
    },
    {
      src: 'https://videos.pexels.com/video-files/2278095/2278095-uhd_2560_1440_30fps.mp4',
      quality: 'high',
      description: 'Matrix Digital Rain',
      category: 'matrix'
    }
  ];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadStart = () => setIsLoaded(false);
    const handleCanPlay = () => {
      setIsLoaded(true);
      setHasError(false);
    };
    const handleError = () => {
      setHasError(true);
      // Try next video source on error
      const currentIndex = videoSources.findIndex(source => source.src === videoSrc);
      const nextIndex = (currentIndex + 1) % videoSources.length;
      setVideoSrc(videoSources[nextIndex].src);
    };

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, [videoSrc, setVideoSrc]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = videoVolume;
    
    if (isVideoPlaying) {
      video.play().catch(() => {
        // Auto-play failed, mute and try again
        video.muted = true;
        video.play().catch(console.error);
      });
    } else {
      video.pause();
    }
  }, [isVideoPlaying, videoVolume]);

  const handleVideoClick = () => {
    toggleVideo();
  };

  const changeVideoSource = () => {
    const currentIndex = videoSources.findIndex(source => source.src === videoSrc);
    const nextIndex = (currentIndex + 1) % videoSources.length;
    setVideoSrc(videoSources[nextIndex].src);
  };

  return (
    <>
      {/* Video Background */}
      <video
        ref={videoRef}
        className={`video-background ${className}`}
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        onClick={handleVideoClick}
        style={{
          opacity: isLoaded ? 0.8 : 0.3,
          filter: 'brightness(0.7) contrast(1.1) saturate(1.2)',
        }}
      />

      {/* Video Overlay Gradient */}
      <div className="video-overlay" />

      {/* Floating Crypto Particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="crypto-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              fontSize: `${1 + Math.random() * 2}rem`,
            }}
          >
            {['₿', 'Ξ', '◊', '💎', '🚀', '📈', '⚡'][Math.floor(Math.random() * 7)]}
          </div>
        ))}
      </div>

      {/* Enhanced Video Controls Overlay */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {/* Video Info Display */}
        <div className="glass-button p-3 max-w-xs">
          <p className="text-white text-xs font-medium">
            {videoSources.find(source => source.src === videoSrc)?.description || 'Loading...'}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <div className={`w-2 h-2 rounded-full ${
              isLoaded ? 'bg-green-400' : hasError ? 'bg-red-400' : 'bg-yellow-400'
            }`} />
            <span className="text-white/70 text-xs">
              {isLoaded ? 'Live' : hasError ? 'Error' : 'Loading'}
            </span>
          </div>
        </div>

        {/* Play/Pause Button */}
        <button
          onClick={toggleVideo}
          className="glass-button p-3 text-white hover:text-crypto-400 transition-colors group"
          title={isVideoPlaying ? 'Pause Video' : 'Play Video'}
        >
          {isVideoPlaying ? (
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        {/* Change Video Button */}
        <button
          onClick={changeVideoSource}
          className="glass-button p-3 text-white hover:text-crypto-400 transition-colors group"
          title="Change Video Background"
        >
          <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>

        {/* Quality Selector */}
        <div className="glass-button p-3">
          <select
            value={videoQuality}
            onChange={(e) => setVideoQuality(e.target.value)}
            className="bg-transparent text-white text-xs outline-none cursor-pointer"
            title="Video Quality"
          >
            <option value="auto" className="bg-gray-900">Auto</option>
            <option value="high" className="bg-gray-900">HD</option>
            <option value="medium" className="bg-gray-900">SD</option>
            <option value="low" className="bg-gray-900">Low</option>
          </select>
        </div>

        {/* Volume Control */}
        <div className="glass-button p-3 flex items-center gap-2">
          <button
            onClick={() => setVideoVolume(videoVolume > 0 ? 0 : 0.3)}
            className="text-white hover:text-crypto-400 transition-colors"
            title={videoVolume > 0 ? 'Mute' : 'Unmute'}
          >
            {videoVolume > 0 ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.788L4.618 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.618l3.765-2.788A1 1 0 019.383 3.076zM12 6a1 1 0 011.414 0A5 5 0 0116 10a5 5 0 01-2.586 4.414 1 1 0 11-1.414-1.414A3 3 0 0014 10a3 3 0 00-2-2.828 1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.788L4.618 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.618l3.765-2.788A1 1 0 019.383 3.076z" clipRule="evenodd" />
                <path d="M14.293 7.293a1 1 0 011.414 0L17 8.586l1.293-1.293a1 1 0 111.414 1.414L18.414 10l1.293 1.293a1 1 0 01-1.414 1.414L17 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L15.586 10l-1.293-1.293a1 1 0 010-1.414z" />
              </svg>
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={videoVolume}
            onChange={(e) => setVideoVolume(parseFloat(e.target.value))}
            className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
            title="Volume"
          />
        </div>

        {/* Fullscreen Toggle */}
        <button
          onClick={() => {
            const video = videoRef.current;
            if (video) {
              if (document.fullscreenElement) {
                document.exitFullscreen();
              } else {
                video.requestFullscreen().catch(console.error);
              }
            }
          }}
          className="glass-button p-3 text-white hover:text-crypto-400 transition-colors group"
          title="Toggle Fullscreen"
        >
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>
      </div>

      {/* Loading Indicator */}
      {!isLoaded && !hasError && (
        <div className="fixed inset-0 flex items-center justify-center z-40">
          <div className="glass-card p-6 flex items-center gap-3">
            <div className="spinner"></div>
            <span className="text-white">Loading background...</span>
          </div>
        </div>
      )}

      {/* Error Indicator */}
      {hasError && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="glass-card p-4 bg-red-500/20 border-red-500/30">
            <span className="text-white">Video loading failed, trying alternative...</span>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoBackground;