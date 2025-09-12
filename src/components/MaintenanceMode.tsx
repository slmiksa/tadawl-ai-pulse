import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Clock, Mail } from 'lucide-react';
import { useSiteSettingsContext } from '@/contexts/SiteSettingsContext';

export const MaintenanceMode = () => {
  const { settings } = useSiteSettingsContext();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full glass border-primary/20">
        <CardContent className="p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold gradient-text">
              {settings.siteName}
            </h1>
            <h2 className="text-xl font-semibold text-foreground">
              الموقع قيد الصيانة
            </h2>
          </div>

          <p className="text-muted-foreground leading-relaxed">
            نعتذر عن الإزعاج. نحن نعمل حالياً على تحسين الموقع وإضافة ميزات جديدة.
            سيكون الموقع متاحاً قريباً.
          </p>

          <div className="flex items-center justify-center space-x-2 space-x-reverse text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>الصيانة مؤقتة</span>
          </div>

          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-center space-x-2 space-x-reverse text-sm">
              <Mail className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">للاستفسار:</span>
              <a 
                href={`mailto:${settings.supportEmail}`}
                className="text-primary hover:text-primary/80 transition-colors"
              >
                {settings.supportEmail}
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};