export default function WaveBackground() {
  return (
    <div className="absolute inset-x-0 bottom-0 w-full overflow-hidden leading-[0] z-0 pointer-events-none select-none">
      <svg
        className="relative block w-[200%] h-[120px] animate-wave"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        {/* Layer 1 - back wave (slower) */}
        <path
          d="M0,60 C150,100 150,20 300,60 C450,100 450,20 600,60 C750,100 750,20 900,60 C1050,100 1050,20 1200,60 L1200,120 L0,120 Z"
          className="fill-cyan-500/15"
        />
      </svg>
      <svg
        className="relative block w-[200%] h-[90px] animate-wave -mt-[90px]"
        style={{ animationDuration: '8s', animationDirection: 'reverse' }}
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        {/* Layer 2 - front wave (faster, opposing direction) */}
        <path
          d="M0,60 C150,100 150,20 300,60 C450,100 450,20 600,60 C750,100 750,20 900,60 C1050,100 1050,20 1200,60 L1200,120 L0,120 Z"
          className="fill-blue-500/20"
        />
      </svg>
    </div>
  );
}
