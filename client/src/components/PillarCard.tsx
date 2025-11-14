import { Link } from 'wouter';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, LucideIcon } from 'lucide-react';

interface Props {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  highlight: string;
  color: string; // This will now be a Tailwind border color class
}

export default function PillarCard({ title, description, icon: Icon, href, highlight, color }: Props) {
  return (
    <Link href={href}>
      <Card className={`h-full flex flex-col hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 ${color}`}>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg font-bold">{title}</CardTitle>
            <Icon className="w-7 h-7 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </CardContent>
        <CardFooter className="pt-4 flex-col items-start">
          <div className="w-full text-xs font-semibold text-foreground mb-3">
            {highlight}
          </div>
          <div className="w-full flex justify-end text-primary font-semibold text-sm items-center gap-2">
            Ver Detalles <ArrowRight className="w-4 h-4" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
