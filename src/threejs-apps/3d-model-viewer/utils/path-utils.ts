export function resolveModelUrl(url: string): string {
  if (url.startsWith('http') || url.startsWith('blob:')) {
    return url;
  }

  const baseUrl = window.location.origin;

  const normalizedPath = url.startsWith('/') ? url : `/${url}`;

  return `${baseUrl}${normalizedPath}`;
}

export async function checkFileAccessibility(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}
