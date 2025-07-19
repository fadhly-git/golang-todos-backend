"use client";
import { useState, useEffect } from 'react';
import type { CardType } from '@/types';
import { Column } from '@/components/todos/column';
import { BurnBarrel } from '@/components/todos/burn-barrel';
import api from '@/lib/axios';

export const Board = () => {
    const [cards, setCards] = useState<CardType[]>([]);

    const fetchCards = async () => {
        try {
            const response = await api.get('/api/tasks');
            const mappedCards = response.data.map((task: { ID: string; Title: string; Description: string; Status: number; CreatedAt: string; updated_at: string; }) => ({
                id: task.ID,
                title: task.Title,
                description: task.Description,
                column: String(task.Status),
                createdAt: task.CreatedAt,
                updatedAt: task.updated_at,
            }));
            setCards(mappedCards);
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
        }
    };

    useEffect(() => {
        fetchCards();
    }, []);

    return (
        <div className="flex h-full w-full gap-3">
            <Column title="Backlog" column="1" headingColor="text-neutral-500" cards={cards} setCards={setCards} refreshCards={fetchCards} />
            <Column title="TODO" column="2" headingColor="text-yellow-200" cards={cards} setCards={setCards} refreshCards={fetchCards} />
            <Column title="In progress" column="3" headingColor="text-blue-200" cards={cards} setCards={setCards} refreshCards={fetchCards} />
            <Column title="Complete" column="4" headingColor="text-emerald-200" cards={cards} setCards={setCards} refreshCards={fetchCards} />
            <BurnBarrel setCards={setCards} refreshCards={fetchCards} />
        </div>
    );
};
