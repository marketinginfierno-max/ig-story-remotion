import React from "react";
import { Composition } from "remotion";
import { DailyStory, dailyStorySchema } from "./DailyStory";

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="DailyStory"
        component={DailyStory}
        durationInFrames={150} // 5s @ 30fps. Cambia esto para historias mas largas.
        fps={30}
        width={1080}
        height={1920}
        schema={dailyStorySchema}
        defaultProps={{
          headline: "Nuevo en el menu",
          subtext: "Prueba nuestro combo del dia, hoy con 20% de descuento.",
          badge: "HOY",
          bgColorFrom: "#1a1a2e",
          bgColorTo: "#16213e",
          accentColor: "#e94560",
        }}
      />
    </>
  );
};
