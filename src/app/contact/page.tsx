"use client";

import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Mail, MapPin, Phone, Building, User, Send } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Target Segments Hero */}
            <section className="bg-secondary text-white py-24 pb-32">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center">
                    <span className="text-accent font-bold tracking-widest uppercase text-sm mb-4 block">Connect with Procurement Experts</span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-heading mb-6 tracking-tight">
                        Request a Custom Quote
                    </h1>
                    <p className="text-xl text-gray-300 font-light max-w-2xl mx-auto">
                        Provide us with your operational requirements, and our dedicated B2B team will get back to you with tailored wholesale pricing.
                    </p>
                </div>
            </section>

            {/* Main Content Areas */}
            <section className="pb-24 -mt-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="bg-white rounded-sm shadow-2xl border border-gray-100 overflow-hidden flex flex-col lg:flex-row">

                        {/* Form Column - Left */}
                        <div className="w-full lg:w-7/12 p-8 md:p-12 lg:p-16">
                            <h2 className="text-2xl font-bold font-heading text-secondary mb-8">Tell us what you need.</h2>
                            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="company" className="text-sm font-semibold text-gray-600 block">Company Name *</label>
                                        <div className="relative">
                                            <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input type="text" id="company" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-sm focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" placeholder="e.g. Grand Plaza Hotel" required />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-sm font-semibold text-gray-600 block">Contact Person *</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input type="text" id="name" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-sm focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" placeholder="John Doe" required />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="phone" className="text-sm font-semibold text-gray-600 block">Phone/WhatsApp *</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input type="tel" id="phone" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-sm focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" placeholder="+91 90991 83126" required />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-semibold text-gray-600 block">Email Address *</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input type="email" id="email" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-sm focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" placeholder="john@grandplaza.com" required />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="requirement" className="text-sm font-semibold text-gray-600 block">Product Requirement *</label>
                                    <textarea id="requirement" rows={4} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-sm focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none resize-none" placeholder="Please list items you are looking for (e.g. 100 sets of White Duvet Covers, 500 hand towels...)" required></textarea>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="qty" className="text-sm font-semibold text-gray-600 block">Overall Qty</label>
                                        <input type="text" id="qty" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" placeholder="Approximate" />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="location" className="text-sm font-semibold text-gray-600 block">Delivery Location</label>
                                        <input type="text" id="location" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" placeholder="City, State" />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="timeline" className="text-sm font-semibold text-gray-600 block">Delivery Timeline</label>
                                        <select id="timeline" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-gray-700">
                                            <option value="">Select Priority</option>
                                            <option value="immediate">Immediate (1-2 Weeks)</option>
                                            <option value="regular">Regular (2-4 Weeks)</option>
                                            <option value="planning">Planning Phase</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button type="submit" className={cn(buttonVariants({ size: "lg", variant: "default" }), "w-full font-heading uppercase tracking-widest group")}>
                                        Submit Quote Request <Send className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                    <p className="text-xs text-center text-gray-400 mt-4 leading-relaxed">By submitting this form, you agree to our Terms of Service. A representative will contact you within 24 business hours.</p>
                                </div>

                            </form>
                        </div>

                        {/* Imformation Column - Right */}
                        <div className="w-full lg:w-5/12 bg-secondary text-white p-8 md:p-12 lg:p-16 flex flex-col justify-between">
                            <div>
                                <h3 className="text-2xl font-bold font-heading mb-8 border-b border-white/20 pb-4">Contact Information</h3>
                                <ul className="space-y-8">
                                    <li className="flex gap-4">
                                        <div className="bg-white/10 p-3 rounded-full shrink-0 h-fit">
                                            <MapPin className="w-6 h-6 text-accent" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-accent uppercase text-xs tracking-wider mb-1">Corporate HQ & Warehouse</h4>
                                            <p className="text-gray-300 leading-relaxed text-sm">425-430 - Vivekanand Industrial Park<br />Kubadthal, Ahmedabad<br />Gujarat (India)</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="bg-white/10 p-3 rounded-full shrink-0 h-fit">
                                            <Phone className="w-6 h-6 text-accent" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-accent uppercase text-xs tracking-wider mb-1">B2B Sales Support</h4>
                                            <p className="text-gray-300 leading-relaxed text-sm"><a href="tel:+919099183126" className="hover:text-white transition-colors">+91 9099183126</a><br /><span className="text-xs text-gray-400">Mon - Sat: 9:00 AM - 7:00 PM</span></p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="bg-white/10 p-3 rounded-full shrink-0 h-fit">
                                            <Mail className="w-6 h-6 text-accent" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-accent uppercase text-xs tracking-wider mb-1">General Inquiries</h4>
                                            <p className="text-gray-300 leading-relaxed text-sm"><a href="mailto:info@shreeumiyaenterprise.in" className="hover:text-white transition-colors">info@shreeumiyaenterprise.in</a></p>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <div className="mt-12 w-full h-48 bg-gray-200 rounded-sm relative overflow-hidden group">
                                {/* Google Maps Embed Placeholder - visually matched map styling */}
                                <div className="absolute inset-0 bg-white/10 mix-blend-overlay z-10 pointer-events-none group-hover:bg-transparent transition-colors"></div>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop" alt="Map location" className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700" />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
                                    <div className="relative">
                                        <MapPin className="w-10 h-10 text-primary drop-shadow-2xl" />
                                        <div className="absolute -inset-1 bg-primary/30 rounded-full blur-md -z-10 animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

        </div>
    );
}
