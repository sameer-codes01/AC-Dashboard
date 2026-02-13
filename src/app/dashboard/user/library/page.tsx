
"use client";

import { useEffect, useState } from "react";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, MoreVertical, Trash2, Share2, Eye } from "lucide-react";



export default function LibraryPage() {
    const [libraryItems, setLibraryItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLibrary = async () => {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`/api/library?userId=${userId}`);
                if (res.ok) {
                    const data = await res.json();
                    // Transform API data to match UI shape
                    const formattedItems = data.map((item: any) => ({
                        id: item.id,
                        title: item.title || "Untitled Summary",
                        date: new Date(item.createdAt).toLocaleDateString(),
                        duration: item.type === 'video' ? 'Video' : 'Text',
                        category: item.type === 'video' ? 'Video Analysis' : 'Text Summary',
                        thumbnail: item.type === 'video' ? "bg-red-500/20" : "bg-blue-500/20",
                        type: item.type
                    }));
                    setLibraryItems(formattedItems);
                }
            } catch (error) {
                console.error("Failed to fetch library", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLibrary();
    }, []);

    return (
        <DashboardLayout role="user">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">My Library</h1>
                    <p className="text-slate-400">Manage your saved summaries and notes.</p>
                </div>
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input placeholder="Search library..." className="pl-10 bg-white/5 border-white/10" />
                </div>
            </div>

            {loading ? (
                <div className="text-center text-slate-400 py-12">Loading library...</div>
            ) : libraryItems.length === 0 ? (
                <div className="text-center text-slate-400 py-12">No items found in your library.</div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {libraryItems.map((item) => (
                        <Card key={item.id} className="glass-card border-white/5 group hover:bg-white/5 transition-all duration-300">
                            <div className={`h-40 w-full ${item.thumbnail} relative flex items-center justify-center`}>
                                <BookOpen className="h-12 w-12 text-white/20 group-hover:text-white/40 transition-colors" />
                            </div>
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start gap-2">
                                    <div>
                                        <CardTitle className="text-lg leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-1">{item.title}</CardTitle>
                                        <CardDescription>{item.date}</CardDescription>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 text-slate-400 hover:text-white">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between mt-2">
                                    <Badge variant="outline" className="border-white/10 text-slate-400">
                                        {item.category}
                                    </Badge>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary hover:bg-primary/10">
                                            <Share2 className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-500/10">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
}
