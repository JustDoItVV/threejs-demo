'use client';

import { useEffect, useState } from 'react';

import { usePointCloudWorker } from '../../hooks/usePointCloudWorker';
import { selectIsLoading, selectShowFileLoader, usePointCloudStore } from '../../store/point-cloud-store';
import { downloadFromGoogleDrive, downloadFromURL, downloadFromYandexDisk } from '../../utils/cloud-storage';
import { applyLOD, checkFileSize } from '../../utils/point-cloud-optimizer';
import { fitCameraToPointCloud, getBoundsInfo } from '../../utils/camera-utils';
import { VIEWER_CONFIG } from '../../config/viewer.config';
import { PointCloudData } from '../../types';

type LoadSource = 'local' | 'url' | 'yandex' | 'google';

export function FileLoader() {
  const showFileLoader = usePointCloudStore(selectShowFileLoader);
  const isLoading = usePointCloudStore(selectIsLoading);
  const pointBudget = usePointCloudStore((state) => state.pointBudget);
  const cameraMode = usePointCloudStore((state) => state.cameraMode);
  const toggleFileLoader = usePointCloudStore((state) => state.toggleFileLoader);
  const setPointCloud = usePointCloudStore((state) => state.setPointCloud);
  const setLoading = usePointCloudStore((state) => state.setLoading);
  const setLoadingProgress = usePointCloudStore((state) => state.setLoadingProgress);
  const setError = usePointCloudStore((state) => state.setError);
  const setMetrics = usePointCloudStore((state) => state.setMetrics);
  const setPointBudget = usePointCloudStore((state) => state.setPointBudget);
  const updateOrthographicConfig = usePointCloudStore((state) => state.updateOrthographicConfig);
  const updateFirstPersonConfig = usePointCloudStore((state) => state.updateFirstPersonConfig);

  const [activeTab, setActiveTab] = useState<LoadSource>('local');
  const [urlInput, setUrlInput] = useState('');

  const { parseFile, terminate } = usePointCloudWorker();

  // Cleanup worker on unmount
  useEffect(() => {
    return () => {
      terminate();
    };
  }, [terminate]);

  const handleFileSelect = async (file: File) => {
    try {
      setError(null);
      setLoading(true);

      // Check file size
      const sizeCheck = checkFileSize(file.size);
      if (!sizeCheck.ok) {
        throw new Error(sizeCheck.message);
      }
      if (sizeCheck.warning && sizeCheck.message) {
        console.warn(sizeCheck.message);
      }

      const startTime = performance.now();

      // Parse point cloud using Web Worker
      parseFile(
        file,
        // onProgress
        (progress) => {
          setLoadingProgress(progress);
        },
        // onSuccess
        (data) => {
          const loadTime = performance.now() - startTime;

          // Auto-downsample large files to prevent memory issues
          let processedData = data;
          const originalCount = data.count;

          // If file has more than 2M points, automatically downsample
          if (data.count > 2000000) {
            console.warn(`Large point cloud detected (${data.count.toLocaleString()} points). Auto-downsampling...`);

            // Use aggressive downsampling for very large files
            const targetBudget = Math.min(pointBudget, 1000000); // Max 1M points for large files

            // Apply LOD without camera (uniform downsampling)
            const lodResult = applyLOD(
              data.points,
              data.colors,
              { x: 0, y: 0, z: 0 } as any, // Dummy camera position
              { x: 0, y: 0, z: 0 } as any, // Dummy center
              targetBudget
            );

            processedData = {
              ...data,
              points: lodResult.positions,
              colors: lodResult.colors,
              count: lodResult.count,
            };

            // Adjust point budget if needed
            if (pointBudget > 1000000) {
              setPointBudget(1000000);
            }

            console.log(`Downsampled from ${originalCount.toLocaleString()} to ${processedData.count.toLocaleString()} points`);
          }

          // Get bounding box info for debugging
          const boundsInfo = getBoundsInfo(processedData);
          console.log('Point cloud bounds:', {
            size: boundsInfo.size,
            center: boundsInfo.center,
            diagonal: boundsInfo.diagonal.toFixed(2),
          });

          // Auto-fit camera to point cloud
          const cameraConfig = fitCameraToPointCloud(processedData, cameraMode);
          if (cameraConfig.orthographicConfig) {
            updateOrthographicConfig(cameraConfig.orthographicConfig);
            console.log('Camera fitted (orthographic):', cameraConfig.orthographicConfig);
          } else if (cameraConfig.firstPersonConfig) {
            updateFirstPersonConfig(cameraConfig.firstPersonConfig);
            console.log('Camera fitted (first-person):', cameraConfig.firstPersonConfig);
          }

          setPointCloud(processedData);
          setMetrics({
            totalPoints: originalCount,
            visiblePoints: processedData.count,
            fileSize: file.size,
            loadTime,
            format: data.format,
          });

          setLoading(false);
          setLoadingProgress(null);
          toggleFileLoader();
        },
        // onError
        (error) => {
          setError(error);
          console.error('Error loading point cloud:', error);
          setLoading(false);
          setLoadingProgress(null);
        }
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load file';
      setError(message);
      console.error('Error loading point cloud:', error);
      setLoading(false);
      setLoadingProgress(null);
    }
  };

  const handleLocalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleURLLoad = async () => {
    if (!urlInput.trim()) return;

    try {
      setError(null);
      setLoading(true);

      let file: File;

      if (activeTab === 'yandex') {
        file = await downloadFromYandexDisk(urlInput);
      } else if (activeTab === 'google') {
        file = await downloadFromGoogleDrive(urlInput);
      } else {
        file = await downloadFromURL(urlInput);
      }

      await handleFileSelect(file);
      setUrlInput('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to download file';
      setError(message);
      console.error('Error downloading file:', error);
      setLoading(false);
    }
  };

  if (!showFileLoader) return null;

  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Load Point Cloud</h2>
          <button
            onClick={toggleFileLoader}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            disabled={isLoading}
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4 border-b">
          {['local', 'url', 'yandex', 'google'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as LoadSource)}
              className={`px-4 py-2 font-medium ${
                activeTab === tab
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
              disabled={isLoading}
            >
              {tab === 'local' && 'Local'}
              {tab === 'url' && 'URL'}
              {tab === 'yandex' && 'Yandex Disk'}
              {tab === 'google' && 'Google Drive'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-4">
          {activeTab === 'local' && (
            <div>
              <input
                type="file"
                accept={VIEWER_CONFIG.acceptedExtensions}
                onChange={handleLocalFileChange}
                disabled={isLoading}
                className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-xs text-gray-500 mt-2">
                Supported: {VIEWER_CONFIG.supportedFormats.join(', ').toUpperCase()}
              </p>
            </div>
          )}

          {(activeTab === 'url' || activeTab === 'yandex' || activeTab === 'google') && (
            <div>
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder={
                  activeTab === 'url'
                    ? 'https://example.com/pointcloud.las'
                    : activeTab === 'yandex'
                      ? 'https://disk.yandex.ru/d/...'
                      : 'https://drive.google.com/file/d/...'
                }
                disabled={isLoading}
                className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
              <button
                onClick={handleURLLoad}
                disabled={isLoading || !urlInput.trim()}
                className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Loading...' : 'Load from ' + activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
