'use client';

import { useEffect, useState } from 'react';

export default function HomePage() {
  const [platform, setPlatform] = useState<string>('loading...');

  useEffect(() => {
    const detected = window.electron?.platform ?? 'browser';
    setPlatform(detected);
  }, []);

  return (
    <main className="container">
      <h1>Pro Project Manager</h1>
      <p>Electron + Next.js scaffold is ready.</p>
      <section>
        <h2>Runtime</h2>
        <p>Running on: {platform}</p>
      </section>
    </main>
  );
}
