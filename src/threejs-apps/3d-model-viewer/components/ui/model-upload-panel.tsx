'use client';

import { useMemo, useRef, useState } from 'react';

import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';

import { DEFAULT_MODELS } from '../../const';
import { useStore } from '../../store';
import { validateModelFile } from '../../utils/model-utils';

import type { ChangeEvent } from 'react';

function parseFileSize(sizeStr: string): number {
  const match = sizeStr.match(/([\d.]+)\s*(KB|MB|Mb|GB)/i);
  if (!match) return 0;

  const value = parseFloat(match[1]);
  const unit = match[2].toUpperCase();

  switch (unit) {
    case 'KB':
      return value * 1024;
    case 'MB':
      return value * 1024 * 1024;
    case 'GB':
      return value * 1024 * 1024 * 1024;
    default:
      return 0;
  }
}

export function ModelUploadPanel() {
  const setSource = useStore((state) => state.setSource);
  const source = useStore((state) => state.source);

  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sortedDefaultModels = useMemo(() => {
    return [...DEFAULT_MODELS].sort((a, b) => parseFileSize(a.size) - parseFileSize(b.size));
  }, []);

  const selectedDefaultModelId =
    source?.type === 'url' && !source.file
      ? sortedDefaultModels.find((m) => m.url === source.url)?.id || ''
      : '';

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateModelFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      setWarning(null);
      return;
    }

    setError(null);

    if (file.name.toLowerCase().endsWith('.gltf')) {
      setWarning(
        'GLTF files with external resources (.bin, textures) may not load correctly. Please use GLB format for best compatibility.'
      );
    } else {
      setWarning(null);
    }

    setSource({
      type: 'file',
      format: validation.format!,
      file: file,
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDefaultModelSelect = (modelId: string) => {
    const model = sortedDefaultModels.find((m) => m.id === modelId);
    if (!model) return;

    setError(null);
    setWarning(null);
    setSource({
      type: 'url',
      format: model.format,
      file: null,
      url: model.url,
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-md py-1">Load 3D Model</h3>

      {error && (
        <div className="p-2 bg-destructive/10 border border-destructive/20 rounded text-xs text-destructive">
          {error}
        </div>
      )}

      {warning && (
        <div className="p-2 bg-yellow-500/10 border border-yellow-500/20 rounded text-xs text-yellow-600 dark:text-yellow-400">
          ⚠️ {warning}
        </div>
      )}

      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">Default Models</label>
        <Select value={selectedDefaultModelId} onValueChange={handleDefaultModelSelect}>
          <SelectTrigger>
            <SelectValue
              placeholder={
                source?.type === 'file' ? 'Custom file loaded' : 'Select default model...'
              }
            />
          </SelectTrigger>
          <SelectContent>
            {sortedDefaultModels.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                <div className="flex items-center gap-2">
                  <span className="flex-1">{model.name}</span>
                  <span className="text-xs text-muted-foreground">{model.size}</span>
                  <Badge variant="secondary" className="text-[10px]">
                    {model.format.toUpperCase()}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

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

      <div className="pt-2 border-t text-[10px] text-muted-foreground space-y-1">
        <p>• Upload your own 3D model or select from defaults</p>
        <p>• File size limit: 2GB</p>
        <p>• Supported formats: GLB, GLTF, FBX, OBJ</p>
      </div>
    </div>
  );
}
