type Props = { size?: number; showText?: boolean; animate?: boolean; className?: string };

/** AF monogram: the A's left leg rises to an apex that becomes the F's top arm;
 *  the A's crossbar runs into the F's stem, so both letters share one stroke. */
export default function Logo({ size = 96, showText = true, animate = false, className = '' }: Props) {
  const stroke = animate ? 'draw' : '';
  return (
    <div className={`inline-flex flex-col items-center ${className}`} aria-label="AFZIYA FASHION">
      <svg width={size} height={size * 0.92} viewBox="0 0 120 110" fill="none" role="img">
        <defs>
          <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#E8CF8E" />
            <stop offset="0.55" stopColor="#C9A24B" />
            <stop offset="1" stopColor="#9A7A2E" />
          </linearGradient>
        </defs>
        <g stroke="url(#goldGrad)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" transform="translate(4 4)">
          <path className={stroke} d="M14 90 L44 15 L100 15" />
          <path className={stroke} d="M44 15 L62 58" />
          <path className={stroke} d="M62 15 V90" />
          <path className={stroke} d="M62 48 H92" />
          <path className={stroke} d="M30 66 H62" />
        </g>
      </svg>
      {showText && (
        <span
          className="mt-2 font-display font-semibold text-gold"
          style={{ fontSize: size * 0.2, letterSpacing: '0.38em', paddingLeft: '0.38em' }}
        >
          AFZIYA FASHION
        </span>
      )}
    </div>
  );
}
