'use client';

import { useEffect, useRef } from 'react';

export default function AdBanner() {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bannerRef.current && bannerRef.current.firstChild) {
      return;
    }

    const confScript = document.createElement('script');
    confScript.type = 'text/javascript';
    confScript.text = `
      atOptions = {
        'key' : '031c64ac7a6131622695ee103b310194',
        'format' : 'iframe',
        'height' : 250,
        'width' : 300,
        'params' : {}
      };
    `;

    const invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    invokeScript.src = 'https://www.highrevenueformat.com/031c64ac7a6131622695ee103b310194/invoke.js';
    invokeScript.async = true;

    if (bannerRef.current) {
      bannerRef.current.appendChild(confScript);
      bannerRef.current.appendChild(invokeScript);
    }
  }, []);

  return (
    <div className="flex justify-center my-4">
      <div ref={bannerRef} />
    </div>
  );
}