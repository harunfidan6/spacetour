'use client';

import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';

/** next/image that fades in once decoded instead of popping into an empty box. */
export function DocImage({ className = '', onLoad, alt, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);
  return (
    <Image
      {...props}
      alt={alt}
      data-loaded={loaded ? '' : undefined}
      className={`doc-img ${className}`}
      onLoad={(e) => {
        setLoaded(true);
        onLoad?.(e);
      }}
    />
  );
}
