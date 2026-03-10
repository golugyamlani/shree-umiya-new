"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/Button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Products", href: "/products" },
    { name: "Industries We Serve", href: "/industries" },
    { name: "Infrastructure & Quality", href: "/infrastructure" },
    { name: "Contact & Quote", href: "/contact" },
];

export default function Navbar() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-24 items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/logo.png" alt="Shree Umiya Enterprise" className="h-14 w-auto object-contain" />
                        </Link>
                    </div>
                    <nav className="hidden lg:flex items-center gap-6">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "text-sm font-semibold transition-colors hover:text-primary",
                                    pathname === link.href ? "text-primary" : "text-secondary"
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>
                    <div className="hidden lg:flex items-center gap-4">
                        <Link
                            href="/contact"
                            className={cn(buttonVariants({ variant: "default" }), "font-heading shadow-md uppercase tracking-wide text-xs px-6 py-6")}
                        >
                            Request Quote
                        </Link>
                    </div>

                    <div className="flex lg:hidden">
                        <button
                            type="button"
                            className="text-secondary hover:text-primary p-2 -mr-2"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMobileMenuOpen ? (
                                <X className="h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div className="lg:hidden border-t border-gray-100 bg-white">
                    <div className="space-y-1 px-4 pb-4 pt-2 shadow-inner">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={cn(
                                    "block rounded-md px-3 py-3 text-base font-semibold",
                                    pathname === link.href
                                        ? "bg-gray-50 text-primary"
                                        : "text-secondary hover:bg-gray-50 hover:text-primary"
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <Link
                                href="/contact"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={cn(buttonVariants({ variant: "default" }), "w-full font-heading py-6 uppercase tracking-wide")}
                            >
                                Request Quote
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
