import { ImageResponse } from 'next/og';

export const alt = 'Karol Kozłowski: DevOps & Platform Engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Link-preview card for LinkedIn, Slack, X, WhatsApp...
export default function OpengraphImage() {
  const tags = ['CI/CD', 'DevSecOps', 'Kubernetes', 'GitOps', 'Linux'];
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: 'radial-gradient(120% 120% at 0% 0%, #3a2516 0%, #16110d 55%, #0b0907 100%)',
          color: '#f5efe8'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <svg width="64" height="64" viewBox="0 0 32 32">
            <rect width="32" height="32" rx="7" fill="#0a0a0a" />
            <path fill="#ffffff" d="M9.5 7.5h3.7v6.9l6.1-6.9h4.5l-7 7.7 7.4 9.3h-4.6l-5.4-7-1 1.1v5.9H9.5z" />
          </svg>
          <div style={{ fontSize: 28, color: '#c9b8a6' }}>karolkozlowski.pl</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: -2 }}>Karol Kozłowski</div>
          <div style={{ fontSize: 40, color: '#f08a3c' }}>DevOps & Platform Engineer</div>
          <div style={{ fontSize: 28, color: '#c9b8a6' }}>Experience at Visa and Samsung · Warsaw, Poland</div>
        </div>

        <div style={{ display: 'flex', gap: 14 }}>
          {tags.map((tag) => (
            <div
              key={tag}
              style={{
                display: 'flex',
                fontSize: 24,
                padding: '10px 22px',
                borderRadius: 999,
                border: '1px solid rgba(245,239,232,0.25)',
                color: '#e8ddd2'
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    size
  );
}
