import { cn } from "@/lib/utils";

type ClubNavigatorAmberNocturneFrameProps = {
  className?: string;
};

/**
 * Embeds the Stitch-exported HTML for “Club Navigator - Amber Nocturne” unchanged
 * so typography, Tailwind runtime theme, Material Symbols, and image URLs match the design.
 */
export function ClubNavigatorAmberNocturneFrame({
  className,
}: ClubNavigatorAmberNocturneFrameProps): React.JSX.Element {
  return (
    <iframe
      title="Club Navigator - Amber Nocturne"
      src="/designs/club-navigator-amber-nocturne.html"
      className={cn("h-full min-h-0 w-full border-0 bg-background", className)}
    />
  );
}
