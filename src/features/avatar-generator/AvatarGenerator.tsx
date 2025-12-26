'use client';

import React from 'react';
import { CreateAvatarSection } from './sections/CreateAvatarSection';
import { HistorySection } from './sections/HistorySection';
import { useAvatarHistory } from './hooks/useAvatarHistory';
import TopBar from '@/components/layout/TopBar';
import { useAuth } from '@/hooks/useAuth';

export const AvatarGenerator: React.FC = () => {
  const { user } = useAuth();
  const { refresh } = useAvatarHistory(user?.id);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="px-4 mx-auto pb-20">
        <TopBar 
          showSearch={false}
          showUpgrade={true}
          showNotifications={true}
          pageTitle="Avatar Generator"
          pageSubtitle={
            <>
              Create lifelike talking avatars from a single photo <br />
              and audio clip using advanced AI technology.
            </>
          }
        />

        <div className="px-15 mx-auto space-y-10">
          <section>
            <CreateAvatarSection onSuccess={refresh} />
          </section>

          <section>
            <HistorySection />
          </section>
        </div>
      </div>
    </div>
  );
};