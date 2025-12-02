import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

import { useStore } from '../../store';
import { ModelMesh } from '../../types';
import { readFileAsArrayBuffer, readFileAsText } from '../../utils/file-reader';
import { extractMeshes } from '../../utils/model-utils';

interface ModelLoaderProps {
  onMeshesExtracted?: (meshes: ModelMesh[]) => void;
  children?: (scene: THREE.Object3D) => React.ReactNode;
}

export function ModelLoader({ onMeshesExtracted, children }: ModelLoaderProps) {
  const source = useStore((state) => state.source);
  const setModelLoadError = useStore((state) => state.setModelLoadError);

  const setLoading = useStore((state) => state.setLoading);
  const setLoadingStage = useStore((state) => state.setLoadingStage);
  const setLoadingProgress = useStore((state) => state.setLoadingProgress);
  const setLoadingMessage = useStore((state) => state.setLoadingMessage);
  const setLoadingError = useStore((state) => state.setLoadingError);
  const resetLoading = useStore((state) => state.resetLoading);

  const [scene, setScene] = useState<THREE.Object3D | null>(null);

  useEffect(() => {
    if (!source) {
      setScene(null);
      return;
    }

    if (source.type === 'url' && !source.url) {
      setScene(null);
      return;
    }
    if (source.type === 'file' && !source.file) {
      setScene(null);
      return;
    }

    const loadModel = async () => {
      setLoading(true);
      setScene(null);
      setModelLoadError('');
      setLoadingError(null);
      setLoadingStage('fetching');
      setLoadingProgress(0);

      try {
        let result: THREE.Group | THREE.Scene;

        if (source.type === 'file' && source.file) {
          const file = source.file;
          setLoadingMessage(`Reading file: ${file.name}`);
          setLoadingProgress(10);

          switch (source.format) {
            case 'gltf':
            case 'glb': {
              const arrayBuffer = await readFileAsArrayBuffer(file);
              setLoadingProgress(30);
              setLoadingStage('parsing');
              setLoadingMessage('Parsing GLTF/GLB model...');

              const loader = new GLTFLoader();

              result = await new Promise((resolve, reject) => {
                loader.parse(
                  arrayBuffer,
                  '',
                  (gltf) => {
                    setLoadingProgress(60);
                    resolve(gltf.scene);
                  },
                  (error) => reject(error)
                );
              });
              break;
            }
            case 'fbx': {
              const arrayBuffer = await readFileAsArrayBuffer(file);
              setLoadingProgress(30);
              setLoadingStage('parsing');
              setLoadingMessage('Parsing FBX model...');

              const loader = new FBXLoader();

              try {
                result = loader.parse(arrayBuffer, '');
                setLoadingProgress(60);
              } catch (error) {
                throw new Error(
                  `FBX parse error: ${error instanceof Error ? error.message : 'Unknown error'}`
                );
              }
              break;
            }
            case 'obj': {
              const text = await readFileAsText(file);
              setLoadingProgress(30);
              setLoadingStage('parsing');
              setLoadingMessage('Parsing OBJ model...');

              const loader = new OBJLoader();

              try {
                result = loader.parse(text);
                setLoadingProgress(60);
              } catch (error) {
                throw new Error(
                  `OBJ parse error: ${error instanceof Error ? error.message : 'Unknown error'}`
                );
              }
              break;
            }
            default:
              throw new Error(`Unsupported format: ${source.format}`);
          }
        } else if (source.type === 'url' && source.url) {
          const loadUrl = source.url;
          setLoadingMessage(`Fetching from URL...`);
          setLoadingProgress(10);

          switch (source.format) {
            case 'gltf':
            case 'glb': {
              setLoadingStage('fetching');
              const loader = new GLTFLoader();
              result = await new Promise((resolve, reject) => {
                loader.load(
                  loadUrl,
                  (gltf) => {
                    setLoadingProgress(60);
                    setLoadingStage('parsing');
                    resolve(gltf.scene);
                  },
                  (progress) => {
                    if (progress.total > 0) {
                      const percent = (progress.loaded / progress.total) * 50;
                      setLoadingProgress(10 + percent);
                    }
                  },
                  (error) => reject(error)
                );
              });
              break;
            }
            case 'fbx': {
              setLoadingStage('fetching');
              const loader = new FBXLoader();
              result = await new Promise((resolve, reject) => {
                loader.load(
                  loadUrl,
                  (object) => {
                    setLoadingProgress(60);
                    setLoadingStage('parsing');
                    resolve(object);
                  },
                  (progress) => {
                    if (progress.total > 0) {
                      const percent = (progress.loaded / progress.total) * 50;
                      setLoadingProgress(10 + percent);
                    }
                  },
                  (error) => reject(error)
                );
              });
              break;
            }
            case 'obj': {
              setLoadingStage('fetching');
              const loader = new OBJLoader();
              result = await new Promise((resolve, reject) => {
                const fileLoader = new THREE.FileLoader();
                fileLoader.load(
                  loadUrl,
                  (data) => {
                    try {
                      setLoadingProgress(60);
                      setLoadingStage('parsing');
                      const text = data as string;
                      const object = loader.parse(text);
                      resolve(object);
                    } catch (error) {
                      reject(error);
                    }
                  },
                  (progress) => {
                    if (progress.total > 0) {
                      const percent = (progress.loaded / progress.total) * 50;
                      setLoadingProgress(10 + percent);
                    }
                  },
                  (error) => reject(error)
                );
              });
              break;
            }
            default:
              throw new Error(`Unsupported format: ${source.format}`);
          }
        } else {
          throw new Error('Invalid source configuration');
        }

        setLoadingProgress(80);
        setLoadingStage('processing');
        setLoadingMessage('Processing meshes...');

        setScene(result);

        setLoadingProgress(100);
        setLoadingStage('complete');
        setLoadingMessage('Model loaded successfully!');

        setTimeout(() => {
          resetLoading();
        }, 500);
      } catch (error) {
        console.error('Failed to load model:', error);
        const errorMessage = `Failed to load model: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`;
        setModelLoadError(errorMessage);
        setLoadingError(errorMessage);
        setLoadingStage('error');
      }
    };

    loadModel();
  }, [
    source,
    setModelLoadError,
    setLoading,
    setLoadingStage,
    setLoadingProgress,
    setLoadingMessage,
    setLoadingError,
    resetLoading,
  ]);

  useEffect(() => {
    if (scene && source?.format === 'obj') {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (!child.material || (Array.isArray(child.material) && child.material.length === 0)) {
            child.material = new THREE.MeshStandardMaterial({ color: 0x808080 });
          }
        }
      });
    }
  }, [scene, source?.format]);

  useEffect(() => {
    if (scene) {
      try {
        const meshes = extractMeshes(scene);
        onMeshesExtracted?.(meshes);
      } catch (error) {
        console.error('Failed to extract meshes:', error);
        const errorMessage = `Failed to process model: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`;
        setModelLoadError(errorMessage);
        setLoadingError(errorMessage);
      }
    }
  }, [scene, onMeshesExtracted, setModelLoadError, setLoadingError]);

  if (!scene) {
    return null;
  }

  return <group>{children ? children(scene) : <primitive object={scene} />}</group>;
}
