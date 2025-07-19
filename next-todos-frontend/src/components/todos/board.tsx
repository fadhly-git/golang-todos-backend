"use client";
import { useState } from 'react';
import type { CardType } from '@/types';
import { Column } from '@/components/todos/column';
import { BurnBarrel } from '@/components/todos/burn-barrel';

export const Board = () => {
    const [cards, setCards] = useState<CardType[]>([]);

    return (
        <div className="flex h-full w-full gap-3">
            <Column title="Backlog" column="1" headingColor="text-neutral-500" cards={cards} setCards={setCards} />
            <Column title="TODO" column="2" headingColor="text-yellow-200" cards={cards} setCards={setCards} />
            <Column title="In progress" column="3" headingColor="text-blue-200" cards={cards} setCards={setCards} />
            <Column title="Complete" column="4" headingColor="text-emerald-200" cards={cards} setCards={setCards} />
            <BurnBarrel setCards={setCards} />
        </div>
    );
};
