export const siteConfig = {
  name: 'My Personal Website',
  title: 'Karol Kozłowski | Mid DevOps Engineer',
  description:
    'Mid DevOps Engineer portfolio covering Linux, security, CI/CD, Kubernetes, automation, career timeline, education, and podcast content.',
  seoKeywords: [
    'Karol Kozłowski',
    'DevOps Engineer',
    'Mid DevOps Engineer',
    'Platform Engineering',
    'Kubernetes',
    'Linux',
    'CI/CD',
    'DevSecOps',
    'Docker',
    'Infrastructure as Code',
    'Automation',
    'Cloud',
    'Monitoring',
    'GitHub Actions',
    'Jenkins',
    'SRE',
    'Poland DevOps'
  ],
  url: 'https://karolkozlowski.pl',
  author: 'Karol Kozłowski',
  role: 'DevOps Engineer @ Visa',
  location: 'Poland',
  youtubeChannelId: process.env.YOUTUBE_CHANNEL_ID ?? '',
  social: {
    github: 'https://github.com/KarolKoz22',
    linkedin: 'https://www.linkedin.com/in/karol-koz%C5%82owski-54ab6823a/',
    youtube: 'https://www.youtube.com/@RozmowyzKoz%C5%82em',
    spotify: 'https://open.spotify.com/show/3hpVmQuOU2Q0gZXUYgJFuM?fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGnkG8UG9fKY2R1H92_F8-skGyO9qsbl7UhD6dwTpUEx6nCdNGYUgsItroPjN0_aem_LFwt1H0s2CYJG_9GH_KPpg',
    instagram: 'https://www.instagram.com/rozmowyzkozlem',
    tiktok: 'https://www.tiktok.com/@rozmowyzkozlem'
  },
  email: 'kozlowskikarol02@gmail.com',
  homelab: {
    repo: 'KarolKoz22/homelab-gitops',
    branch: 'main',
    repoUrl: 'https://github.com/KarolKoz22/homelab-gitops',
    stack: ['Kubernetes', 'kubeadm', 'Argo CD', 'Helm', 'Kustomize', 'Sealed Secrets', 'Prometheus', 'Grafana', 'Loki', 'Alloy', 'Ansible', 'KVM']
  },
  voiceIntro: {
    imageSrc: '/karol-photo.jpg',
    imageAlt: 'Karol portrait',
    audioSrc: '/audio/intro.mp3'
  },
  experienceShowcase: {
    imageSrc: '/experience-photo.jpeg',
    imageAlt: 'Karol during engineering work'
  },
  educationGallery: {
    thesisPhoto: {
      src: '/education/thesis-photo.jpg',
      alt: 'Karol presenting bachelor thesis project'
    },
    aghLogo: {
      src: '/education/agh-logo.jpeg',
      alt: 'AGH University logo'
    },
    pwLogo: {
      src: '/education/pw-logo.jpeg',
      alt: 'Warsaw University of Technology logo'
    }
  },
  contactShowcase: {
    imageSrc: '/contact/contact-photo.jpg',
    imageAlt: 'Karol contact portrait'
  }
};

export type SiteConfig = typeof siteConfig;
