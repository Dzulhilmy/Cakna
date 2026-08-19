import {
  HeartHandshake,
  Briefcase,
  HeartPulse,
  Smartphone,
  GraduationCap,
  Rocket,
  Leaf,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  HeartHandshake,
  Briefcase,
  HeartPulse,
  Smartphone,
  GraduationCap,
  Rocket,
  Leaf,
};

export function CoreIcon({
  name,
  size = 22,
  strokeWidth = 1.75,
  className,
}: {
  name: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  const Icon = iconMap[name] ?? HeartHandshake;
  return <Icon size={size} strokeWidth={strokeWidth} className={className} />;
}
