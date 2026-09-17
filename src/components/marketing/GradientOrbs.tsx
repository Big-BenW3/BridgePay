export function GradientOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
      <div className="absolute -top-[180px] left-1/2 -translate-x-1/2 w-[1200px] h-[700px] orb-violet rounded-full blur-[1px]" />
      <div className="absolute top-[40px] right-[-80px] w-[700px] h-[500px] orb-pink rounded-full" />
      <div className="absolute top-[260px] left-[-60px] w-[500px] h-[400px] orb-amber rounded-full opacity-60 hidden lg:block" />
    </div>
  );
}

