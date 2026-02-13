
"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, X, Search, TrendingUp, Users, UserPlus } from "lucide-react";
import { Status } from "@/types";

// Mock Data
const initialUsers = [
    { id: "1", name: "Alice Johnson", email: "alice@example.com", role: "user", status: "PENDING", date: "2024-02-14" },
    { id: "2", name: "Bob Smith", email: "bob@example.com", role: "user", status: "APPROVED", date: "2024-02-13" },
    { id: "3", name: "Charlie Brown", email: "charlie@example.com", role: "user", status: "REJECTED", date: "2024-02-12" },
    { id: "4", name: "David Wilson", email: "david@example.com", role: "user", status: "PENDING", date: "2024-02-14" },
    { id: "5", name: "Eve Davis", email: "eve@example.com", role: "admin", status: "APPROVED", date: "2024-01-01" },
];

export default function AdminDashboard() {
    const [users, setUsers] = useState(initialUsers);
    const [search, setSearch] = useState("");

    const handleStatusChange = (id: string, newStatus: Status) => {
        setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u));
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );

    const pendingCount = users.filter(u => u.status === "PENDING").length;

    return (
        <DashboardLayout role="admin">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{users.length}</div>
                        <p className="text-xs text-slate-400">+12% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                        <UserPlus className="h-4 w-4 text-secondary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{pendingCount}</div>
                        <p className="text-xs text-slate-400">Requires attention</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                        <TrendingUp className="h-4 w-4 text-accent" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">573</div>
                        <p className="text-xs text-slate-400">+201 since last hour</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="col-span-3">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>User Management</CardTitle>
                            <CardDescription>Manage user access and approvals.</CardDescription>
                        </div>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search users..."
                                className="pl-8"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-400 uppercase bg-white/5">
                                <tr>
                                    <th className="px-4 py-3 rounded-l-lg">User</th>
                                    <th className="px-4 py-3">Role</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3 text-right rounded-r-lg">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-4 py-3 font-medium text-white">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center text-xs">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div>{user.name}</div>
                                                    <div className="text-xs text-slate-400">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-slate-300 capitalize">{user.role}</td>
                                        <td className="px-4 py-3">
                                            <Badge variant={
                                                user.status === "APPROVED" ? "success" :
                                                    user.status === "REJECTED" ? "destructive" : "warning"
                                            }>
                                                {user.status}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-slate-400">{user.date}</td>
                                        <td className="px-4 py-3 text-right space-x-2">
                                            {user.status === "PENDING" && (
                                                <>
                                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-green-400 hover:text-green-300 hover:bg-green-400/20" onClick={() => handleStatusChange(user.id, "APPROVED")}>
                                                        <Check className="h-4 w-4" />
                                                        <span className="sr-only">Approve</span>
                                                    </Button>
                                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-400/20" onClick={() => handleStatusChange(user.id, "REJECTED")}>
                                                        <X className="h-4 w-4" />
                                                        <span className="sr-only">Reject</span>
                                                    </Button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </DashboardLayout>
    );
}
