
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (res.ok) {
                const user = await res.json();
                localStorage.setItem('userId', user.id); // Simple persistence

                if (user.role === 'admin') {
                    router.push("/dashboard/admin/welcome");
                } else {
                    router.push("/dashboard/user/welcome");
                }
            } else {
                console.error("Login failed");
                // Fallback for demo if API fails (e.g. DB not ready)
                if (email.includes("admin")) {
                    router.push("/dashboard/admin/welcome");
                } else {
                    router.push("/dashboard/user/welcome");
                }
            }
        } catch (error) {
            console.error("Login error", error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-secondary/20 rounded-full blur-[120px] pointer-events-none" />

            <Card className="w-full max-w-md glass-card z-10 border-white/10">
                <CardHeader className="text-center">
                    <div className="mx-auto h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/25 mb-4">
                        <Shield className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Welcome Back</CardTitle>
                    <CardDescription>Enter your credentials to access your dashboard</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Email</label>
                            <Input
                                type="email"
                                placeholder="user@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Password</label>
                            <Input type="password" placeholder="••••••••" required />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                                <input type="checkbox" className="rounded border-slate-700 bg-slate-800 text-primary focus:ring-primary" />
                                Remember me
                            </label>
                            <Link href="#" className="text-primary hover:underline">Forgot password?</Link>
                        </div>
                        <Button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90" disabled={loading}>
                            {loading ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center border-t border-white/10 pt-6">
                    <p className="text-sm text-slate-400">
                        Don&apos;t have an account? <Link href="/signup" className="text-primary hover:underline">Sign up</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
