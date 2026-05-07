import * as React from "react";

export function Hero({
  headline,
  subheadline,
}: {
  headline: string;
  subheadline: string;
}): React.JSX.Element {
  const [heroParallax, setHeroParallax] = React.useState<{
    x: number;
    y: number;
    active: boolean;
  }>({
    x: 0,
    y: 0,
    active: false,
  });
  const [neonFlickerLevel, setNeonFlickerLevel] = React.useState<number>(0.25);
  const neonTimeoutsRef = React.useRef<number[]>([]);

  /**
   * Runs a short electric-style flicker sequence.
   */
  const triggerNeonFlicker = React.useCallback(() => {
    neonTimeoutsRef.current.forEach((timeoutId) =>
      window.clearTimeout(timeoutId),
    );
    neonTimeoutsRef.current = [];

    const flickerFrames: Array<{ delayMs: number; level: number }> = [
      { delayMs: 0, level: 1 },
      { delayMs: 55, level: 0.16 },
      { delayMs: 110, level: 0.92 },
      { delayMs: 180, level: 0.34 },
      { delayMs: 260, level: 0.98 },
      { delayMs: 360, level: 0.52 },
      { delayMs: 520, level: 0.76 },
      { delayMs: 760, level: 0.36 },
    ];

    flickerFrames.forEach(({ delayMs, level }) => {
      const timeoutId = window.setTimeout(() => {
        setNeonFlickerLevel(level);
      }, delayMs);
      neonTimeoutsRef.current.push(timeoutId);
    });
  }, []);

  React.useEffect(() => {
    triggerNeonFlicker();
    return () => {
      neonTimeoutsRef.current.forEach((timeoutId) =>
        window.clearTimeout(timeoutId),
      );
      neonTimeoutsRef.current = [];
    };
  }, [triggerNeonFlicker]);

  /**
   * Tracks pointer movement to create a subtle hover parallax effect.
   */
  const handleHeroPointerMove = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      const bounds = event.currentTarget.getBoundingClientRect();
      const normalizedX = (event.clientX - bounds.left) / bounds.width - 0.5;
      const normalizedY = (event.clientY - bounds.top) / bounds.height - 0.5;
      setHeroParallax({
        x: normalizedX,
        y: normalizedY,
        active: true,
      });
    },
    [],
  );

  /**
   * Triggers a short neon bloom whenever hover starts.
   */
  const handleHeroPointerEnter = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      handleHeroPointerMove(event);
      triggerNeonFlicker();
    },
    [handleHeroPointerMove, triggerNeonFlicker],
  );

  /**
   * Resets image animation when pointer exits the hero section.
   */
  const handleHeroPointerLeave = React.useCallback(() => {
    setHeroParallax({
      x: 0,
      y: 0,
      active: false,
    });
  }, []);

  return (
    <section
      className="relative hidden overflow-hidden md:block"
      onMouseMove={handleHeroPointerMove}
      onMouseEnter={handleHeroPointerEnter}
      onMouseLeave={handleHeroPointerLeave}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDOtYVMup0fIb8SNQAwKD6Oa7otj0IhLGYpl1mRY9_BJQ06D4NJjVJPljrZYNxOiJJJGsWYgbq_4Ep8igjEWyrNum1CBZt3YD-9Qlm-siDh18npP8AZ2CytyprrUjzDFXIMRqKdXalk6vyE70NlL3cMX4gflO9E9rAhG6U7-YQXOYREHIi8b5CavjWIW-mHFbsTRzuImgA81OkSqnO1EnO0P2U_6SuRmNFU3VjpUIsYJMazGx3ge30HjaEdHEYNjq7ymps_pM0H2rNd')",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center transition-transform duration-300 ease-out"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDOtYVMup0fIb8SNQAwKD6Oa7otj0IhLGYpl1mRY9_BJQ06D4NJjVJPljrZYNxOiJJJGsWYgbq_4Ep8igjEWyrNum1CBZt3YD-9Qlm-siDh18npP8AZ2CytyprrUjzDFXIMRqKdXalk6vyE70NlL3cMX4gflO9E9rAhG6U7-YQXOYREHIi8b5CavjWIW-mHFbsTRzuImgA81OkSqnO1EnO0P2U_6SuRmNFU3VjpUIsYJMazGx3ge30HjaEdHEYNjq7ymps_pM0H2rNd')",
          transform: `translate3d(${heroParallax.x * 8}px, ${heroParallax.y * 8}px, 0) scale(${heroParallax.active ? 1.015 : 1})`,
          clipPath: "ellipse(18% 29% at 39% 52%)",
          filter: "saturate(1.08) contrast(1.03)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center transition-transform duration-300 ease-out"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDOtYVMup0fIb8SNQAwKD6Oa7otj0IhLGYpl1mRY9_BJQ06D4NJjVJPljrZYNxOiJJJGsWYgbq_4Ep8igjEWyrNum1CBZt3YD-9Qlm-siDh18npP8AZ2CytyprrUjzDFXIMRqKdXalk6vyE70NlL3cMX4gflO9E9rAhG6U7-YQXOYREHIi8b5CavjWIW-mHFbsTRzuImgA81OkSqnO1EnO0P2U_6SuRmNFU3VjpUIsYJMazGx3ge30HjaEdHEYNjq7ymps_pM0H2rNd')",
          transform: `translate3d(${heroParallax.x * 6}px, ${heroParallax.y * 6}px, 0) scale(${heroParallax.active ? 1.01 : 1})`,
          clipPath: "ellipse(13% 17% at 39% 33%)",
          filter: "saturate(1.12) contrast(1.05)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(420px circle at 52% 45%, rgba(0, 255, 255, 0.14), transparent 62%), radial-gradient(540px circle at 58% 52%, rgba(255, 0, 168, 0.12), transparent 68%)",
          transform: `translate3d(${heroParallax.x * -8}px, ${heroParallax.y * -8}px, 0)`,
          opacity: heroParallax.active ? 0.95 : 0.7,
          mixBlendMode: "screen",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 transition-all duration-500"
        style={{
          background:
            "radial-gradient(180px circle at 70% 30%, rgba(255, 106, 0, 0.38), transparent 72%), radial-gradient(240px circle at 17% 58%, rgba(0, 246, 255, 0.34), transparent 75%), radial-gradient(200px circle at 80% 66%, rgba(255, 0, 168, 0.28), transparent 78%)",
          opacity:
            0.22 + neonFlickerLevel * (heroParallax.active ? 0.78 : 0.66),
          filter: `blur(${12 + neonFlickerLevel * 13}px) saturate(${1.08 + neonFlickerLevel * 0.24})`,
          mixBlendMode: "screen",
          transform: `translate3d(${heroParallax.x * -6}px, ${heroParallax.y * -6}px, 0) scale(${1 + neonFlickerLevel * 0.06})`,
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-transparent via-transparent to-surface-deepest" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-linear-to-r from-surface-deepest/0 via-surface-deepest/50 to-surface-deepest" />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-surface-deepest/90 via-surface-deepest/20 to-transparent" />
      <div className="relative flex h-full items-end p-16">
        <div className="max-w-md">
          <h2 className="text-5xl font-semibold leading-tight text-foreground">
            {headline}
          </h2>
          <p className="mt-5 text-2xl leading-snug text-muted-foreground/80">
            {subheadline}
          </p>
        </div>
      </div>
    </section>
  );
}
