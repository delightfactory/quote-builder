import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import Button from './ui/Button';
import { promptInstall, isPWA } from '@/utils/registerServiceWorker';

const InstallPWA = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    setIsInstalled(isPWA());

    // Listen for install prompt availability
    const handleInstallAvailable = () => {
      if (!isPWA()) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('pwa-install-available', handleInstallAvailable);

    // Check localStorage for dismissed state
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
      
      // Show again after 7 days
      if (daysSinceDismissed < 7) {
        setShowPrompt(false);
      }
    }

    return () => {
      window.removeEventListener('pwa-install-available', handleInstallAvailable);
    };
  }, []);

  const handleInstall = async () => {
    const accepted = await promptInstall();
    if (accepted) {
      setShowPrompt(false);
      setIsInstalled(true);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // Don't show if already installed or dismissed
  if (isInstalled || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-slideIn">
      <div className="bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl shadow-2xl p-4 border-2 border-white/20">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-white/80 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-start gap-3">
          <div className="bg-white/20 rounded-lg p-2 shrink-0">
            <Download className="h-6 w-6" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg mb-1">ثبّت التطبيق</h3>
            <p className="text-sm text-white/90 mb-3">
              احصل على تجربة أفضل! ثبّت التطبيق للوصول السريع وإمكانية العمل بدون إنترنت
            </p>
            
            <div className="flex gap-2">
              <Button
                onClick={handleInstall}
                className="bg-white text-primary hover:bg-white/90 flex-1"
                size="sm"
              >
                <Download className="h-4 w-4 ml-2" />
                تثبيت
              </Button>
              <Button
                onClick={handleDismiss}
                variant="ghost"
                className="text-white hover:bg-white/10"
                size="sm"
              >
                لاحقاً
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-white/20 flex items-center gap-2 text-xs text-white/80">
          <span>✓</span>
          <span>عمل بدون إنترنت</span>
          <span>•</span>
          <span>✓</span>
          <span>وصول سريع</span>
          <span>•</span>
          <span>✓</span>
          <span>تحديثات تلقائية</span>
        </div>
      </div>
    </div>
  );
};

export default InstallPWA;
