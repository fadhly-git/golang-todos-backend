"use client";
import { useState } from 'react';
import type { CardType, ColumnType } from '@/types';
import { Card } from '@/components/todos/card';
import { DropIndicator } from '@/components/todos/drop-indicator';
import { AddCard } from '@/components/todos/add-card';
import api from '@/lib/axios';
import { toast } from 'sonner';

export const Column = ({
    title,
    headingColor,
    cards,
    column,
    setCards,
    refreshCards,
}: {
    title: string;
    headingColor: string;
    cards: CardType[];
    column: ColumnType;
    setCards: React.Dispatch<React.SetStateAction<CardType[]>>;
    refreshCards: () => Promise<void>;
}) => {
    const [active, setActive] = useState(false);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, card: CardType) => {
        e.dataTransfer.setData('cardId', String(card.id));
        console.log('onDragStart triggered for card:', card);
        console.log('cardId set as string:', String(card.id));
    };

    const handleDragEnd = async (e: React.DragEvent<HTMLDivElement>) => {
        console.log('=== handleDragEnd started ===');
        const cardId = e.dataTransfer.getData('cardId');
        console.log('cardId:', cardId, 'type:', typeof cardId);
        console.log('target column:', column);

        setActive(false);
        clearHighlights();

        const indicators = getIndicators();
        console.log('indicators found:', indicators.length);
        const { element } = getNearestIndicator(e, indicators);
        console.log('nearest indicator element:', element);
        console.log('element dataset:', element.dataset);

        const before = element.dataset.before || '-1';
        console.log('before:', before, 'type:', typeof before);
        console.log('cardId comparison:', before !== cardId);

        if (before !== cardId) {
            console.log('Moving card...');
            let copy = [...cards];
            console.log('original cards:', copy);
            console.log('cardId to find:', cardId, 'type:', typeof cardId);
            console.log('cards ids:', copy.map(c => ({ id: c.id, type: typeof c.id })));

            let cardToTransfer = copy.find((c) => String(c.id) === String(cardId));
            console.log('cardToTransfer found:', cardToTransfer);
            if (!cardToTransfer) {
                console.log('Card not found, returning');
                return;
            }
            cardToTransfer = { ...cardToTransfer, column };
            console.log('cardToTransfer updated:', cardToTransfer);

            copy = copy.filter((c) => String(c.id) !== String(cardId));
            console.log('copy after filtering:', copy);

            const moveToBack = before === '-1';
            console.log('moveToBack:', moveToBack);

            if (moveToBack) {
                copy.push(cardToTransfer);
            } else {
                const insertAtIndex = copy.findIndex((el) => String(el.id) === String(before));
                console.log('insertAtIndex:', insertAtIndex);
                if (insertAtIndex === -1) {
                    console.log('Insert index not found, returning');
                    return;
                }

                copy.splice(insertAtIndex, 0, cardToTransfer);
            }

            console.log('final copy before setCards:', copy);
            setCards(copy);

            // Call API to update task status
            try {
                const response = await api.patch(`/api/tasks/${cardId}/status`, { status: parseInt(column) });
                console.log('API response:', response.data);

                // Refresh data from backend to ensure sync
                await refreshCards();

                toast.success('Task moved successfully!');
            } catch (error) {
                console.error('Failed to update task status:', error);
            }
        } else {
            console.log('Card not moved (before === cardId)');
        }

        console.log('=== handleDragEnd finished ===');
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        highlightIndicator(e);

        setActive(true);
        console.log('handleDragOver triggered for column:', column);
    };

    const clearHighlights = (els?: HTMLElement[]) => {
        const indicators = els || getIndicators();

        indicators.forEach((i) => {
            i.style.opacity = '0';
        });
    };

    const highlightIndicator = (e: React.DragEvent<HTMLDivElement>) => {
        const indicators = getIndicators();

        clearHighlights(indicators);

        const el = getNearestIndicator(e, indicators);

        el.element.style.opacity = '1';
    };

    const getNearestIndicator = (e: React.DragEvent<HTMLDivElement>, indicators: HTMLElement[]): { offset: number; element: HTMLElement } => {
        const DISTANCE_OFFSET = 50;

        return indicators.reduce(
            (closest, child) => {
                const box = child.getBoundingClientRect();

                const offset = e.clientY - (box.top + DISTANCE_OFFSET);

                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            },
            {
                offset: Number.NEGATIVE_INFINITY,
                element: indicators[indicators.length - 1],
            },
        );
    };

    const getIndicators = (): HTMLElement[] => {
        return Array.from(document.querySelectorAll(`[data-column="${column}"]`));
    };

    const handleDragLeave = () => {
        clearHighlights();
        setActive(false);
    };

    const filteredCards = cards.filter((c) => c.column === column);

    return (
        <div className="w-56 shrink-0">
            <div className="mb-3 flex items-center justify-between">
                <h3 className={`font-medium ${headingColor}`}>{title}</h3>
                <span className="rounded text-sm text-neutral-400">{filteredCards.length}</span>
            </div>
            <div
                onDrop={handleDragEnd}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`h-full w-full transition-colors ${active ? 'bg-neutral-800/50' : 'bg-neutral-800/0'}`}
            >
                {filteredCards.map((c) => (
                    <Card key={c.id} {...c} handleDragStart={handleDragStart} setCards={setCards} />
                ))}
                <DropIndicator beforeId={null} column={column} />
                <AddCard column={column} setCards={setCards} refreshCards={refreshCards} />
            </div>
        </div>
    );
};
