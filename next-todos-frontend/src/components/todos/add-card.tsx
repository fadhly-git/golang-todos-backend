"use client";
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import type { CardType, ColumnType } from '@/types';

const addCardSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    column: z.string(),
});

type AddCardForm = z.infer<typeof addCardSchema>;

export const AddCard = ({ column, setCards }: { column: ColumnType; setCards: React.Dispatch<React.SetStateAction<CardType[]>> }) => {
    const [adding, setAdding] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<AddCardForm>({
        resolver: zodResolver(addCardSchema),
        defaultValues: {
            title: '',
            description: '',
            column: String(column),
        },
    });

    const onSubmit = async (data: AddCardForm) => {
        setIsSubmitting(true);
        console.log('Submitting data:', data);
        try {
            // Prepare data dengan structure yang sesuai dengan backend
            const taskData = {
                title: data.title,
                description: data.description,
                // column akan di-set otomatis berdasarkan kolom tempat task dibuat
            };

            // Replace with your actual API endpoint
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskData),
            });

            if (!response.ok) {
                throw new Error('Failed to create task');
            }

            const newCard = await response.json();
            // Tambahkan column ke newCard jika backend tidak mengembalikannya
            const cardWithColumn = {
                ...newCard,
                column: String(column),
                id: newCard.id || Date.now().toString(), // fallback ID jika backend tidak memberikan
            };

            setCards(prev => [...prev, cardWithColumn]);
            reset();
            setAdding(false);
            toast.success('Task added successfully!');
        } catch (error) {
            console.error('Error creating task:', error);
            toast.error('Failed to create task. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {adding ? (
                <motion.form layout onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-3">
                        <textarea
                            {...register('title')}
                            autoFocus
                            placeholder="Task title..."
                            className="w-full rounded border border-violet-400 bg-violet-400/20 p-3 text-sm text-foreground placeholder-violet-300 focus:outline-0"
                            rows={1}
                        />
                        {errors.title && (
                            <p className="text-xs text-red-400">{errors.title.message}</p>
                        )}

                        <textarea
                            {...register('description')}
                            placeholder="Task description..."
                            className="w-full rounded border border-violet-400 bg-violet-400/20 p-3 text-sm text-foreground placeholder-violet-300 focus:outline-0"
                            rows={2}
                        />
                        {errors.description && (
                            <p className="text-xs text-red-400">{errors.description.message}</p>
                        )}
                    </div>

                    <div className="mt-3 flex items-center justify-end gap-1.5">
                        <button
                            onClick={() => {
                                setAdding(false);
                                reset();
                            }}
                            className="px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
                            type="button"
                            disabled={isSubmitting}
                        >
                            Close
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-1.5 rounded bg-primary px-3 py-1.5 text-xs text-background transition-colors hover:bg-neutral-300"
                            disabled={isSubmitting}
                        >
                            <span>{isSubmitting ? 'Adding...' : 'Add'}</span>
                            <Plus />
                        </button>
                    </div>
                </motion.form>
            ) : (
                <motion.button
                    layout
                    onClick={() => setAdding(true)}
                    className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs text-foreground transition-colors hover:text-neutral-50"
                >
                    <span>Add card</span>
                    <Plus />
                </motion.button>
            )}
        </>
    );
};
