"use client";

import Script from "next/script";
import { useRef } from "react";
import { META_PIXEL_ID } from "@/lib/meta-config";
import { trackMetaEvent } from "@/lib/meta";

export default function MetaPixel() {
  const pageViewTracked = useRef(false);
  const pixelId = META_PIXEL_ID.replace(/\D/g, "");

  if (!pixelId) return null;

  const trackPageView = () => {
    if (pageViewTracked.current) return;
    pageViewTracked.current = true;
    trackMetaEvent("PageView");
  };

  return (
    <Script id="meta-pixel" strategy="afterInteractive" onReady={trackPageView}>
      {`
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;
        s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
        (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${pixelId}');
      `}
    </Script>
  );
}
