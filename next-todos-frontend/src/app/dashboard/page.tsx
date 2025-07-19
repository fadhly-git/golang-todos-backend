import { AppLayout } from "@/layouts/app-layout"

const breadcrumbs = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Overview", href: "/dashboard#" },
]

export default function DashboardPage() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="bg-muted flex flex-col items-center justify-center p-6 md:p-10">
                <div className="w-full max-w-sm md:max-w-3xl">
                    <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
                    <p className="text-muted-foreground mb-6">Welcome to your dashboard!</p>
                    {/* Add your dashboard content here */}
                </div>
            </div>
        </AppLayout>
    )
}   