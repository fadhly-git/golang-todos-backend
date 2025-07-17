import { EyeIcon, EyeOffIcon, LockIcon } from "lucide-react";
import { Input, type InputProps } from '@/components/ui/input'
import React, { useState } from "react";
import { Button } from "./ui/button";

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const disabled = props.value === '' || props.value === undefined || props.disabled;
    return (
        <div className="relative flex items-center rounded-md border focus-within:ring-1 focus-within:ring-ring px-2">
            <LockIcon className="h-5 w-5 text-muted-foreground" />
            <Input
                ref={ref}
                type={showPassword ? "text" : "password"}
                className={`border-0 focus-visible:ring-0 shadow-none ${className}`}
                {...props}
            />
            <Button
                type="button"
                variant={"ghost"}
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={disabled}
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            >
                {showPassword && !disabled ? (
                    <EyeOffIcon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                ) : (
                    <EyeIcon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                )}
            </Button>
        </div>
    )
});
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };