import React from 'react';
import {
  Workflow,
  FileCode2,
  Activity,
  KeyRound,
  Zap,
  Terminal,
} from 'lucide-react';
import { cn } from '../../lib/utils';

const FEATURES = [
  {
    icon: Workflow,
    title: 'A canvas, not a config file',
    description:
      'Drag steps onto a visual graph, wire dependencies intuitively, and let the layout map roadmaps and milestones for you.',
  },
  {
    icon: FileCode2,
    title: 'Two-way sync & live state',
    description:
      'Edit the roadmap or the underlying task queue, the other follows in real-time. Your central data model stays the single source of truth.',
  },
  {
    icon: Activity,
    title: 'Progress you can watch live',
    description:
      'Every team sprint replays on the live canvas. Bottlenecks highlight immediately with granular activity logs just one click away.',
  },
  {
    icon: KeyRound,
    title: 'Granular role & space access',
    description:
      'Scope permissions to client portals, teams, or workspace branches. External contractors only see their designated paths.',
  },
  {
    icon: Zap,
    title: 'Surgical task automations',
    description:
      'Trigger custom webhooks and status transitions automatically without re-executing entire pipeline phases.',
  },
  {
    icon: Terminal,
    title: 'Extensible API & CLI tools',
    description:
      'Export roadmap views, sync status directly from GitHub or terminal commands, and automate recurring sprints with simple endpoints.',
  },
];

/** Corner crosshair, drawn half outside the card edge like a survey mark. */
const CrossDecor = ({ position }: { position: 'top-start' | 'bottom-end' }) => {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#5e6622"
      strokeWidth="1.5"
      strokeLinecap="round"
      style={{
        pointerEvents: 'none',
        position: 'absolute',
        zIndex: 10,
        width: '14px',
        height: '14px',
        opacity: 0.5,
        ...(position === 'top-start'
          ? { left: 0, top: 0, transform: 'translate(-50%, -50%)' }
          : { right: 0, bottom: 0, transform: 'translate(50%, 50%)' }),
      }}
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
};

const FeatureCard = ({
  className,
  children,
  ...props
}: React.ComponentProps<'div'>) => {
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      className={cn('feature-spotlight-card group', className)}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        background: '#ffffff',
        padding: '32px 28px',
        borderRadius: '20px',
        border: '1px solid rgba(94, 102, 34, 0.14)',
        boxShadow: '0 2px 12px -2px rgba(40, 44, 15, 0.04)',
        overflow: 'hidden',
        transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.borderColor = 'rgba(94, 102, 34, 0.35)';
        e.currentTarget.style.boxShadow = '0 12px 30px -4px rgba(94, 102, 34, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'rgba(94, 102, 34, 0.14)';
        e.currentTarget.style.boxShadow = '0 2px 12px -2px rgba(40, 44, 15, 0.04)';
      }}
      {...props}
    >
      {/* Pointer-follow spotlight glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(circle 220px at var(--mx, 50%) var(--my, 50%), rgba(184, 199, 66, 0.22), transparent 75%)',
        }}
      />
      {children}
    </div>
  );
};

export const FeatureGridSpotlight: React.FC = () => {
  return (
    <div className="section">
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '9999px',
              background: 'rgba(94, 102, 34, 0.08)',
              border: '1px solid rgba(94, 102, 34, 0.2)',
              marginBottom: '16px',
            }}
          >
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#5e6622',
              }}
            >
              Engineered Capabilities
            </span>
          </div>
          <h2 className="heading h2" style={{ marginBottom: '16px' }}>
            Built for velocity. <span className="accent-text">Refined for clarity.</span>
          </h2>
          <p className="paragraph large" style={{ color: '#555555' }}>
            A modular engine supporting everything from complex architectural dependencies to fast everyday deliverables.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
          }}
        >
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <FeatureCard key={idx}>
                <CrossDecor position="top-start" />
                <CrossDecor position="bottom-end" />
                <div
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: 'rgba(250, 250, 240, 0.9)',
                    border: '1px solid rgba(94, 102, 34, 0.2)',
                    color: '#5e6622',
                  }}
                >
                  <Icon size={22} strokeWidth={1.8} />
                </div>
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <h3 className="heading h6" style={{ marginBottom: '8px', color: '#171717' }}>
                    {feature.title}
                  </h3>
                  <p className="paragraph small no-margin" style={{ color: '#555555', lineHeight: 1.6 }}>
                    {feature.description}
                  </p>
                </div>
              </FeatureCard>
            );
          })}
        </div>
      </div>
    </div>
  );
};
