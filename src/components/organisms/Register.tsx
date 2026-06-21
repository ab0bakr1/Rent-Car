"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import Text from "../atoms/Text";
import Title from "../atoms/Title";
import Button from "../atoms/Button";

export default function Register() {
    const router = useRouter();
    
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [agreed, setAgreed] = useState(false);
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        
        if (!agreed) {
            setError("You must agree to the Terms & Conditions.");
            return;
        }

        try {
            setIsLoading(true);
            const response = await apiClient.post("/auth/register", {
                firstName,
                lastName,
                email,
                password,
            });
            
            setSuccess(true);
            setTimeout(() => {
                router.push("/Login");
            }, 2000);
        } catch (err: any) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(Array.isArray(err.response.data.message) 
                    ? err.response.data.message.join(", ") 
                    : err.response.data.message);
            } else {
                setError("An error occurred during registration.");
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
                           Create an account
                        </Title>
                        <Text variant="secondary" size="md" center={true}>
                            Start your journey with us today.
                        </Text>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-sm">
                            Registration successful! Redirecting to login...
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleRegister}>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm ds-text-secondary mb-2">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder="First Name"
                                    required
                                    className="w-full h-14 ds-rounded-xl ds-bg ds-border-sm px-5 ds-text-primary outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm ds-text-secondary mb-2">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder="Last Name"
                                    required
                                    className="w-full h-14 ds-rounded-xl ds-bg ds-border-sm px-5 ds-text-primary outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </div>
                        </div>

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
                            <p className="text-xs ds-text-secondary mt-2 ml-1">
                                Must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 text-sm ds-text-primary">
                            <input 
                                type="checkbox" 
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                className="w-4 h-4 rounded" 
                            />
                            <Text size="sm" variant="secondary" className="pt-0">
                                I agree to the Terms & Conditions
                            </Text>
                        </div>

                        <Button
                            type="submit"
                            loading={isLoading}
                            fullWidth
                            variant="primary"
                            size="lg"
                        >
                            Create Account
                        </Button>

                        <div className="relative flex items-center justify-center py-2">
                            <div className="absolute w-full h-px ds-bg"></div>
                            <Text size="sm" variant="secondary" className="relative ds-bg-alt px-5 pt-0">
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
                            Already have an account?{" "}
                            <a href="/Login" className="text-blue-500 cursor-pointer hover:underline">
                                Login
                            </a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}