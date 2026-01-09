"use client";

import { useState } from 'react';
import { useCustomAuth } from '@/contexts/CustomAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { APP_LOGO, PROJECT_STATUS } from '@/shared/const';

export default function Login() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useCustomAuth();
  const formattedDate = new Intl.DateTimeFormat('es-PA', {
    dateStyle: 'long',
  }).format(new Date());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const success = login(password);
      if (!success) {
        setError('Contraseña incorrecta. Por favor, inténtelo de nuevo.');
        setPassword('');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-accent/5 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center mb-4">
            <img src="/logo-promed.webp" alt="Promed" className="h-16 object-contain" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Consultoría Estratégica PROMED</CardTitle>
            <CardDescription className="text-base mt-2">
              Portal de iniciativas de transformación: ERP, Facturación y Procesos Críticos.
            </CardDescription>
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center justify-center gap-2 rounded-full bg-muted/60 px-3 py-1 text-xs font-medium text-foreground">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Actualizado {formattedDate}
              </span>
              <p className="text-sm leading-snug text-foreground">
                {PROJECT_STATUS}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Contraseña de acceso
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingrese la contraseña"
                  className="pr-10"
                  disabled={isLoading}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {error && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  {error}
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={isLoading || !password}
            >
              {isLoading ? 'Verificando...' : 'Acceder al Portal'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t text-center text-sm text-muted-foreground">
            <p>Documento confidencial preparado para</p>
            <p className="font-semibold text-foreground mt-1">Promed, S.A.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
