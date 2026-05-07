import { Plus_Jakarta_Sans } from "next/font/google";
import type { ReactNode } from "react";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-club-kinetic",
  display: "swap",
});

/**
 * Loads typography and Material Symbols used by Stitch-aligned club screens.
 */
export default function ClubsLayout({ children }: { children: ReactNode }): React.JSX.Element {
  return (
    <div className={`${plusJakarta.variable} min-h-0 font-[family-name:var(--font-club-kinetic),sans-serif]`}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
      />
      {children}
    </div>
  );
}
