export interface SlideMetric {
  label: string;
  value: string;
}

export interface AgriculturalSlide {
  id: string;
  index: string;
  category: string;
  title: string;
  subtitle: string;
  tagline: string;
  description: string;
  metric: SlideMetric;
  technicalSpecs: {
    telemetryRate: string;
    solarEfficiency: string;
    coverageArea: string;
  };
  tags: string[];
  image: string;
  video?: string;
  alt: string;
  imagePosition?: string;
  imageFit?: 'cover' | 'contain';
  overlayTheme?: 'dark-photo' | 'app-screen' | 'clean';
  bgColor?: string;
  accentColor?: string;
  accentGlow?: string;
  statusBadge?: string;
  shortLabel?: string;
}

export interface MagneticGalleryProps {
  slides?: AgriculturalSlide[];
  className?: string;
}
