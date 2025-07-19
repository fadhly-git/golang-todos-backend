import { AppLayout } from "@/layouts/app-layout"
import { Board } from "@/components/todos/board"

const breadcrumbs = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "To Do List", href: "/dashboard/todo-list" },
]

export default function ToDoListPage() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="bg-muted flex flex-col items-center justify-center p-6 md:p-10">
                <div className="w-full">
                    <h1 className="text-2xl font-bold mb-4">todo</h1>
                    <p className="text-muted-foreground mb-6">Welcome to your todo!</p>
                    <Board />
                </div>
            </div>
        </AppLayout>
    )
}   