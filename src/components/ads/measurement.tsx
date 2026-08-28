"use client";

import Script from "next/script";
import { configuredProviders } from "@/lib/analytics/providers";
import { useConsent } from "@/components/consent/use-consent";

/**
 * Third-party measurement and advertising tags.
 *
 * Renders NOTHING until the matching consent is granted. This is a deliberate
 * design choice over the common "load with consent mode denied" pattern: a
 * loaded tag still makes a request, and a request still tells the third party
 * that this visitor was here. Declining should mean the script is never asked
 * for, and here it is not.
 *
 * All tags use `strategy="afterInteractive"` — they are never on the critical
 * path, so a slow ad server cannot delay first paint or hydration.
 */
export function Measurement() {
  const { state } = useConsent();

  // No decision yet, or an explicit refusal: nothing is requested.
  if (!state) return null;

  const allowed = configuredProviders().filter((p) =>
    p.requires === "analytics" ? state.analytics : state.advertising,
  );
  if (allowed.length === 0) return null;

  const ga4 = allowed.find((p) => p.id === "ga4");
  const gam = allowed.find((p) => p.id === "gam");
  const adsense = allowed.find((p) => p.id === "adsense");
  const comscore = allowed.find((p) => p.id === "comscore");

  return (
    <>
      {ga4 ? (
        <>
          <Script
            id="ga4-src"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4.account}`}
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('consent', 'default', {
                ad_storage: '${state.advertising ? "granted" : "denied"}',
                ad_user_data: '${state.advertising ? "granted" : "denied"}',
                ad_personalization: '${state.advertising ? "granted" : "denied"}',
                analytics_storage: '${state.analytics ? "granted" : "denied"}'
              });
              gtag('config', '${ga4.account}', { anonymize_ip: true });
            `}
          </Script>
        </>
      ) : null}

      {gam ? (
        <Script
          id="gam-src"
          strategy="afterInteractive"
          src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"
        />
      ) : null}

      {adsense ? (
        <Script
          id="adsense-src"
          strategy="afterInteractive"
          crossOrigin="anonymous"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsense.account}`}
        />
      ) : null}

      {comscore ? (
        <>
          <Script id="comscore-init" strategy="afterInteractive">
            {`
              var _comscore = _comscore || [];
              _comscore.push({ c1: "2", c2: "${comscore.account}", cs_ucfr: "1" });
            `}
          </Script>
          <Script
            id="comscore-src"
            strategy="afterInteractive"
            src={`https://sb.scorecardresearch.com/cs/${comscore.account}/beacon.js`}
          />
        </>
      ) : null}
    </>
  );
}
