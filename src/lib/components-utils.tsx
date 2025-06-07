import * as Icons from "lucide-react";

export function IconRenderer({
  name,
  className,
}: {
  name: string;
  className: string;
}) {
  const IconComponent = Icons[
    name as keyof typeof Icons
  ] as React.ComponentType<{ className?: string }>;
  return IconComponent ? <IconComponent className={className} /> : null;
}
