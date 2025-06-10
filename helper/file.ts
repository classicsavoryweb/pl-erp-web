export function getFileTypeFromBase64(base64: string) {
    const match = base64.match(/^data:(.*?);base64,/);
    if (!match) return 'unknown';

    const mimeType = match[1];

    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType === 'application/pdf') return 'pdf';

    return 'unknown';
}