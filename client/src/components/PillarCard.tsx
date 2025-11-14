import { ArrowRight, LucideIcon } from 'lucide-react';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

interface PillarCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  highlight?: string;
  color: string;
}

export default function PillarCard({ title, description, icon: Icon, href, highlight, color }: PillarCardProps) {
  return (
    <Link href={href}>
      <Card 
        className="h-full cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 hover:border-primary group"
        style={{ '--pillar-color': color } as React.CSSProperties}
      >
        <CardHeader>
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
            style={{ backgroundColor: color, opacity: 0.15 }}
          >
            <Icon className="w-8 h-8" style={{ color }} />
          </div>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription className="text-base mt-2">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {highlight && (
            <div 
              className="px-4 py-3 rounded-lg mb-4 font-semibold"
              style={{ backgroundColor: color, opacity: 0.1 }}
            >
              <span style={{ color }}>{highlight}</span>
            </div>
          )}
          <Button variant="ghost" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            Ver Detalles
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}
