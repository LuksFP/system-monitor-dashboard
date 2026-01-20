import { Activity, Wifi, WifiOff } from 'lucide-react';

interface HeaderProps {
  isConnected: boolean;
  lastUpdate: string | null;
}

export const Header = ({ isConnected, lastUpdate }: HeaderProps) => {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">System Monitor</h1>
              <p className="text-xs text-muted-foreground">Dashboard de Monitoramento</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {lastUpdate && (
              <span className="hidden sm:block text-xs text-muted-foreground">
                Atualizado: {new Date(lastUpdate).toLocaleTimeString('pt-BR')}
              </span>
            )}
            <div className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${
              isConnected 
                ? 'bg-status-online/10 text-status-online' 
                : 'bg-status-offline/10 text-status-offline'
            }`}>
              {isConnected ? (
                <>
                  <Wifi className="h-3 w-3" />
                  <span>Conectado</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3" />
                  <span>Desconectado</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
