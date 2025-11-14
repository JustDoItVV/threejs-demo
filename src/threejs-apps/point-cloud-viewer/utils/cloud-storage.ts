/**
 * Cloud Storage utilities for Yandex Disk and Google Drive
 */

/**
 * Download file from URL
 */
export async function downloadFromURL(url: string): Promise<File> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to download file: ${response.statusText}`);
  }

  const blob = await response.blob();
  const filename = url.split('/').pop() || 'point-cloud.pts';

  return new File([blob], filename, { type: blob.type });
}

/**
 * Get direct download link from Yandex Disk public URL
 * Format: https://disk.yandex.ru/d/xxx or https://disk.yandex.ru/i/xxx
 */
export async function getYandexDiskDirectLink(publicUrl: string): Promise<string> {
  try {
    const apiUrl = 'https://cloud-api.yandex.net/v1/disk/public/resources/download';
    const url = `${apiUrl}?public_key=${encodeURIComponent(publicUrl)}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Yandex Disk API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.href) {
      throw new Error('No download link received from Yandex Disk');
    }

    return data.href;
  } catch (error) {
    console.error('Error getting Yandex Disk direct link:', error);
    throw new Error(
      `Failed to get download link from Yandex Disk: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Extract file ID from Google Drive share URL
 * Formats:
 * - https://drive.google.com/file/d/FILE_ID/view
 * - https://drive.google.com/open?id=FILE_ID
 */
export function extractGoogleDriveFileId(shareUrl: string): string | null {
  // Match: /d/FILE_ID/ or ?id=FILE_ID
  const match1 = shareUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match1) return match1[1];

  const match2 = shareUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (match2) return match2[1];

  return null;
}

/**
 * Get direct download link for Google Drive file
 */
export function getGoogleDriveDirectLink(shareUrl: string): string {
  const fileId = extractGoogleDriveFileId(shareUrl);

  if (!fileId) {
    throw new Error('Invalid Google Drive share URL');
  }

  // Use direct download URL
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

/**
 * Download file from Yandex Disk
 */
export async function downloadFromYandexDisk(publicUrl: string): Promise<File> {
  const directLink = await getYandexDiskDirectLink(publicUrl);
  return downloadFromURL(directLink);
}

/**
 * Download file from Google Drive
 */
export async function downloadFromGoogleDrive(shareUrl: string): Promise<File> {
  const directLink = getGoogleDriveDirectLink(shareUrl);
  return downloadFromURL(directLink);
}
