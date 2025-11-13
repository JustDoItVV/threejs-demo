import * as THREE from 'three';

/**
 * Texture cache for loaded textures
 * Prevents reloading the same texture multiple times
 */
const textureCache = new Map<string, THREE.Texture>();

/**
 * Load a texture from the given path
 * Uses caching to avoid reloading the same texture
 *
 * @param path - Path to the texture image
 * @param frameIndex - Optional: which frame to display from sprite sheet (default: 0)
 * @param totalFrames - Optional: total frames in sprite sheet (default: 1)
 * @returns THREE.Texture instance
 */
export function loadTexture(
  path: string,
  frameIndex: number = 0,
  totalFrames: number = 1
): THREE.Texture {
  // Create cache key including frame info
  const cacheKey = totalFrames > 1 ? `${path}:${frameIndex}/${totalFrames}` : path;

  // Check if texture is already in cache
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey)!;
  }

  // Create new texture loader
  const loader = new THREE.TextureLoader();

  // Load the texture
  const texture = loader.load(
    path,
    // onLoad callback
    () => {
      console.log(`[TextureLoader] Loaded texture: ${path} (frame ${frameIndex}/${totalFrames})`);
    },
    // onProgress callback
    undefined,
    // onError callback
    (error) => {
      console.error(`[TextureLoader] Failed to load texture: ${path}`, error);
    }
  );

  // Configure texture for pixel art / sprites
  // NearestFilter prevents blurring and maintains sharp pixels
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;

  // Disable mipmaps for pixel art
  texture.generateMipmaps = false;

  // Set color space
  texture.colorSpace = THREE.SRGBColorSpace;

  // If this is a sprite sheet, configure UV coordinates to show only one frame
  if (totalFrames > 1) {
    // Assuming horizontal sprite sheet layout
    texture.repeat.set(1 / totalFrames, 1); // Show only 1/totalFrames of the texture width
    texture.offset.set(frameIndex / totalFrames, 0); // Offset to the specific frame
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
  }

  // Cache the texture
  textureCache.set(cacheKey, texture);

  return texture;
}

/**
 * Preload multiple textures
 * Useful for loading assets before they're needed
 *
 * @param paths - Array of texture paths to preload
 * @returns Promise that resolves when all textures are loaded
 */
export function preloadTextures(paths: string[]): Promise<THREE.Texture[]> {
  return Promise.all(
    paths.map(
      (path) =>
        new Promise<THREE.Texture>((resolve, reject) => {
          // Check cache first
          if (textureCache.has(path)) {
            resolve(textureCache.get(path)!);
            return;
          }

          // Load new texture
          const loader = new THREE.TextureLoader();
          loader.load(
            path,
            (texture) => {
              // Configure texture
              texture.minFilter = THREE.NearestFilter;
              texture.magFilter = THREE.NearestFilter;
              texture.generateMipmaps = false;
              texture.colorSpace = THREE.SRGBColorSpace;

              // Cache it
              textureCache.set(path, texture);
              resolve(texture);
            },
            undefined,
            (error) => {
              console.error(`[TextureLoader] Failed to preload: ${path}`, error);
              reject(error);
            }
          );
        })
    )
  );
}

/**
 * Clear all cached textures and dispose of them
 * Call this when unmounting the game or switching scenes
 */
export function clearTextureCache(): void {
  console.log(`[TextureLoader] Clearing texture cache (${textureCache.size} textures)`);

  textureCache.forEach((texture) => {
    texture.dispose();
  });

  textureCache.clear();
}

/**
 * Get the current size of the texture cache
 * @returns Number of cached textures
 */
export function getTextureCacheSize(): number {
  return textureCache.size;
}

/**
 * Check if a texture is in the cache
 * @param path - Path to check
 * @returns true if texture is cached
 */
export function isTextureCached(path: string): boolean {
  return textureCache.has(path);
}

/**
 * Remove a specific texture from cache and dispose of it
 * @param path - Path to the texture to remove
 */
export function removeTextureFromCache(path: string): void {
  const texture = textureCache.get(path);
  if (texture) {
    texture.dispose();
    textureCache.delete(path);
    console.log(`[TextureLoader] Removed texture from cache: ${path}`);
  }
}

/**
 * Future Enhancement Ideas:
 * - Sprite sheet frame extraction utilities
 * - Texture atlas support for better performance
 * - Loading progress tracking and callbacks
 * - Error fallback textures for missing assets
 * - Batch loading with priority queues
 */
