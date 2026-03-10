import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  jsonLd?: object | object[];
}

export function SEOHead({ title, description, canonical, ogImage = "https://iescolas.com.br/og-image.png", jsonLd }: SEOHeadProps) {
  useEffect(() => {
    const prev = document.title;
    document.title = title;

    const setMeta = (name: string, content: string, attr = "name") => {
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
      return el;
    };

    const metas = [
      setMeta("description", description),
      setMeta("og:title", title, "property"),
      setMeta("og:description", description, "property"),
      setMeta("og:url", canonical, "property"),
      setMeta("og:image", ogImage, "property"),
      setMeta("og:type", "website", "property"),
      setMeta("twitter:title", title, "name"),
      setMeta("twitter:description", description, "name"),
    ];

    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    const createdLink = !link;
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", canonical);

    let script: HTMLScriptElement | null = null;
    if (jsonLd) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(Array.isArray(jsonLd) ? jsonLd : [jsonLd]);
      document.head.appendChild(script);
    }

    return () => {
      document.title = prev;
      if (script) script.remove();
      if (createdLink && link) link.remove();
    };
  }, [title, description, canonical, ogImage, jsonLd]);

  return null;
}
