"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import Text from "../atoms/Text";
import Title from "../atoms/Title";
import Button from "../atoms/Button";

export default function Login() {
    const router = useRouter();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        
        try {
            setIsLoading(true);
            const response = await apiClient.post("/auth/login", {
                email,
                password,
            });
            
            if (response.data && response.data.data) {
                localStorage.setItem("user", JSON.stringify(response.data.data.user));
                localStorage.setItem("accessToken", response.data.data.accessToken);
            }
            
            setSuccess(true);
            setTimeout(() => {
                router.push("/"); 
            }, 1000);
        } catch (err: any) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(Array.isArray(err.response.data.message) 
                    ? err.response.data.message.join(", ") 
                    : err.response.data.message);
            } else {
                setError("Invalid email or password.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen ds-bg flex items-center justify-center px-4 pt-40 pb-10">
            <div className="w-full max-w-xl grid ds-rounded-3xl overflow-hidden ds-shadow-lg border ds-border-sm ds-bg-alt">
                <div className="p-8 md:p-12">
                    <div className="mb-8">
                        <Title variant="primary" size="xl" className="mb-2" center={true}>
                           Welcome Back
                        </Title>
                        <Text variant="secondary" size="md" center={true}>
                            Please enter your details to sign in.
                        </Text>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-sm">
                            Login successful! Redirecting...
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label className="block text-sm ds-text-secondary mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="example@email.com"
                                required
                                className="w-full h-14 ds-rounded-xl ds-bg ds-border-sm px-5 ds-text-primary outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm ds-text-secondary mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full h-14 ds-rounded-xl ds-bg ds-border-sm px-5 ds-text-primary outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                            <div className="flex justify-end mt-2">
                                <Link href="/ForgotPassword" className="ds-text-sm text-blue-500 hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            loading={isLoading}
                            fullWidth
                            variant="primary"
                            size="lg"
                        >
                            Sign In
                        </Button>

                        <div className="relative flex items-center justify-center py-2">
                            <div className="absolute w-full h-px ds-bg"></div>
                            <Text size="sm" variant="secondary" className="relative ds-bg-alt px-5">
                                OR
                            </Text>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                type="button"
                                variant="secondary"
                                fullWidth
                                className="ds-bg ds-text-primary ds-border-sm hover:opacity-80"
                            >
                                Google
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                fullWidth
                                className="ds-bg ds-text-primary ds-border-sm hover:opacity-80"
                            >
                                GitHub
                            </Button>
                        </div>

                        <p className="text-center ds-text-secondary pt-4">
                            Don't have an account?{" "}
                            <Link href="/Register" className="text-blue-500 cursor-pointer hover:underline">
                                Sign up
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}