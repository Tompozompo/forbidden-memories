/**
 * Asset Preloader - Manages loading and caching of game assets
 * Provides a game-like experience with preloaded resources
 */

import { useState, useEffect } from 'react';

export interface AssetManifest {
  images: string[];
  sounds: string[];
  data: string[];
}

interface AssetCache {
  images: Map<string, HTMLImageElement>;
  sounds: Map<string, HTMLAudioElement>;
  data: Map<string, any>;
}

class AssetLoader {
  private cache: AssetCache = {
    images: new Map(),
    sounds: new Map(),
    data: new Map(),
  };

  private totalAssets = 0;
  private loadedAssets = 0;

  /**
   * Preload an image and cache it
   */
  async preloadImage(url: string): Promise<HTMLImageElement> {
    if (this.cache.images.has(url)) {
      return this.cache.images.get(url)!;
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        this.cache.images.set(url, img);
        this.loadedAssets++;
        resolve(img);
      };
      
      img.onerror = () => {
        reject(new Error(`Failed to load image: ${url}`));
      };
      
      img.src = url;
    });
  }

  /**
   * Preload a sound and cache it
   */
  async preloadSound(url: string): Promise<HTMLAudioElement> {
    if (this.cache.sounds.has(url)) {
      return this.cache.sounds.get(url)!;
    }

    return new Promise((resolve, reject) => {
      const audio = new Audio();
      
      audio.oncanplaythrough = () => {
        this.cache.sounds.set(url, audio);
        this.loadedAssets++;
        resolve(audio);
      };
      
      audio.onerror = () => {
        reject(new Error(`Failed to load sound: ${url}`));
      };
      
      audio.src = url;
      audio.load();
    });
  }

  /**
   * Preload JSON data and cache it
   */
  async preloadData(url: string): Promise<any> {
    if (this.cache.data.has(url)) {
      return this.cache.data.get(url)!;
    }

    try {
      const response = await fetch(url);
      const data = await response.json();
      this.cache.data.set(url, data);
      this.loadedAssets++;
      return data;
    } catch (error) {
      throw new Error(`Failed to load data: ${url}`);
    }
  }

  /**
   * Preload all assets from manifest
   */
  async preloadAll(manifest: AssetManifest, onProgress?: (progress: number) => void): Promise<void> {
    this.totalAssets = manifest.images.length + manifest.sounds.length + manifest.data.length;
    this.loadedAssets = 0;

    const promises: Promise<any>[] = [];

    // Load images
    for (const url of manifest.images) {
      promises.push(
        this.preloadImage(url).catch((err) => {
          console.warn(`Failed to preload image: ${url}`, err);
        })
      );
    }

    // Load sounds
    for (const url of manifest.sounds) {
      promises.push(
        this.preloadSound(url).catch((err) => {
          console.warn(`Failed to preload sound: ${url}`, err);
        })
      );
    }

    // Load data
    for (const url of manifest.data) {
      promises.push(
        this.preloadData(url).catch((err) => {
          console.warn(`Failed to preload data: ${url}`, err);
        })
      );
    }

    // Track progress
    if (onProgress) {
      const interval = setInterval(() => {
        const progress = this.totalAssets > 0 ? this.loadedAssets / this.totalAssets : 1;
        onProgress(progress);
        
        if (this.loadedAssets >= this.totalAssets) {
          clearInterval(interval);
        }
      }, 100);
    }

    await Promise.all(promises);
  }

  /**
   * Get cached image
   */
  getImage(url: string): HTMLImageElement | null {
    return this.cache.images.get(url) || null;
  }

  /**
   * Get cached sound
   */
  getSound(url: string): HTMLAudioElement | null {
    return this.cache.sounds.get(url) || null;
  }

  /**
   * Get cached data
   */
  getData(url: string): any | null {
    return this.cache.data.get(url) || null;
  }

  /**
   * Clear all cached assets
   */
  clearCache(): void {
    this.cache.images.clear();
    this.cache.sounds.clear();
    this.cache.data.clear();
    this.loadedAssets = 0;
    this.totalAssets = 0;
  }

  /**
   * Get cache stats
   */
  getCacheStats() {
    return {
      images: this.cache.images.size,
      sounds: this.cache.sounds.size,
      data: this.cache.data.size,
      total: this.cache.images.size + this.cache.sounds.size + this.cache.data.size,
    };
  }
}

// Singleton instance
export const assetLoader = new AssetLoader();

/**
 * React hook for preloading assets
 */
export function useAssetPreloader(manifest: AssetManifest) {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadAssets = async () => {
      try {
        setLoading(true);
        setProgress(0);
        setError(null);

        await assetLoader.preloadAll(manifest, (prog) => {
          if (mounted) setProgress(prog);
        });

        if (mounted) {
          setLoading(false);
          setProgress(1);
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
          setLoading(false);
        }
      }
    };

    loadAssets();

    return () => {
      mounted = false;
    };
  }, [manifest]);

  return { loading, progress, error };
}

/**
 * Loading screen component
 */
interface LoadingScreenProps {
  progress: number;
  message?: string;
}

export function LoadingScreen({ progress, message = 'Loading...' }: LoadingScreenProps) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(to bottom, #0f0f1e, #1a1a2e)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        zIndex: 10000,
      }}
    >
      <div
        style={{
          fontSize: '32px',
          fontWeight: 'bold',
          marginBottom: '32px',
          textShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
          color: '#ffd700',
        }}
      >
        FORBIDDEN MEMORIES
      </div>

      <div style={{ marginBottom: '16px', fontSize: '16px' }}>
        {message}
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: '300px',
          height: '24px',
          background: 'rgba(255, 255, 255, 0.1)',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '12px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #ffd700, #ffed4e)',
            transition: 'width 0.3s ease',
            boxShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '12px',
            fontWeight: 'bold',
            color: progress > 0.5 ? '#000' : '#fff',
            textShadow: progress > 0.5 ? 'none' : '0 0 4px rgba(0, 0, 0, 0.8)',
          }}
        >
          {Math.round(progress * 100)}%
        </div>
      </div>

      {/* Spinning animation */}
      <div
        style={{
          marginTop: '32px',
          width: '40px',
          height: '40px',
          border: '4px solid rgba(255, 255, 255, 0.1)',
          borderTop: '4px solid #ffd700',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

/**
 * Create an optimized card sprite sheet renderer
 * This would normally use Canvas/WebGL for better performance
 */
export class CardSpriteRenderer {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private spriteCache = new Map<number, ImageData>();

  constructor(width: number = 100, height: number = 140) {
    if (typeof document !== 'undefined') {
      this.canvas = document.createElement('canvas');
      this.canvas.width = width;
      this.canvas.height = height;
      this.ctx = this.canvas.getContext('2d');
    }
  }

  /**
   * Render a card to the sprite cache
   */
  renderCard(cardId: number, renderFn: (ctx: CanvasRenderingContext2D) => void): ImageData | null {
    if (!this.ctx || !this.canvas) return null;

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Render card
    renderFn(this.ctx);

    // Cache the result
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    this.spriteCache.set(cardId, imageData);

    return imageData;
  }

  /**
   * Get cached card sprite
   */
  getSprite(cardId: number): ImageData | null {
    return this.spriteCache.get(cardId) || null;
  }

  /**
   * Clear sprite cache
   */
  clearCache(): void {
    this.spriteCache.clear();
  }
}
