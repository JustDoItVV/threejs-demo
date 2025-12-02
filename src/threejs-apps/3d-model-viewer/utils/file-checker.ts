export async function checkFileExists(url: string): Promise<{ exists: boolean; isHtml: boolean; error?: string }> {
  try {
    const response = await fetch(url, { method: 'GET' });

    if (!response.ok) {
      return {
        exists: false,
        isHtml: false,
        error: `HTTP ${response.status}: ${response.statusText}`
      };
    }

    const contentType = response.headers.get('content-type') || '';
    const isHtml = contentType.includes('text/html') || contentType.includes('text/plain');

    const buffer = await response.arrayBuffer();
    const decoder = new TextDecoder();
    const firstChars = decoder.decode(buffer.slice(0, 100));
    const containsHtml = firstChars.trim().startsWith('<!DOCTYPE') ||
                         firstChars.trim().startsWith('<html') ||
                         firstChars.includes('404') ||
                         firstChars.includes('Not Found');

    return {
      exists: response.ok,
      isHtml: isHtml || containsHtml
    };
  } catch (error) {
    return {
      exists: false,
      isHtml: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
