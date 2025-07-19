import { ColumnType } from '@/types';

export const DropIndicator = ({ beforeId, column }: { beforeId: string | null; column: ColumnType }) => {
    return <div data-before={beforeId || '-1'} data-column={column} className="my-0.5 h-0.5 w-full bg-violet-400 opacity-0" />;
};
