'use client';

import { useState, useRef } from 'react';

import { getAssetPath } from '@/ui/utils';
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';

import { ModelSource, validateModelFile, validateModelUrl } from './model-loader';

export interface DefaultModel {
  id: string;
  name: string;
  url: string;
  format: 'glb' | 'gltf' | 'fbx' | 'obj';
  thumbnail?: string;
}

const DEFAULT_MODELS: DefaultModel[] = [
  {
    id: 'iphone-14',
    name: 'iPhone 14 Pro',
    url: getAssetPath('/models/iphone-14/iPhone 14 pro.glb'),
    format: 'glb',
  },
  // Add more default models here in the future
];

interface ModelUploadControlsProps {
  onModelSelect: (source: ModelSource) => void;
  currentModel: string | null;
}

export function ModelUploadControls({ onModelSelect, currentModel }: ModelUploadControlsProps) {
  const [urlInput, setUrlInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateModelFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    setError(null);
    onModelSelect({
      type: 'file',
      data: file,
      format: validation.format!,
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUrlLoad = () => {
    if (!urlInput.trim()) {
      setError('Please enter a URL');
      return;
    }

    const validation = validateModelUrl(urlInput);
    if (!validation.valid) {
      setError(validation.error || 'Invalid URL');
      return;
    }

    setError(null);
    onModelSelect({
      type: 'url',
      data: urlInput,
      format: validation.format!,
    });
    setUrlInput('');
  };

  const handleDefaultModelSelect = (model: DefaultModel) => {
    setError(null);
    onModelSelect({
      type: 'url',
      data: model.url,
      format: model.format,
    });
  };

  if (!isExpanded) {
    return (
      <div className="absolute top-4 left-4 z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(true)}
        >
          Load Model
        </Button>
      </div>
    );
  }

  return (
    <div className="absolute top-4 left-4 z-10 bg-background/95 backdrop-blur border rounded-lg p-4 space-y-4 max-w-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Load 3D Model</h3>
        <Button variant="ghost" size="sm" onClick={() => setIsExpanded(false)}>
          Hide
        </Button>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-2 bg-destructive/10 border border-destructive/20 rounded text-xs text-destructive">
          {error}
        </div>
      )}

      {/* Default Models */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Default Models</p>
        <div className="grid grid-cols-1 gap-2">
          {DEFAULT_MODELS.map((model) => (
            <Button
              key={model.id}
              variant={currentModel === model.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleDefaultModelSelect(model)}
              className="justify-start"
            >
              <span className="flex-1 text-left">{model.name}</span>
              <Badge variant="secondary" className="text-[10px] ml-2">
                {model.format.toUpperCase()}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* File Upload */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Upload File</p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".glb,.gltf,.fbx,.obj"
          onChange={handleFileUpload}
          className="hidden"
          id="model-file-input"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="w-full"
        >
          Choose File
        </Button>
        <p className="text-[10px] text-muted-foreground">
          Supported: GLB, GLTF, FBX, OBJ (max 2GB)
        </p>
      </div>

      {/* URL Input */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Load from URL</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleUrlLoad()}
            placeholder="https://example.com/model.glb"
            className="flex-1 px-2 py-1 text-xs border rounded bg-background"
          />
          <Button variant="outline" size="sm" onClick={handleUrlLoad}>
            Load
          </Button>
        </div>
      </div>

      {/* Info */}
      <div className="pt-2 border-t text-[10px] text-muted-foreground space-y-1">
        <p>• Upload your own 3D model or use defaults</p>
        <p>• File size limit: 2GB</p>
        <p>• Formats: GLB, GLTF, FBX, OBJ</p>
      </div>
    </div>
  );
}
