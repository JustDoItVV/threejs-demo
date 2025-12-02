import * as THREE from 'three';

const textureCache = new Map<string, THREE.Texture>();

export function loadTexture(
  path: string,
  frameIndex: number = 0,
  totalFrames: number = 1
): THREE.Texture {
  const cacheKey = totalFrames > 1 ? `${path}:${frameIndex}/${totalFrames}` : path;

  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey)!;
  }

  const loader = new THREE.TextureLoader();

  const texture = loader.load(
    path,
    () => {
      console.log(`[TextureLoader] Loaded texture: ${path} (frame ${frameIndex}/${totalFrames})`);
    },
    undefined,
    (error) => {
      console.error(`[TextureLoader] Failed to load texture: ${path}`, error);
    }
  );

  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;

  texture.generateMipmaps = false;

  texture.colorSpace = THREE.SRGBColorSpace;

  if (totalFrames > 1) {
    texture.repeat.set(1 / totalFrames, 1);
    texture.offset.set(frameIndex / totalFrames, 0);
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
  }

  textureCache.set(cacheKey, texture);

  return texture;
}

export function preloadTextures(paths: string[]): Promise<THREE.Texture[]> {
  return Promise.all(
    paths.map(
      (path) =>
        new Promise<THREE.Texture>((resolve, reject) => {
          if (textureCache.has(path)) {
            resolve(textureCache.get(path)!);
            return;
          }

          const loader = new THREE.TextureLoader();
          loader.load(
            path,
            (texture) => {
              texture.minFilter = THREE.NearestFilter;
              texture.magFilter = THREE.NearestFilter;
              texture.generateMipmaps = false;
              texture.colorSpace = THREE.SRGBColorSpace;

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

export function clearTextureCache(): void {
  console.log(`[TextureLoader] Clearing texture cache (${textureCache.size} textures)`);

  textureCache.forEach((texture) => {
    texture.dispose();
  });

  textureCache.clear();
}

export function getTextureCacheSize(): number {
  return textureCache.size;
}

export function isTextureCached(path: string): boolean {
  return textureCache.has(path);
}

export function removeTextureFromCache(path: string): void {
  const texture = textureCache.get(path);
  if (texture) {
    texture.dispose();
    textureCache.delete(path);
    console.log(`[TextureLoader] Removed texture from cache: ${path}`);
  }
}
