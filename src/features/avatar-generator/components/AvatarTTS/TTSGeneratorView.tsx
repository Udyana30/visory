import React from 'react';
import { KokoroGeneratorContainer } from './kokoro/KokoroGeneratorContainer';
import { ChatterboxGeneratorContainer } from './chatterbox/ChatterboxGeneratorContainer';

interface TTSGeneratorViewProps {
    activeEngine: 'kokoro' | 'chatterbox';
    onComplete: (file: File) => void;
    onClose: () => void;
    onOpenLibrary: () => void;
    onOpenKokoroLibrary: () => void;
}

export const TTSGeneratorView: React.FC<TTSGeneratorViewProps> = ({
    activeEngine,
    onComplete,
    onClose,
    onOpenLibrary,
    onOpenKokoroLibrary
}) => {
    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 flex flex-col min-h-0 bg-gray-50/50">
                {activeEngine === 'kokoro' ? (
                    <KokoroGeneratorContainer
                        onComplete={onComplete}
                        onClose={onClose}
                        onOpenLibrary={onOpenKokoroLibrary}
                    />
                ) : ( 
                    <ChatterboxGeneratorContainer
                        onComplete={onComplete}
                        onClose={onClose}
                        onOpenLibrary={onOpenLibrary}
                    />
                )}
            </div>
        </div>
    );
};
