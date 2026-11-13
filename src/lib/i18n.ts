export const locales = ['pl', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'pl';

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

const dictionaries = {
  pl: {
    nav: {
      home: 'Start',
      about: 'O mnie',
      experience: 'Doświadczenie',
      education: 'Edukacja',
      projects: 'Projekty',
      podcast: 'Podcast',
      contact: 'Kontakt',
      openMenu: 'Otwórz menu'
    },
    footer: {
      tagline: 'Spokój, kierunek, działanie.'
    },
    language: {
      pl: 'PL',
      en: 'EN'
    },
    controls: {
      language: 'Język',
      theme: 'Motyw',
      light: 'Jasny',
      dark: 'Ciemny',
      system: 'System'
    },
    home: {
      title:
        'Buduję nowoczesne systemy IT: od Linux i bezpieczeństwa po CI/CD, Kubernetes i automatyzację.',
      description:
        'Jestem inżynierem DevOps. Na tej stronie znajdziesz moje doświadczenie zawodowe, edukację, projekty oraz podcast „Rozmowy z Kozłem”.',
      viewExperience: 'Zobacz doświadczenie',
      contact: 'Kontakt',
      openSection: 'Otwórz sekcję',
      highlights: {
        education: 'Zaplecze akademickie, projekty i praca inżynierska.',
        career: 'Doświadczenie w Visa i Samsung: DevOps, bezpieczeństwo i Linux.',
        projects: 'Homelab na Kubernetesie z GitOps i podglądem Argo CD na żywo.',
        podcast: 'Odcinki, wizja podcastu oraz shortsy.'
      }
    },
    voice: {
      title: 'Kim jestem?',
      helper: 'Kliknij play, posłuchaj mojej historii i czytaj napisy w trakcie.',
      placeholder: 'Napisy pojawią się tutaj podczas odtwarzania nagrania.',
      play: 'Play',
      pause: 'Pauza',
      restart: 'Restart'
    },
    about: {
      title: 'O mnie',
      description: 'Kim jestem, jak pracuję i z jakimi technologiami pracuję na co dzień.',
      bioTitle: 'Kim jestem',
      bio: [
        'Jestem inżynierem DevOps i Platform z Warszawy z około trzyletnim doświadczeniem w Samsung Electronics i Visa. Zaczynałem blisko sprzętu: od jądra Linuksa i embedded na platformach ARM, przez debugowanie hypervisora, po bezpieczeństwo obrazów Linux i Android.',
        'W Visa przeniosłem to doświadczenie na poziom platformy: budowałem pipeline’y CI/CD, wbudowywałem skanowanie bezpieczeństwa w proces dostarczania i tworzyłem powtarzalne, skonteneryzowane środowiska dla zespołów deweloperskich. Dziś najbardziej interesuje mnie inżynieria platformowa: narzędzia, które pozwalają innym zespołom dostarczać szybciej i bezpieczniej.'
      ],
      principlesTitle: 'Jak pracuję',
      principles: [
        {
          title: 'Automatyzuję to, co powtarzalne',
          text: 'Od provisioningu płytek deweloperskich w Ansible po lokalne środowiska uruchamiane jedną komendą: jeśli coś robi się drugi raz, staje się skryptem.'
        },
        {
          title: 'Bezpieczeństwo w pipeline’ie, nie na końcu',
          text: 'Skanowanie jakości kodu, zależności i podatności (SonarQube, Checkmarx, Nexus) jest częścią każdego builda, a nie osobnym etapem przed wydaniem.'
        },
        {
          title: 'Wszystko w Gicie',
          text: 'Konfiguracja, wersjonowanie i wdrożenia są opisane w repozytorium. Mój homelab zmienia się wyłącznie przez commity, a Argo CD pilnuje reszty.'
        },
        {
          title: 'Powtarzalne środowiska',
          text: 'Deweloper powinien móc odtworzyć środowisko zbliżone do produkcji na własnej maszynie, bez instrukcji na kilka stron.'
        },
        {
          title: 'Rozumiem system pod spodem',
          text: 'Doświadczenie z jądrem Linuksa, hypervisorami i siecią pomaga mi szybko znaleźć prawdziwą przyczynę problemu, a nie tylko objaw.'
        }
      ],
      stackTitle: 'Stack technologiczny',
      stack: [
        { area: 'CI/CD', items: ['GitHub Actions', 'Jenkins', 'Maven', 'JFrog Artifactory', 'wersjonowanie semantyczne'] },
        { area: 'DevSecOps', items: ['SonarQube', 'Checkmarx', 'Sonatype Nexus', 'Black Duck'] },
        { area: 'Kontenery i chmura', items: ['Docker', 'Docker Compose', 'Docker Swarm', 'Kubernetes', 'AWS (EKS, IAM, VPC)'] },
        { area: 'IaC i GitOps', items: ['Terraform', 'Ansible', 'Argo CD', 'Helm', 'Kustomize'] },
        { area: 'Linux i systemy', items: ['Ubuntu', 'Debian', 'RHEL', 'jądro Linuksa', 'Yocto', 'ARM', 'secure boot / TEE'] },
        { area: 'Obserwowalność', items: ['Prometheus', 'Grafana', 'Loki', 'Alloy'] },
        { area: 'Dane', items: ['Hadoop (HDFS)', 'Hive', 'Apache Spark', 'DB2'] },
        { area: 'Języki', items: ['Python', 'Bash', 'C'] },
        { area: 'Inżynieria z AI', items: ['Claude Code', 'serwery MCP', 'GitHub Copilot', 'Ollama'] }
      ],
      beyondTitle: 'Poza pracą',
      beyond: [
        {
          title: 'Homelab',
          text: '3-węzłowy klaster Kubernetes zarządzany w modelu GitOps, z podglądem na żywo.',
          href: '/projects',
          cta: 'Zobacz projekt'
        },
        {
          title: 'Podcast „Rozmowy z Kozłem”',
          text: 'Rozmowy o karierze, technologii, przedsiębiorczości i zdrowiu z ciekawymi gośćmi.',
          href: '/podcast',
          cta: 'Posłuchaj'
        },
        {
          title: 'Porozmawiajmy',
          text: 'Chętnie porozmawiam o DevOps, inżynierii platformowej i nowych projektach.',
          href: '/contact',
          cta: 'Kontakt'
        }
      ]
    },
    education: {
      title: 'Edukacja',
      description: 'Wykształcenie formalne, specjalistyczne szkolenia i certyfikaty.',
      galleryTitle: 'Galeria Edukacyjna',
      galleryDescription: 'Zdjęcie z pracy inżynierskiej oraz logotypy uczelni.'
    },
    experience: {
      title: 'Oś Kariery',
      description: 'Role zawodowe, rezultaty oraz kluczowe technologie.',
      remote: 'Zdalnie',
      photoTitle: 'Zdjęcie Profilowe',
      photoDescription:
        'To miejsce możesz wykorzystać na dodatkowe zdjęcie związane z Twoją pracą. Podmień plik w konfiguracji i odśwież stronę.'
    },
    contact: {
      title: 'Kontakt',
      description: 'Napisz bezpośrednio lub połącz się przez social media.',
      getInTouch: 'Skontaktuj się',
      open: 'Otwórz',
      email: 'Email'
    },
    projects: {
      title: 'Projekty',
      description: 'Rzeczy, które buduję po godzinach, żeby uczyć się w praktyce.',
      source: 'Kod',
      homelab: {
        name: 'Homelab: Kubernetes + GitOps',
        summary:
          'Klaster kubeadm z 3 węzłów na maszynach KVM, w całości zarządzany przez Argo CD w modelu app-of-apps. Każda zmiana w klastrze to commit w repozytorium — monitoring (Prometheus, Grafana, Loki, Alloy) i sekrety (Sealed Secrets) też.',
        points: [
          '3 węzły kubeadm (v1.31), containerd, Flannel, provisioning przez Ansible',
          'Argo CD zarządza samym sobą i wszystkimi komponentami z gita',
          'Wszystkie zależności przypięte do wersji — klaster zmienia się tylko przez repozytorium',
          'Metryki i logi: kube-prometheus-stack, Loki, Grafana Alloy'
        ]
      },
      argo: {
        title: 'Argo CD na żywo',
        live: 'Na żywo',
        snapshot: 'Z repozytorium',
        snapshotNote: 'Klaster jest teraz offline — pokazuję aplikacje zadeklarowane w repozytorium GitOps.',
        app: 'Aplikacja',
        sync: 'Synchronizacja',
        health: 'Stan',
        source: 'Źródło',
        updated: 'Odświeżono',
        refresh: 'Odśwież',
        commits: 'Ostatnie commity GitOps',
        loading: 'Ładowanie…',
        error: 'Nie udało się pobrać danych.',
        graph: 'Graf zależności',
        graphHint: 'Wybierz aplikację. Kliknij zasób, aby zobaczyć szczegóły, a grupę, aby ją rozwinąć.',
        graphOffline: 'Graf zależności jest dostępny, gdy klaster jest online.',
        graphError: 'Nie udało się pobrać grafu dla tej aplikacji.',
        resources: 'zasobów',
        details: {
          kind: 'Typ',
          namespace: 'Namespace',
          status: 'Status',
          node: 'Węzeł',
          containers: 'Kontenery',
          restarts: 'Restarty',
          images: 'Obrazy',
          created: 'Utworzono',
          message: 'Komunikat',
          close: 'Zamknij'
        }
      }
    },
    podcast: {
      title: 'Podcast',
      description: 'Dlaczego nagrywam, o czym mówię i gdzie możesz słuchać.',
      featured: 'Najnowsze odcinki na YouTube',
      watchOnYoutube: 'Oglądaj na YouTube',
      platforms: 'Platformy',
      episodes: 'Odcinki',
      total: 'łącznie',
      fallback: 'Odcinki są chwilowo niedostępne. Sprawdź profil Spotify, gdy synchronizacja feedu wróci.',
      shorts: 'Shorty',
      card: {
        episode: 'Odcinek',
        details: 'Szczegóły',
        listen: 'Słuchaj'
      },
      detail: {
        badge: 'Odcinek Podcastu',
        listenAudio: 'Słuchaj Audio',
        episodePage: 'Strona Odcinka',
        spotifyEmbed: 'Spotify Embed',
        youtubeEmbed: 'YouTube Embed'
      }
    },
    notFound: {
      title: 'Nie znaleziono strony',
      description: 'Strona jest niedostępna lub odcinek nie został jeszcze zsynchronizowany.',
      back: 'Wróć na start'
    }
  },
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      experience: 'Experience',
      education: 'Education',
      projects: 'Projects',
      podcast: 'Podcast',
      contact: 'Contact',
      openMenu: 'Open menu'
    },
    footer: {
      tagline: 'Clarity, direction, execution.'
    },
    language: {
      pl: 'PL',
      en: 'EN'
    },
    controls: {
      language: 'Language',
      theme: 'Theme',
      light: 'Light',
      dark: 'Dark',
      system: 'System'
    },
    home: {
      title:
        'I build modern IT systems across Linux, security, CI/CD, Kubernetes, and automation.',
      description:
        'I am a DevOps Engineer. This site covers my professional experience, education, projects, and my podcast “Rozmowy z Kozłem”.',
      viewExperience: 'View Experience',
      contact: 'Contact',
      openSection: 'Open section',
      highlights: {
        education: 'Academic background, projects, and engineering thesis.',
        career: 'Experience at Visa and Samsung: DevOps, security, and Linux.',
        projects: 'Kubernetes homelab run with GitOps, with a live Argo CD view.',
        podcast: 'Episodes, podcast vision, and shorts.'
      }
    },
    voice: {
      title: 'Who I am',
      helper: 'Press play to hear my story and follow the subtitles as they appear.',
      placeholder: 'Subtitles will appear here while the recording is playing.',
      play: 'Play',
      pause: 'Pause',
      restart: 'Restart'
    },
    about: {
      title: 'About me',
      description: 'Who I am, how I work, and the technologies I work with every day.',
      bioTitle: 'Who I am',
      bio: [
        'I am a DevOps and Platform Engineer based in Warsaw, with about three years of experience at Samsung Electronics and Visa. I started close to the hardware: the Linux kernel and embedded systems on ARM platforms, then hypervisor debugging, then security for Linux and Android images.',
        'At Visa I took that foundation to the platform level: building CI/CD pipelines, embedding security scanning into delivery, and creating reproducible, containerised environments for development teams. Today I am most interested in platform engineering: building the tools that let other teams ship faster and more safely.'
      ],
      principlesTitle: 'How I work',
      principles: [
        {
          title: 'Automate the repeatable',
          text: 'From provisioning development boards with Ansible to one-command local environments: if something is done twice, it becomes a script.'
        },
        {
          title: 'Security in the pipeline, not at the end',
          text: 'Code-quality, dependency and vulnerability scanning (SonarQube, Checkmarx, Nexus) runs in every build instead of as a separate pre-release step.'
        },
        {
          title: 'Everything in Git',
          text: 'Configuration, versioning and deployments live in the repository. My homelab only changes through commits, and Argo CD takes care of the rest.'
        },
        {
          title: 'Reproducible environments',
          text: 'A developer should be able to recreate a production-like environment on their own machine without a multi-page setup guide.'
        },
        {
          title: 'Understand the system underneath',
          text: 'Experience with the Linux kernel, hypervisors and networking helps me find the real root cause of a problem, not just the symptom.'
        }
      ],
      stackTitle: 'Tech stack',
      stack: [
        { area: 'CI/CD', items: ['GitHub Actions', 'Jenkins', 'Maven', 'JFrog Artifactory', 'semantic versioning'] },
        { area: 'DevSecOps', items: ['SonarQube', 'Checkmarx', 'Sonatype Nexus', 'Black Duck'] },
        { area: 'Containers & cloud', items: ['Docker', 'Docker Compose', 'Docker Swarm', 'Kubernetes', 'AWS (EKS, IAM, VPC)'] },
        { area: 'IaC & GitOps', items: ['Terraform', 'Ansible', 'Argo CD', 'Helm', 'Kustomize'] },
        { area: 'Linux & systems', items: ['Ubuntu', 'Debian', 'RHEL', 'Linux kernel', 'Yocto', 'ARM', 'secure boot / TEE'] },
        { area: 'Observability', items: ['Prometheus', 'Grafana', 'Loki', 'Alloy'] },
        { area: 'Data platforms', items: ['Hadoop (HDFS)', 'Hive', 'Apache Spark', 'DB2'] },
        { area: 'Languages', items: ['Python', 'Bash', 'C'] },
        { area: 'AI-assisted engineering', items: ['Claude Code', 'MCP servers', 'GitHub Copilot', 'Ollama'] }
      ],
      beyondTitle: 'Beyond work',
      beyond: [
        {
          title: 'Homelab',
          text: 'A 3-node Kubernetes cluster managed with GitOps, with a live view of its state.',
          href: '/projects',
          cta: 'See the project'
        },
        {
          title: 'Rozmowy z Kozłem podcast',
          text: 'Conversations about careers, technology, entrepreneurship and health with interesting guests.',
          href: '/podcast',
          cta: 'Listen'
        },
        {
          title: 'Let’s talk',
          text: 'Always happy to talk about DevOps, platform engineering and new projects.',
          href: '/contact',
          cta: 'Contact'
        }
      ]
    },
    education: {
      title: 'Education',
      description: 'Formal education, specialized training, and certifications.',
      galleryTitle: 'Education Gallery',
      galleryDescription: 'Bachelor thesis photo and university logos.'
    },
    experience: {
      title: 'Career Timeline',
      description: 'Professional roles, outcomes, and key technologies.',
      remote: 'Remote',
      photoTitle: 'Profile Photo',
      photoDescription:
        'Use this section for an additional work-related photo. Replace the image path in config and refresh the page.'
    },
    contact: {
      title: 'Contact',
      description: 'Reach out directly or connect on social platforms.',
      getInTouch: 'Get in touch',
      open: 'Open',
      email: 'Email'
    },
    projects: {
      title: 'Projects',
      description: 'Things I build outside of work to learn by doing.',
      source: 'Source',
      homelab: {
        name: 'Homelab: Kubernetes + GitOps',
        summary:
          'A 3-node kubeadm cluster on KVM VMs, managed entirely by Argo CD using the app-of-apps pattern. Every change to the cluster is a git commit, including monitoring (Prometheus, Grafana, Loki, Alloy) and secrets (Sealed Secrets).',
        points: [
          '3 kubeadm nodes (v1.31), containerd, Flannel, provisioned with Ansible',
          'Argo CD manages itself and every component from git',
          'Every dependency is version-pinned, so the cluster only changes through the repo',
          'Metrics and logs: kube-prometheus-stack, Loki, Grafana Alloy'
        ]
      },
      argo: {
        title: 'Live Argo CD',
        live: 'Live',
        snapshot: 'From repo',
        snapshotNote: 'The cluster is offline right now, so this shows the apps declared in the GitOps repo.',
        app: 'Application',
        sync: 'Sync',
        health: 'Health',
        source: 'Source',
        updated: 'Updated',
        refresh: 'Refresh',
        commits: 'Latest GitOps commits',
        loading: 'Loading…',
        error: 'Could not load data.',
        graph: 'Dependency graph',
        graphHint: 'Pick an application. Click a resource for details, or a group to expand it.',
        graphOffline: 'The dependency graph is available while the cluster is online.',
        graphError: 'Could not load the graph for this application.',
        resources: 'resources',
        details: {
          kind: 'Kind',
          namespace: 'Namespace',
          status: 'Status',
          node: 'Node',
          containers: 'Containers',
          restarts: 'Restarts',
          images: 'Images',
          created: 'Created',
          message: 'Message',
          close: 'Close'
        }
      }
    },
    podcast: {
      title: 'Podcast',
      description: 'Why I record, what I cover, and where to listen.',
      featured: 'Latest YouTube Episodes',
      watchOnYoutube: 'Watch on YouTube',
      platforms: 'Platforms',
      episodes: 'Episodes',
      total: 'total',
      fallback: 'Episodes are currently unavailable. Please use the Spotify profile while feed sync is down.',
      shorts: 'Shorts',
      card: {
        episode: 'Episode',
        details: 'Details',
        listen: 'Listen'
      },
      detail: {
        badge: 'Podcast Episode',
        listenAudio: 'Listen Audio',
        episodePage: 'Episode Page',
        spotifyEmbed: 'Spotify Embed',
        youtubeEmbed: 'YouTube Embed'
      }
    },
    notFound: {
      title: 'Page not found',
      description: 'The page you requested is unavailable or the episode has not been synced yet.',
      back: 'Back to home'
    }
  }
} as const;

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}
