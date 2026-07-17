import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { z } from "zod";

// Props tipadas: cambia estos valores por dia sin tocar el diseño.
export const dailyStorySchema = z.object({
  headline: z.string(),
  subtext: z.string(),
  badge: z.string(),
  bgColorFrom: z.string(),
  bgColorTo: z.string(),
  accentColor: z.string(),
});

type Props = z.infer<typeof dailyStorySchema>;

export const DailyStory: React.FC<Props> = ({
  headline,
  subtext,
  badge,
  bgColorFrom,
  bgColorTo,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrada del badge (rebote)
  const badgeScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 200 },
  });

  // Entrada del titulo (desliza + fade)
  const headlineProgress = spring({
    frame: frame - 8,
    fps,
    config: { damping: 15 },
  });
  const headlineY = interpolate(headlineProgress, [0, 1], [40, 0]);
  const headlineOpacity = interpolate(frame, [8, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Entrada del subtexto
  const subtextOpacity = interpolate(frame, [20, 32], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subtextY = interpolate(frame, [20, 32], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.ease),
  });

  // Barra de progreso inferior (útil para stories tipo "cuenta regresiva")
  const progress = interpolate(frame, [0, 149], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${bgColorFrom} 0%, ${bgColorTo} 100%)`,
        fontFamily: "Helvetica, Arial, sans-serif",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "140px 90px",
      }}
    >
      {/* Badge tipo "HOY" */}
      <div
        style={{
          transform: `scale(${badgeScale})`,
          background: accentColor,
          color: "white",
          fontWeight: 700,
          fontSize: 34,
          padding: "12px 32px",
          borderRadius: 999,
          letterSpacing: 2,
          marginBottom: 40,
        }}
      >
        {badge}
      </div>

      {/* Titulo principal */}
      <div
        style={{
          opacity: headlineOpacity,
          transform: `translateY(${headlineY}px)`,
          color: "white",
          fontSize: 88,
          fontWeight: 800,
          lineHeight: 1.05,
          marginBottom: 30,
        }}
      >
        {headline}
      </div>

      {/* Subtexto */}
      <div
        style={{
          opacity: subtextOpacity,
          transform: `translateY(${subtextY}px)`,
          color: "rgba(255,255,255,0.85)",
          fontSize: 42,
          lineHeight: 1.4,
          maxWidth: 850,
        }}
      >
        {subtext}
      </div>

      {/* Barra de progreso (opcional, estilo cuenta regresiva) */}
      <div
        style={{
          position: "absolute",
          bottom: 100,
          left: 90,
          right: 90,
          height: 8,
          borderRadius: 4,
          background: "rgba(255,255,255,0.2)",
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: "100%",
            borderRadius: 4,
            background: accentColor,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
