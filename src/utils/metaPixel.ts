// Meta (Facebook) Pixel Tracking Utility for Glamora E-Commerce
declare global {
  interface Window {
    fbq?: any;
    _fbq?: any;
  }
}

let currentPixelId = '';

export const initMetaPixel = (pixelId?: string) => {
  if (typeof window === 'undefined' || !pixelId) return;
  const cleanId = String(pixelId).trim();
  if (!cleanId || cleanId === currentPixelId) return;

  if (!window.fbq) {
    const f: any = function () {
      if (f.callMethod) {
        f.callMethod.apply(f, arguments);
      } else {
        f.queue.push(arguments);
      }
    };
    if (!window._fbq) window._fbq = f;
    f.push = f;
    f.loaded = true;
    f.version = '2.0';
    f.queue = [];
    window.fbq = f;

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    const firstScript = document.getElementsByTagName('script')[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    }
  }

  try {
    window.fbq('init', cleanId);
    window.fbq('track', 'PageView');
    currentPixelId = cleanId;
    console.log(`[Meta Pixel] Initialized successfully with Pixel ID: ${cleanId}`);
  } catch (err) {
    console.warn('[Meta Pixel] Init error:', err);
  }
};

export const trackMetaEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.fbq) {
    try {
      if (params) {
        window.fbq('track', eventName, params);
      } else {
        window.fbq('track', eventName);
      }
      console.log(`[Meta Pixel Event: ${eventName}]`, params || {});
    } catch (e) {
      console.warn('[Meta Pixel Track Error]:', e);
    }
  }
};

