import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Building, Building2, GraduationCap, ArrowRight, CheckCircle2, Factory } from "lucide-react";

export default function IndustriesPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Target Segments Hero */}
            <section className="relative bg-secondary text-white py-24 lg:py-32">
                {/* Hero Background using a verified stock image */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center md:bg-fixed opacity-15 brightness-75"></div>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-4xl">
                    <span className="text-accent font-bold tracking-widest uppercase text-sm mb-4 block">Target Solutions</span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-heading mb-6 tracking-tight">
                        Specialized Solutions for Every Sector
                    </h1>
                    <p className="text-xl text-gray-300 font-light leading-relaxed max-w-3xl mx-auto">
                        We adapt our procurement strategies to match the exact operational dynamics of your industry. A luxury resort and a high-occupancy hospital have different needs—we fulfill both with precision.
                    </p>
                </div>
            </section>

            {/* Industry Breakdowns */}
            <section className="py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl space-y-24">

                    {/* Hotels */}
                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
                        <div className="lg:w-1/2 w-full order-2 lg:order-1">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="bg-primary/10 p-4 rounded-sm">
                                    <Building2 className="w-8 h-8 text-primary" />
                                </div>
                                <h2 className="text-3xl font-extrabold font-heading text-secondary">Hotels & Resorts</h2>
                            </div>
                            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                In the luxury hospitality sector, aesthetic and tactile comfort dictate the guest experience. We focus on supplying premium linens, meticulously crafted guest amenities, and elegant tableware.
                            </p>
                            <ul className="space-y-4 mb-8">
                                {['High Thread-Count Bedding & Duvets', 'Plush, 600+ GSM Bath Linens', 'Boutique Room Toiletries', 'Standardized Housekeeping Kits'].map(item => (
                                    <li key={item} className="flex items-center gap-3 text-secondary font-medium">
                                        <CheckCircle2 className="w-5 h-5 text-accent shrink-0" /> {item}
                                    </li>
                                ))}
                            </ul>
                            <Link href="/contact" className={cn(buttonVariants({ variant: "outline" }), "font-heading uppercase tracking-wide text-xs px-6 py-5")}>
                                Request Hotel Catalog
                            </Link>
                        </div>
                        <div className="lg:w-1/2 w-full order-1 lg:order-2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=800&auto=format&fit=crop" alt="Hotel room" className="rounded-sm shadow-xl w-full h-[400px] object-cover" />
                        </div>
                    </div>

                    {/* Hospitals */}
                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
                        <div className="lg:w-1/2 w-full">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="https://images.unsplash.com/photo-1586098402227-ef1340176840?q=80&w=800&auto=format&fit=crop" alt="Hospital hallway" className="rounded-sm shadow-xl w-full h-[400px] object-cover" />
                        </div>
                        <div className="lg:w-1/2 w-full">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="bg-primary/10 p-4 rounded-sm">
                                    <Building className="w-8 h-8 text-primary" />
                                </div>
                                <h2 className="text-3xl font-extrabold font-heading text-secondary">Hospitals & Clinics</h2>
                            </div>
                            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                Healthcare procurement demands extreme durability to withstand industrial washing cycles, alongside rigorous hygiene and sanitization standards.
                            </p>
                            <ul className="space-y-4 mb-8">
                                {['Autoclavable & Wash-Resistant Linens', 'Surgical Towels & Drapes', 'Medical-Grade Protectors', 'High-Capacity Dispensing Systems'].map(item => (
                                    <li key={item} className="flex items-center gap-3 text-secondary font-medium">
                                        <CheckCircle2 className="w-5 h-5 text-accent shrink-0" /> {item}
                                    </li>
                                ))}
                            </ul>
                            <Link href="/contact" className={cn(buttonVariants({ variant: "outline" }), "font-heading uppercase tracking-wide text-xs px-6 py-5")}>
                                Request Healthcare Catalog
                            </Link>
                        </div>
                    </div>

                    {/* Hostels & Institutions */}
                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
                        <div className="lg:w-1/2 w-full order-2 lg:order-1">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="bg-primary/10 p-4 rounded-sm">
                                    <GraduationCap className="w-8 h-8 text-primary" />
                                </div>
                                <h2 className="text-3xl font-extrabold font-heading text-secondary">Hostels & Corporate Housing</h2>
                            </div>
                            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                For PG accommodations and corporate dormitories, the focus shifts to robust, cost-efficient, and easily replaceable items that handle heavy rotational use.
                            </p>
                            <ul className="space-y-4 mb-8">
                                {['Durable Poly-Cotton Bed Linens', 'Economical Bulk Mattresses', 'Sturdy F&B Utensils', 'Mass-Scale Cleaning Supplies'].map(item => (
                                    <li key={item} className="flex items-center gap-3 text-secondary font-medium">
                                        <CheckCircle2 className="w-5 h-5 text-accent shrink-0" /> {item}
                                    </li>
                                ))}
                            </ul>
                            <Link href="/contact" className={cn(buttonVariants({ variant: "outline" }), "font-heading uppercase tracking-wide text-xs px-6 py-5")}>
                                Request Institutional Catalog
                            </Link>
                        </div>
                        <div className="lg:w-1/2 w-full order-1 lg:order-2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=800&auto=format&fit=crop" alt="Hostel dormitory" className="rounded-sm shadow-xl w-full h-[400px] object-cover" />
                        </div>
                    </div>

                </div>
            </section>

            {/* CTA Bottom block */}
            <section className="bg-gray-50 py-20 border-t border-gray-100">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
                    <Factory className="w-12 h-12 text-accent mx-auto mb-6" />
                    <h2 className="text-3xl font-bold font-heading text-secondary mb-6">Need Industry-Specific Consulting?</h2>
                    <p className="text-lg text-gray-600 mb-8">
                        Speak to our procurement experts who understand the exact operational bottlenecks of your sector.
                    </p>
                    <Link href="/contact" className={cn(buttonVariants({ variant: "default", size: "lg" }), "uppercase tracking-widest font-heading")}>
                        Consult Our Experts
                    </Link>
                </div>
            </section>
        </div>
    );
}
