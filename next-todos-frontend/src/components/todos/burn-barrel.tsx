"use client";
import { Flame, Trash } from 'lucide-react';
import { useState } from 'react';
import type { CardType } from '@/types';
import api from '@/lib/axios';
import { toast } from 'sonner';

export const BurnBarrel = ({
    setCards,
    refreshCards
}: {
    setCards: React.Dispatch<React.SetStateAction<CardType[]>>;
    refreshCards: () => Promise<void>;
}) => {
    const [active, setActive] = useState(false);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setActive(true);
    };

    const handleDragLeave = () => {
        setActive(false);
    };

    const handleDragEnd = async (e: React.DragEvent<HTMLDivElement>) => {
        const cardId = e.dataTransfer.getData('cardId');

        // Optimistically remove from UI first
        setCards((pv) => pv.filter((c) => String(c.id) !== String(cardId)));

        try {
            // Call API to delete task
            await api.delete(`/api/tasks/${cardId}`);

            // Refresh data from backend to ensure sync
            await refreshCards();

            toast.success('Task deleted successfully!');
        } catch (error) {
            console.error('Failed to delete task:', error);
            toast.error('Failed to delete task. Please try again.');

            // Refresh data to restore if delete failed
            await refreshCards();
        }

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
