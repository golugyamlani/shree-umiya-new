"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/app/actions/auth";

const adminNav = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-secondary text-white flex flex-col hidden md:flex">
                <div className="h-20 flex items-center px-6 border-b border-white/10">
                    <h1 className="text-xl font-heading font-bold text-white tracking-wider">
                        CMS Admin
                    </h1>
                </div>

                <nav className="flex-1 py-6 px-4 space-y-2">
                    {adminNav.map((item) => {
                        const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin');
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-sm transition-colors font-semibold text-sm",
                                    isActive
                                        ? "bg-primary text-white"
                                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                                )}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <form action={logoutAction} className="w-full">
                        <button type="submit" className="flex w-full items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/10 rounded-sm transition-colors">
                            <LogOut className="w-5 h-5" />
                            Sign Out
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header */}
                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-10">
                    <h2 className="text-2xl font-heading font-bold text-secondary">
                        Product Management System
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="text-sm font-semibold text-gray-600">Admin User</div>
                        <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold font-heading">
                            A
                        </div>
                    </div>
                </header>

                {/* Scrollable Main Area */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
