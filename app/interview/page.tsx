'use client';

import Interview from '@/components/interview';
import { StreamingAvatarProvider } from '@/components/logic';
import React from 'react';

export default function page() {
  return (
    <div>
      <StreamingAvatarProvider basePath={process.env.NEXT_PUBLIC_BASE_API_URL}>
        <Interview />
      </StreamingAvatarProvider>
    </div>
  );
}
