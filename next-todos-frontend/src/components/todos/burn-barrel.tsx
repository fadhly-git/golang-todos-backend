"use client";
import { Flame, Trash } from 'lucide-react';
import { useState } from 'react';
import type { CardType } from '@/types';

export const BurnBarrel = ({ setCards }: { setCards: React.Dispatch<React.SetStateAction<CardType[]>> }) => {
    const [active, setActive] = useState(false);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setActive(true);
    };

    const handleDragLeave = () => {
        setActive(false);
    };

    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        const cardId = e.dataTransfer.getData('cardId');

        setCards((pv) => pv.filter((c) => c.id !== cardId));

        setActive(false);
    };

    return (
        <div
            onDrop={handleDragEnd}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`mt-10 grid h-56 w-56 shrink-0 place-content-center rounded border text-3xl ${active ? 'border-red-800 bg-red-800/20 text-red-500' : 'border-neutral-500 bg-neutral-500/20 text-neutral-500'
                }`}
        >
            {active ? <Flame className="animate-bounce" /> : <Trash />}
        </div>
    );
};
