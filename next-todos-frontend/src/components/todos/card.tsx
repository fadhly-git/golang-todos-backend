import { motion } from 'framer-motion';
import { DropIndicator } from '@/components/todos/drop-indicator';
import type { CardType, ColumnType } from '@/types';
import React from 'react';

export const Card = ({
    title,
    description,
    id,
    column,
    handleDragStart,
    setCards,
}: {
    title: string;
    description: string;
    id: string;
    column: ColumnType;
    handleDragStart: (e: React.DragEvent<HTMLDivElement>, card: CardType) => void;
    setCards: React.Dispatch<React.SetStateAction<CardType[]>>;
}) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const [currentTitle, setCurrentTitle] = React.useState(title);
    const [currentDescription, setCurrentDescription] = React.useState(description);

    const handleDoubleClick = () => {
        setIsEditing(true);
    }

    const handleBlur = () => {
        setIsEditing(false);
        if (currentTitle.trim() !== title || currentDescription.trim() !== description) {
            setCards((prevCards) =>
                prevCards.map((card) =>
                    card.id === id
                        ? { ...card, title: currentTitle.trim(), description: currentDescription.trim() }
                        : card
                )
            );
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleBlur();
        }
    };

    return (
        <>
            <DropIndicator beforeId={id} column={column} />
            <motion.div
                layout
                layoutId={id}
                draggable="true"
                onDragStart={(e) => {
                    const dragEvent = e as unknown as React.DragEvent<HTMLDivElement>;
                    handleDragStart(dragEvent, { title, description, id, column });
                }}
                className="cursor-grab rounded border border-neutral-700 bg-neutral-800 p-3 active:cursor-grabbing h-fit line-clamp-none text-balance"
            >
                {isEditing ? (
                    <div className="space-y-2">
                        <textarea
                            value={currentTitle}
                            onChange={(e) => setCurrentTitle(e.target.value)}
                            onBlur={handleBlur}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            placeholder="Task title..."
                            className="w-full rounded border border-violet-400 bg-violet-400/20 p-2 text-sm text-neutral-50 placeholder-violet-300 focus:outline-0"
                            rows={1}
                        />
                        <textarea
                            value={currentDescription}
                            onChange={(e) => setCurrentDescription(e.target.value)}
                            onBlur={handleBlur}
                            onKeyDown={handleKeyDown}
                            placeholder="Task description..."
                            className="w-full rounded border border-violet-400 bg-violet-400/20 p-2 text-sm text-neutral-50 placeholder-violet-300 focus:outline-0"
                            rows={2}
                        />
                    </div>
                ) : (
                    <div className="space-y-2" onDoubleClick={handleDoubleClick}>
                        <p className="text-sm font-medium text-neutral-100">{title}</p>
                        {description && (
                            <p className="text-xs text-neutral-300 opacity-75">{description}</p>
                        )}
                    </div>
                )}
            </motion.div>
        </>
    );
};
