import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Loads Meta Pixel + Google Analytics IDs from the cloud (tracking_config table)
 * and injects the scripts. Visible to all visitors (RLS allows public SELECT).
 */
export function TrackingScripts() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    let cancelled = false;

    (async () => {
      const { data } = await supabase
        .from("tracking_config")
        .select("meta_pixel_id, ga_id")
        .eq("id", true)
        .maybeSingle();

      if (cancelled || !data) return;
      const metaPixelId = (data.meta_pixel_id ?? "").trim();
      const gaId = (data.ga_id ?? "").trim();

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

        const noscript = document.createElement("noscript");
        noscript.id = "ylyto-meta-pixel-ns";
        noscript.innerHTML = `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1" />`;
        document.head.appendChild(noscript);
      }

      if (gaId && !document.getElementById("ylyto-ga")) {
        const s = document.createElement("script");
        s.id = "ylyto-ga";
        s.async = true;
        s.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        document.head.appendChild(s);
        const inline = document.createElement("script");
        inline.id = "ylyto-ga-inline";
        inline.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `;
        document.head.appendChild(inline);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
