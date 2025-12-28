import React, { useState, useRef, useEffect } from 'react';
import { Zap, Mic2, ChevronDown } from 'lucide-react';

interface EngineSelectorProps {
    activeEngine: 'kokoro' | 'chatterbox';
    onEngineChange: (engine: 'kokoro' | 'chatterbox') => void;
    className?: string;
}

export const EngineSelector: React.FC<EngineSelectorProps> = ({ activeEngine, onEngineChange, className = "" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const options = [
        {
            id: 'kokoro',
            label: 'Kokoro',
            icon: Zap,
            badge: 'Fast',
            badgeColor: 'bg-indigo-50 text-indigo-600'
        },
        {
            id: 'chatterbox',
            label: 'Chatterbox',
            icon: Mic2,
            badge: 'Pro',
            badgeColor: 'bg-blue-50 text-blue-600'
        }
    ] as const;

    const selectedOption = options.find(opt => opt.id === activeEngine) || options[0];

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-all text-sm font-medium text-gray-700"
            >
                <selectedOption.icon className="w-4 h-4 text-gray-500" />
                <span>{selectedOption.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${selectedOption.badgeColor}`}>
                    {selectedOption.badge}
                </span>
                <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-100 rounded-xl shadow-lg shadow-gray-200/50 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="p-1">
                        {options.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => {
                                    onEngineChange(option.id);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${activeEngine === option.id
                                        ? 'bg-gray-50 text-gray-900'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <option.icon className={`w-4 h-4 ${activeEngine === option.id ? 'text-gray-900' : 'text-gray-400'}`} />
                                <div className="flex-1 text-left flex items-center justify-between">
                                    <span>{option.label}</span>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${option.badgeColor}`}>
                                        {option.badge}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
