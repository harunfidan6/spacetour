'use client';

import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';

/**
 * next/image that fades in once decoded instead of popping into an empty box.
 * Priority (above-the-fold) images skip the fade: they are the page's LCP element and must paint as soon as they arrive.
 */
export function DocImage({ className = '', onLoad, alt, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);
  return (
    <Image
      {...props}
      alt={alt}
      data-loaded={loaded ? '' : undefined}
      data-priority={props.priority ? '' : undefined}
      className={`doc-img ${className}`}
      onLoad={(e) => {
        setLoaded(true);
        onLoad?.(e);
      }}
    />
  );
}
