/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { cn } from "@/lib/utils"
import { registerFormSchema } from "@/lib/validation-schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import React from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
import { Card, CardContent } from "./ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { PasswordInput } from "./password-input"
import { Button } from "./ui/button"
import Image from "next/image"
import { MailIcon, User } from "lucide-react"
import api from "@/lib/axios"
import { useRouter } from "next/navigation"

const formSchema = registerFormSchema

export function RegisterForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        }
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Handle form submission logic here
        try {
            const res = await api.post("/auth/register", values);
            toast.success("Registration successful!")
            form.reset();
            router.push("/auth/login");
        } catch (error: any) {
            if (error.response) {
                // ✅ Ada response dari server (misalnya: 400, 409, 422)
                const serverMessage = error.response.data?.message || "Terjadi kesalahan saat registrasi"

                // Misalnya duplikat username/email (dari backend Go)
                if (error.response.status === 409) {
                    toast.error("Username atau email sudah digunakan")
                    form.setError("root", {
                        type: "manual",
                        message: "Username atau email sudah digunakan"
                    })
                } else {
                    toast.error(serverMessage)
                    form.setError("root", {
                        type: "manual",
                        message: serverMessage
                    })
                }
            } else if (error.request) {
                // ❌ Request terkirim tapi tidak ada response
                toast.error("Server tidak merespons. Coba beberapa saat lagi.")
            } else {
                // ❌ Error lainnya
                toast.error("Terjadi kesalahan: " + error.message)
            }
        }
    }
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col items-center text-center">
                                    <h1 className="text-2xl font-bold">Create an account</h1>
                                    <p className="text-muted-foreground text-balance">
                                        Join us to manage your tasks efficiently.
                                    </p>
                                </div>
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem className="grid gap-3">
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <div className="relative flex items-center rounded-md border focus-within:ring-1 focus-within:ring-ring pl-2">
                                                    <User className="h-5 w-5 text-muted-foreground" />
                                                    <Input
                                                        placeholder="Enter your username"
                                                        className="border-0 focus-visible:ring-0 shadow-none"
                                                        autoComplete="username"
                                                        type="text"
                                                        {...field}
                                                    />
                                                </div>

                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <div className="relative flex items-center rounded-md border focus-within:ring-1 focus-within:ring-ring pl-2">
                                                    <MailIcon className="h-5 w-5 text-muted-foreground" />
                                                    <Input
                                                        type="email"
                                                        placeholder="Email"
                                                        className="border-0 focus-visible:ring-0 shadow-none"
                                                        autoComplete="email"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <PasswordInput
                                                    placeholder="Enter your password"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirm Password</FormLabel>
                                            <FormControl>
                                                <PasswordInput
                                                    placeholder="Confirm your password"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full">
                                    Register
                                </Button>
                                {form.formState.errors.root && (
                                    <div className="text-red-500 text-sm text-center mt-2">
                                        {form.formState.errors.root.message}
                                    </div>
                                )}
                            </div>
                        </form>
                    </Form>
                    <div className="bg-muted relative hidden md:block">
                        <Image
                            fill
                            priority={false}
                            sizes="(min-width: 768px) 50vw, 100vw"
                            src="/placeholder.svg"
                            alt="Image"
                            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}