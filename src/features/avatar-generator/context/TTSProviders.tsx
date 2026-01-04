'use client';

import React from 'react';
import { KokoroProvider } from './KokoroContext';
import { ChatterboxProvider } from './ChatterboxContext';

export const TTSProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <ChatterboxProvider>
            <KokoroProvider>
                {children}
            </KokoroProvider>
        </ChatterboxProvider>
    );
};
