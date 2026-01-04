import React from 'react';
import { Trash2 } from 'lucide-react';
import { AvatarTemplate } from '../../types/domain/template';

interface TemplateCardProps {
    template: AvatarTemplate;
    isSelected: boolean;
    onSelect: (template: AvatarTemplate) => void;
    onDelete?: (id: string) => void;
    isOwner?: boolean;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
    template,
    isSelected,
    onSelect,
    onDelete,
    isOwner
}) => {
    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onDelete) {
            onDelete(template.avatar_id);
        }
    };

    return (
        <div
            onClick={() => onSelect(template)}
            className={`group relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${isSelected
                ? 'border-blue-600 ring-2 ring-blue-100'
                : 'border-transparent hover:border-gray-200'
                }`}
        >
            <img
                src={template.image_url}
                alt={template.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                <p className="text-white text-sm font-medium truncate">{template.name}</p>
            </div>

            {isOwner && onDelete && (
                <button
                    onClick={handleDelete}
                    className="absolute top-2 right-2 p-1.5 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete Template"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
            )}
        </div>
    );
};
