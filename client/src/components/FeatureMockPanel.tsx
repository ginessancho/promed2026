import type { HTMLAttributes } from 'react';
import { useId } from 'react';
import { cn } from '@/lib/utils';

type FeatureMockVariant = 'rules' | 'alerts' | 'process' | 'cards' | 'analysis';

type MockMetric = {
  label: string;
  value: string;
  accent?: string;
  helper?: string;
};

type MockConfig = {
  badge: string;
  headline: string;
  metric: string;
  context: string;
  secondary: MockMetric[];
  bars: number[];
  trend: number[];
  footer: string;
  gradient: string;
  accent: string;
};

const MOCK_CONFIGS: Record<FeatureMockVariant, MockConfig> = {
  rules: {
    badge: 'Rules Engine',
    headline: 'Facturas validadas',
    metric: '66',
    context: 'Marcas distintas: 30 · Periodos analizados: 6',
    secondary: [
      { label: 'Costo prevenido', value: '957.781 US$', accent: 'text-sky-300' },
      { label: 'Ajustes automáticos', value: '+18 nuevas reglas', helper: 'Últimos 30 días' },
      { label: 'SLA de reacción', value: '< 12 min', accent: 'text-green-300' },
    ],
    bars: [70, 48, 62, 35, 20],
    trend: [25, 35, 30, 45, 40, 55, 60],
    footer: 'Top 5 empresas monitoreadas',
    gradient: 'from-[#25103b] via-[#11122a] to-[#050714]',
    accent: 'text-fuchsia-300',
  },
  alerts: {
    badge: 'Alert Engine',
    headline: 'Alertas preventivas',
    metric: '24 activas',
    context: '5 equipos · 3 canales (Correo · Teams · Panel)',
    secondary: [
      { label: 'Falsos positivos', value: '1.8%', accent: 'text-emerald-300' },
      { label: 'Umbral automático', value: 'Ok', helper: 'Ajustado hace 2h' },
      { label: 'Casos críticos', value: '3 en cola', accent: 'text-amber-300' },
    ],
    bars: [20, 36, 50, 68, 40],
    trend: [60, 55, 58, 62, 65, 70, 72],
    footer: 'Cobertura por línea de producto',
    gradient: 'from-[#1f1538] via-[#0d1a2b] to-[#031017]',
    accent: 'text-indigo-300',
  },
  process: {
    badge: 'Process Mining',
    headline: 'Cumplimiento propuesto',
    metric: '87%',
    context: '739,251 eventos auditados · Última corrida hoy 04:12',
    secondary: [
      { label: 'Variantes detectadas', value: '12', accent: 'text-cyan-300' },
      { label: 'Colas con retraso', value: '2', helper: 'Requiere análisis' },
      { label: 'Tiempo promedio', value: '3m 41s', accent: 'text-pink-300' },
    ],
    bars: [55, 62, 75, 80, 68],
    trend: [35, 40, 45, 43, 50, 48, 52],
    footer: 'Pasos con mayor fricción',
    gradient: 'from-[#122539] via-[#081725] to-[#030a11]',
    accent: 'text-cyan-200',
  },
  cards: {
    badge: 'Analysis Cards',
    headline: 'KPIs conectados',
    metric: '13 widgets',
    context: 'Actualizados cada 5 min · Datos ACID del DMS',
    secondary: [
      { label: 'LATAM Ledger', value: '100% synced', accent: 'text-lime-300' },
      { label: 'Facturas HOY', value: '1,245', helper: '↑ 6% vs. promedio' },
      { label: 'Alertas vistas', value: '92%', accent: 'text-blue-200' },
    ],
    bars: [15, 28, 40, 55, 70],
    trend: [15, 20, 35, 42, 50, 58, 65],
    footer: 'Indicadores críticos monitoreados',
    gradient: 'from-[#0f1d36] via-[#0a1427] to-[#050a13]',
    accent: 'text-blue-300',
  },
  analysis: {
    badge: 'Análisis volumétrico',
    headline: 'Registros auditados',
    metric: '739,251',
    context: 'Periodo Ene 2023 · Oct 2025 · DuckDB + PostgreSQL',
    secondary: [
      { label: 'Marcas dispersas', value: '898', accent: 'text-rose-300' },
      { label: 'Comodatos con error', value: '70', helper: 'Validación física' },
      { label: 'Múltiples folios', value: '430', accent: 'text-orange-200' },
    ],
    bars: [80, 65, 50, 40, 20],
    trend: [70, 68, 65, 60, 62, 58, 55],
    footer: 'Top anomalías priorizadas',
    gradient: 'from-[#1c0f25] via-[#0c111f] to-[#05060d]',
    accent: 'text-amber-200',
  },
};

type FeatureMockPanelProps = HTMLAttributes<HTMLDivElement> & {
  variant: FeatureMockVariant;
};

export default function FeatureMockPanel({
  variant,
  className,
  ...props
}: FeatureMockPanelProps) {
  const config = MOCK_CONFIGS[variant];

  return (
    <div
      className={cn(
        'h-full w-full rounded-2xl border border-white/5 bg-gradient-to-br p-4 text-white shadow-inner',
        config.gradient,
        'font-mono text-[11px]',
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-slate-400">
        <span>{config.badge}</span>
        <span>Realtime · 2025</span>
      </div>

      <div className="mt-4 space-y-1 text-left">
        <p className="text-slate-400">{config.headline}</p>
        <p className={cn('text-3xl font-semibold', config.accent)}>{config.metric}</p>
        <p className="text-slate-400">{config.context}</p>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 text-[10px]">
        {config.secondary.map((metric) => (
          <div
            key={metric.label}
            className="rounded-xl border border-white/5 bg-white/5 px-3 py-2 shadow-[0_0_10px_rgba(0,0,0,0.25)]"
          >
            <p className="text-[9px] uppercase tracking-wider text-slate-400">{metric.label}</p>
            <p className={cn('text-sm font-semibold text-white', metric.accent)}>{metric.value}</p>
            {metric.helper && <p className="text-[9px] text-slate-500">{metric.helper}</p>}
          </div>
        ))}
      </div>

      <div className="mt-5 flex h-24 items-end gap-2">
        {config.bars.map((height, index) => (
          <div key={index} className="flex-1 rounded-full bg-white/10">
            <div
              className="w-full rounded-full bg-gradient-to-t from-white/20 via-white/70 to-white"
              style={{ height: `${height}%` }}
            />
          </div>
        ))}
      </div>

      <div className="mt-3 rounded-xl border border-white/5 bg-black/30 p-3">
        <div className="flex items-center justify-between text-[9px] uppercase tracking-widest text-slate-400">
          <span>{config.footer}</span>
          <span>Detalle</span>
        </div>
        <Sparkline points={config.trend} accent={config.accent} />
      </div>
    </div>
  );
}

function Sparkline({ points, accent }: { points: number[]; accent: string }) {
  const gradientId = useId();
  const path = points
    .map((value, index) => {
      const x = (index / (points.length - 1)) * 100;
      const y = 100 - value;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="mt-2 h-16">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className={cn('h-full w-full', accent)}
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
        <polyline
          points={path}
          fill="none"
          strokeWidth={2}
          className="drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]"
          style={{ stroke: 'currentColor' }}
        />
        <polygon
          points={`${path} 100,100 0,100`}
          fill={`url(#${gradientId})`}
          opacity={0.2}
        />
      </svg>
    </div>
  );
}

