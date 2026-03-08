import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { ArrowRight, Box, CheckCircle, Clock, MapPin, Truck } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Hero Intro Banner */}
            <section className="relative bg-secondary text-white py-24 lg:py-32">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586528116311-ad8ed7c83a7f?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 brightness-50"></div>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-4xl">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-heading leading-tight mb-6">
                        Operational Strength & Core Values
                    </h1>
                    <p className="text-xl text-gray-300 font-light leading-relaxed">
                        We don't just supply products; we power the operational backbone of the hospitality industry.
                    </p>
                </div>
            </section>

            {/* Company Overview Section */}
            <section className="py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-accent font-bold tracking-widest uppercase text-xs mb-3 block">Who We Are</span>
                            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-secondary mb-6">
                                A Legacy of Trust and Bulk Efficiency
                            </h2>
                            <div className="prose prose-lg text-gray-600 space-y-6">
                                <p>
                                    Established with the vision of bridging the gap between high-end hospitality demands and robust supply chain execution, <strong>Shree Umiya Enterprise</strong> has grown into a powerhouse procurement partner.
                                </p>
                                <p>
                                    We recognize that for a hotel, hospital, or institutional facility to run flawlessly, their backend supply of essentials—from fresh linen to vital hygiene products—must be unimpeachable. Our business is designed around an unwavering commitment to scale, consistency, and structural dependability.
                                </p>
                            </div>

                            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="bg-gray-50 border border-gray-100 p-6 rounded-sm">
                                    <div className="text-3xl font-heading font-bold text-primary mb-2">2005</div>
                                    <div className="text-sm font-semibold uppercase tracking-wider text-secondary">Founding Year</div>
                                </div>
                                <div className="bg-gray-50 border border-gray-100 p-6 rounded-sm">
                                    <div className="text-3xl font-heading font-bold text-primary mb-2">50,000+</div>
                                    <div className="text-sm font-semibold uppercase tracking-wider text-secondary">Sq.ft Warehouse</div>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="grid grid-cols-2 gap-4">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=800&auto=format&fit=crop" alt="Quality check" className="rounded-sm shadow-md object-cover h-64 w-full" />
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="https://images.unsplash.com/photo-1587293852726-692b5e406437?q=80&w=800&auto=format&fit=crop" alt="Boxes stacked" className="rounded-sm shadow-md object-cover h-64 w-full mt-8" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
                        {/* Mission */}
                        <div className="bg-white p-10 md:p-14 shadow-lg border-t-8 border-primary rounded-sm relative">
                            <div className="absolute top-0 right-10 -translate-y-1/2 bg-white p-4 rounded-full shadow-md">
                                <Box className="h-8 w-8 text-primary" />
                            </div>
                            <h2 className="text-3xl font-extrabold font-heading text-secondary mb-6">Our Mission</h2>
                            <p className="text-lg text-gray-600 leading-relaxed font-light">
                                To deliver premium hospitality essentials with consistent quality and dependable service. We strive to empower institutions by taking the friction out of procurement, ensuring they never have to worry about the tools they need to serve their guests.
                            </p>
                        </div>

                        {/* Vision */}
                        <div className="bg-secondary p-10 md:p-14 shadow-lg border-t-8 border-accent rounded-sm relative">
                            <div className="absolute top-0 right-10 -translate-y-1/2 bg-secondary p-4 rounded-full shadow-md">
                                <CheckCircle className="h-8 w-8 text-accent" />
                            </div>
                            <h2 className="text-3xl font-extrabold font-heading text-white mb-6">Our Vision</h2>
                            <p className="text-lg text-gray-300 leading-relaxed font-light">
                                To become the most trusted nationwide partner for hospitality procurement solutions. We aim to set the gold standard in the B2B supply chain, recognized for unyielding integrity, supreme product quality, and logistical mastery.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 text-center container mx-auto px-4">
                <h2 className="text-3xl font-heading font-bold text-secondary mb-6">Experience Procurement Excellence</h2>
                <Link
                    href="/contact"
                    className={cn(buttonVariants({ size: "lg", variant: "default" }), "font-heading uppercase tracking-widest")}
                >
                    Partner With Us <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
            </section>
        </div>
    );
}
