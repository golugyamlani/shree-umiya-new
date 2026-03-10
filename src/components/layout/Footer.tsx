import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-secondary text-white pt-16 pb-8 border-t-[8px] border-primary">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-6">
                        <Link href="/" className="inline-flex items-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/logo.png" alt="Shree Umiya Enterprise" className="h-14 w-auto object-contain invert brightness-0" />
                        </Link>
                        <p className="text-sm leading-relaxed text-gray-300 pr-4">
                            Premium Hospitality Supplies. Built for Scale. Trusted bulk suppliers for hotels, hospitals, hostels, and institutions across India.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white font-heading mb-6 flex items-center gap-2">
                            <span className="w-4 h-1 bg-accent inline-block"></span> Quick Links
                        </h3>
                        <ul className="space-y-4">
                            {['Home', 'About Us', 'Industries We Serve', 'Infrastructure & Quality', 'Contact & Quote'].map((item) => {
                                const href = item === 'Home' ? '/' : (item.includes('About') ? '/about' : `/${item.split(' ')[0].toLowerCase()}`);
                                return (
                                    <li key={item}>
                                        <Link href={href} className="text-sm text-gray-300 hover:text-accent transition-colors font-medium">
                                            {item}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white font-heading mb-6 flex items-center gap-2">
                            <span className="w-4 h-1 bg-accent inline-block"></span> Categories
                        </h3>
                        <ul className="space-y-4">
                            {['Hotel Linen & Bedding', 'Towels & Bath Essentials', 'Guest Room Amenities', 'Housekeeping Supplies', 'Disposable & Hygiene'].map((item) => (
                                <li key={item}>
                                    <Link href="/products" className="text-sm text-gray-300 hover:text-accent transition-colors font-medium">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white font-heading mb-6 flex items-center gap-2">
                            <span className="w-4 h-1 bg-accent inline-block"></span> Contact Us
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex gap-3 text-sm text-gray-300">
                                <MapPin className="h-5 w-5 shrink-0 text-accent font-medium mt-0.5" />
                                <span className="leading-relaxed">123 Industrial Estate, Phase II, Warehouse District, New Delhi, India 110020</span>
                            </li>
                            <li className="flex gap-3 text-sm text-gray-300">
                                <Phone className="h-5 w-5 shrink-0 text-accent font-medium mt-0.5" />
                                <a href="tel:+919876543210" className="hover:text-accent transition-colors">+91 98765 43210</a>
                            </li>
                            <li className="flex gap-3 text-sm text-gray-300">
                                <Mail className="h-5 w-5 shrink-0 text-accent font-medium mt-0.5" />
                                <a href="mailto:info@shreeumiya.com" className="hover:text-accent transition-colors">info@shreeumiya.com</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-16 border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-400">
                        &copy; {new Date().getFullYear()} Shree Umiya Enterprise. All rights reserved. | GSTIN: 07AAJCS1234D1Z5
                    </p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
