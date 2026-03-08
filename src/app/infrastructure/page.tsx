import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { PackageSearch, Boxes, Route, ShieldCheck, AreaChart, Focus } from "lucide-react";

export default function InfrastructurePage() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Target Segments Hero */}
            <section className="bg-secondary text-white py-24 border-b-8 border-accent">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex flex-col md:flex-row items-center gap-12">
                    <div className="w-full md:w-1/2">
                        <span className="text-accent font-bold tracking-widest uppercase text-sm mb-4 block">The Trust Builder</span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-heading mb-6 tracking-tight">
                            Infrastructure & Quality
                        </h1>
                        <p className="text-xl text-gray-300 font-light leading-relaxed">
                            We leverage an expansive warehousing footprint and stringent multi-point quality checks to guarantee that what you order is precisely what you receive—on time, every time.
                        </p>
                    </div>
                    <div className="w-full md:w-1/2 grid grid-cols-2 gap-4">
                        <div className="bg-white/5 border border-white/10 p-6 rounded-sm text-center backdrop-blur-sm">
                            <Boxes className="w-8 h-8 text-accent mx-auto mb-3" />
                            <div className="text-2xl font-bold font-heading mb-1 text-white">50K+</div>
                            <div className="text-xs uppercase tracking-wider text-gray-400">Sq.ft Storage</div>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-6 rounded-sm text-center backdrop-blur-sm">
                            <Route className="w-8 h-8 text-accent mx-auto mb-3" />
                            <div className="text-2xl font-bold font-heading mb-1 text-white">28</div>
                            <div className="text-xs uppercase tracking-wider text-gray-400">States Reached</div>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-6 rounded-sm text-center backdrop-blur-sm">
                            <ShieldCheck className="w-8 h-8 text-accent mx-auto mb-3" />
                            <div className="text-2xl font-bold font-heading mb-1 text-white">SGS</div>
                            <div className="text-xs uppercase tracking-wider text-gray-400">Quality Compliant</div>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-6 rounded-sm text-center backdrop-blur-sm">
                            <AreaChart className="w-8 h-8 text-accent mx-auto mb-3" />
                            <div className="text-2xl font-bold font-heading mb-1 text-white">99.8%</div>
                            <div className="text-xs uppercase tracking-wider text-gray-400">Accuracy Rate</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content Areas */}
            <section className="py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl space-y-20">

                    {/* Warehousing */}
                    <div className="bg-white rounded-sm shadow-xl border border-gray-100 overflow-hidden flex flex-col md:flex-row">
                        <div className="w-full md:w-5/12 relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="https://images.unsplash.com/photo-Cp5NBK36IU8?q=80&w=1000&auto=format&fit=crop" alt="Warehouse facility" className="w-full h-full object-cover min-h-[300px]" />
                        </div>
                        <div className="w-full md:w-7/12 p-10 md:p-14 flex flex-col justify-center">
                            <h2 className="text-3xl font-extrabold font-heading text-secondary mb-6 flex items-center gap-3">
                                <Boxes className="w-8 h-8 text-primary" /> Warehousing Capacity
                            </h2>
                            <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                Our central distribution hub handles immense volume with precision. With over 50,000 square feet of optimized racking and storage space, we maintain significant buffer stock to protect our clients against supply chain shocks.
                            </p>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {['Palletized racking systems', 'Climate-controlled sections for amenities', 'Automated inventory tracking (WMS)', 'Dedicated staging zones for bulk dispatch'].map((item) => (
                                    <li key={item} className="flex items-start gap-2 text-sm text-secondary font-medium">
                                        <Focus className="w-4 h-4 text-accent translate-y-0.5 shrink-0" /> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Quality Control */}
                    <div className="bg-white rounded-sm shadow-xl border border-gray-100 overflow-hidden flex flex-col md:flex-row">
                        <div className="w-full md:w-7/12 p-10 md:p-14 flex flex-col justify-center order-2 md:order-1">
                            <h2 className="text-3xl font-extrabold font-heading text-secondary mb-6 flex items-center gap-3">
                                <ShieldCheck className="w-8 h-8 text-primary" /> Quality Control (QC)
                            </h2>
                            <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                We believe that in B2B procurement, consistency is just as important as the initial quality. Every batch of goods received passes through our multi-point inspection protocol before it is cleared for dispatch.
                            </p>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {['Thread-count verification', 'GSM tolerance checks', 'Chemical resistance tests for metals/plastics', 'Label and branding accuracy review'].map((item) => (
                                    <li key={item} className="flex items-start gap-2 text-sm text-secondary font-medium">
                                        <Focus className="w-4 h-4 text-accent translate-y-0.5 shrink-0" /> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="w-full md:w-5/12 relative order-1 md:order-2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="https://images.unsplash.com/photo-ZaQCL7EY2Sg?q=80&w=1000&auto=format&fit=crop" alt="Quality inspection" className="w-full h-full object-cover min-h-[300px]" />
                        </div>
                    </div>

                    {/* Logistics */}
                    <div className="bg-white rounded-sm shadow-xl border border-gray-100 overflow-hidden flex flex-col md:flex-row">
                        <div className="w-full md:w-5/12 relative bg-secondary flex items-center justify-center p-12">
                            <Route className="w-32 h-32 text-white/10 absolute inset-0 m-auto" />
                            <div className="relative z-10 text-center">
                                <div className="text-accent font-bold text-5xl font-heading mb-2">PAN India</div>
                                <div className="text-white uppercase tracking-widest text-sm font-semibold">Supply Coverage Map</div>
                            </div>
                        </div>
                        <div className="w-full md:w-7/12 p-10 md:p-14 flex flex-col justify-center">
                            <h2 className="text-3xl font-extrabold font-heading text-secondary mb-6 flex items-center gap-3">
                                <Route className="w-8 h-8 text-primary" /> Logistics & Distribution
                            </h2>
                            <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                Our logistics network is built for reliability. Whether shipping to a metropolitan five-star or a remote resort, our carrier partnerships ensure safe, timely, and traceable deliveries.
                            </p>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {['Strategic logistics partnerships', 'Full Truck Load (FTL) & Part Load (PTL)', 'Real-time dispatch tracking', 'Secure transit packaging'].map((item) => (
                                    <li key={item} className="flex items-start gap-2 text-sm text-secondary font-medium">
                                        <Focus className="w-4 h-4 text-accent translate-y-0.5 shrink-0" /> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                </div>
            </section>

            {/* CTA Bottom block */}
            <section className="bg-secondary text-white py-16 text-center">
                <h2 className="text-2xl font-bold font-heading mb-6 tracking-wide">Trust your supply chain to the experts.</h2>
                <Link href="/contact" className={cn(buttonVariants({ variant: "default", size: "lg" }), "uppercase tracking-widest font-heading shadow-xl")}>
                    Initiate Procurement
                </Link>
            </section>
        </div>
    );
}
