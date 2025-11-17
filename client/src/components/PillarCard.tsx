import { Link } from 'wouter';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, LucideIcon } from 'lucide-react';

interface Props {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  highlight: string;
}

export default function PillarCard({ title, description, icon: Icon, href, highlight }: Props) {
  return (
    <Link href={href}>
      <Card className="h-full flex flex-col hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 border-primary/60">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg font-bold">{title}</CardTitle>
            <Icon className="w-7 h-7 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </CardContent>
        <CardFooter className="pt-4 flex items-center justify-between">
          <div className="text-xs font-semibold text-foreground">{highlight}</div>
          <div className="flex items-center text-primary">
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
            <span className="sr-only">{`Ir a ${title}`}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
