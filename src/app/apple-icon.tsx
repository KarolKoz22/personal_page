import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

// Same mark as icon.svg: white K on a black rounded square.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: '#0a0a0a' }}>
        <svg width="180" height="180" viewBox="0 0 32 32">
          <path fill="#ffffff" d="M9.5 7.5h3.7v6.9l6.1-6.9h4.5l-7 7.7 7.4 9.3h-4.6l-5.4-7-1 1.1v5.9H9.5z" />
        </svg>
      </div>
    ),
    size
  );
}
