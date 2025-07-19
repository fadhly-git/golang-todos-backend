
// Example validation schema, replace with your actual schema
import * as z from "zod";

export const registerFormSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long"),
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().min(6, "Confirm Password must be at least 6 characters long"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // error muncul di field confirmPassword
});


export const loginFormSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});