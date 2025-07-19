"use client"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { useScrollAreaScroll } from "@/hooks/use-scroll-direction"
import * as ScrollArea from "@radix-ui/react-scroll-area"
import { type BreadcrumbItem as BreadcrumbItemType } from "@/types"

export const iframeHeight = "800px"

export const description = "A sidebar with a header and a search form."

interface Props {
    children: React.ReactNode
    // Tambahkan props untuk data breadcrumb jika diperlukan
    breadcrumbs: BreadcrumbItemType[]
}

export function AppLayout({ children, breadcrumbs }: Props) {
    const { scrollAreaRef } = useScrollAreaScroll();
    return (
        <div className="[--header-height:calc(--spacing(14))] h-screen flex flex-col overflow-hidden">
            <SidebarProvider className="flex flex-col flex-1">
                <SiteHeader breadcrumbs={breadcrumbs} />
                <div className="flex flex-1">
                    <AppSidebar />
                    <SidebarInset className="flex flex-1 overflow-hidden">
                        <div className="h-full">
                            <ScrollArea.Root className="h-screen w-full overflow-hidden" style={{ scrollbarWidth: "none" }}>
                                <ScrollArea.Viewport
                                    ref={scrollAreaRef}
                                    className="h-full w-full"
                                >
                                    <div className="w-full flex-grow p-4 no-scrollbar">
                                        {children}
                                    </div>
                                </ScrollArea.Viewport>
                                <ScrollArea.Scrollbar
                                    orientation="vertical"
                                    className="w-2 bg-gray-200"
                                >
                                    <ScrollArea.Thumb className="bg-primary rounded" />
                                </ScrollArea.Scrollbar>
                            </ScrollArea.Root>
                        </div>
                    </SidebarInset>
                </div>
            </SidebarProvider>
        </div>
    )
}
