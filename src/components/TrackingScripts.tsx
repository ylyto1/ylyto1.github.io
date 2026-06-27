import { useEffect } from "react";
import { trackingStore } from "@/lib/storage";

/**
 * Injects Meta Pixel + Google Analytics scripts if configured in localStorage.
 * Replaceable with a server-side config later.
 */
export function TrackingScripts() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const { metaPixelId, gaId } = trackingStore.get();

    if (metaPixelId && !document.getElementById("ylyto-meta-pixel")) {
      const s = document.createElement("script");
      s.id = "ylyto-meta-pixel";
      s.innerHTML = `
        !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
        n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
        document,'script','https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${metaPixelId}'); fbq('track', 'PageView');
      `;
      document.head.appendChild(s);
    }

    if (gaId && !document.getElementById("ylyto-ga")) {
      const s = document.createElement("script");
      s.id = "ylyto-ga";
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(s);
      const inline = document.createElement("script");
      inline.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${gaId}');
      `;
      document.head.appendChild(inline);
    }
  }, []);

  return null;
}
