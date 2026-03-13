import Link from "next/link";
import { ArrowRight, Building2, Users, ShoppingBag, MapPin, CheckCircle2, Factory, TrendingUp, ShieldCheck, Bed, ConciergeBell, Droplets, PaintBucket, Coffee, PlusSquare } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const stats = [
  { id: 1, name: "Years of Expertise", value: "10+", icon: TrendingUp },
  { id: 3, name: "Team of Experts", value: "50+", icon: ShoppingBag },
  { id: 2, name: "Workers Crew", value: "80+", icon: Users },
  { id: 5, name: "Loyal Customers", value: "200+", icon: Users },
  { id: 4, name: "Shipments Completed", value: "15k+", icon: MapPin },
];

const categories = [
  { name: "Amenities", icon: ConciergeBell, image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop" },
  { name: "Bath", icon: Droplets, image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=800&auto=format&fit=crop" },
  { name: "Furniture", icon: Bed, image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&auto=format&fit=crop" },
  { name: "Paper & Bio Products", icon: PlusSquare, image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?q=80&w=800&auto=format&fit=crop" },
  { name: "Platform Beds", icon: Bed, image: "https://images.unsplash.com/photo-1505693314120-0d443867891c?q=80&w=800&auto=format&fit=crop" },
];

const industries = [
  { name: "Hotels & Resorts", description: "Luxury and comfort-focused essentials for premium guest experiences." },
  { name: "Hospitals & Clinics", description: "High-cycle durability and hygiene-centric medical standards." },
  { name: "Hostels & PG", description: "Robust, cost-efficient, and long-lasting supplies for high occupancy." },
  { name: "Corporate Guest Houses", description: "Standardized, elegant solutions for business travelers." },
  { name: "Banquet Halls", description: "Large-scale catering and seating covers, event linens." },
  { name: "Educational Institutions", description: "Dormitory and campus facility provisioning at scale." },
];

const reasons = [
  "Competitive Wholesale Pricing",
  "Assured Quality Standards",
  "Timely Global Delivery",
  "Custom Branding Options",
  "Strong Vendor Network",
  "Dedicated B2B Support",
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-secondary text-white py-24 lg:py-32 overflow-hidden">
        {/* Placeholder image for hero background */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center md:bg-fixed opacity-15"></div>
        {/* Subtle geometric overlay for B2B industrial feel */}
        <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/90 to-transparent"></div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-start text-left max-w-7xl">
          <span className="text-accent font-bold tracking-[0.2em] uppercase text-xs mb-6 border-l-4 border-accent pl-3">Shree Umiya Enterprise</span>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold font-heading leading-[1.1] mb-8 max-w-4xl text-white">
            Premium Hospitality Supplies. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-white">Delivered at Scale.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed border-l-2 border-gray-600 pl-4 font-light">
            Trusted bulk suppliers for hotels, hospitals, hostels, and institutions. Consistent quality, competitive pricing, and dependable global delivery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link
              href="/contact"
              className={cn(buttonVariants({ size: "lg", variant: "default" }), "font-heading text-sm px-8 py-7 uppercase tracking-wider shadow-xl shadow-primary/20")}
            >
              Request Bulk Quote
            </Link>
            <Link
              href="/products"
              className={cn(buttonVariants({ size: "lg", variant: "outline" }), "font-heading text-sm px-8 py-7 uppercase tracking-wider border-white/30 text-white hover:bg-white/10 hover:text-white backdrop-blur-sm")}
            >
              Explore Products
            </Link>
          </div>
        </div>
      </section>

      {/* Snapshot Stats Section */}
      <section className="bg-primary text-white py-12 relative z-10 -mt-8 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 rounded-sm shadow-2xl">
        <dl className="grid grid-cols-2 gap-x-8 sm:gap-x-0 gap-y-12 sm:grid-cols-5 sm:divide-x sm:divide-white/20">
          {stats.map((stat) => (
            <div key={stat.id} className="flex flex-col items-center justify-center gap-3">
              <stat.icon className="h-8 w-8 text-white/80" />
              <dd className="text-4xl font-bold tracking-tight text-white font-heading">{stat.value}</dd>
              <dt className="text-sm font-medium leading-6 text-white/80 uppercase tracking-wider text-center">{stat.name}</dt>
            </div>
          ))}
        </dl>
      </section>

      {/* Product Categories Overview */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-secondary sm:text-4xl font-heading mb-4">Our Core Product Categories</h2>
            <p className="text-lg text-gray-600">Comprehensive supply solutions designed to meet the rigorous demands of the hospitality industry.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {categories.map((category) => (
              <Link href="/products" key={category.name} className="group relative rounded-sm overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
                <div className="relative h-48 w-full overflow-hidden">
                  <div className="absolute inset-0 bg-secondary/20 group-hover:bg-transparent transition-colors z-10"></div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={category.image} alt={category.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6 flex-grow flex flex-col justify-between z-20 bg-white relative">
                  <div className="flex items-center gap-3 mb-4 text-secondary group-hover:text-primary transition-colors">
                    <category.icon className="h-6 w-6 shrink-0" />
                    <h3 className="font-heading font-bold text-lg">{category.name}</h3>
                  </div>
                  <div className="flex items-center text-sm font-semibold text-accent uppercase tracking-wider group-hover:translate-x-2 transition-transform">
                    View Catalog <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="py-24 bg-white border-y border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 items-start">
            <div className="lg:col-span-1 sticky top-32">
              <span className="text-primary font-bold tracking-widest uppercase text-xs mb-3 block">Specialized Solutions</span>
              <h2 className="text-3xl font-extrabold tracking-tight text-secondary sm:text-4xl font-heading mb-6">Industries We Serve</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                We understand that a luxury resort has vastly different requirements than a multi-specialty hospital. Our catalog and sourcing is structured to serve specific industry standards perfectly.
              </p>
              <Link href="/industries" className={cn(buttonVariants({ variant: "outline" }), "font-heading uppercase tracking-widest text-xs px-6 py-5")}>
                View Detailed Solutions
              </Link>
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
              {industries.map((industry) => (
                <div key={industry.name} className="flex gap-4 p-6 rounded-sm bg-gray-50 border border-gray-100 hover:border-primary/20 transition-colors">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm bg-secondary text-white shadow-md">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg text-secondary mb-2">{industry.name}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{industry.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 w-full order-2 lg:order-1 relative">
              <div className="absolute inset-0 bg-accent translate-x-4 translate-y-4 rounded-sm"></div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=800&auto=format&fit=crop"
                alt="Warehouse operations"
                className="relative z-10 shadow-xl rounded-sm object-cover h-[500px] w-full"
              />
              <div className="absolute -bottom-8 -right-8 z-20 bg-white p-6 shadow-2xl rounded-sm border border-gray-100 flex items-center gap-4">
                <ShieldCheck className="h-12 w-12 text-primary" />
                <div>
                  <div className="font-heading font-bold text-2xl text-secondary">100%</div>
                  <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Quality Assured</div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 w-full order-1 lg:order-2">
              <span className="text-accent font-bold tracking-widest uppercase text-xs mb-3 block">Operational Excellence</span>
              <h2 className="text-3xl font-extrabold tracking-tight text-secondary sm:text-4xl font-heading mb-8">Built for Scale and Reliability</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {reasons.map((reason) => (
                  <div key={reason} className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary shrink-0" />
                    <span className="font-medium text-secondary">{reason}</span>
                  </div>
                ))}
              </div>
              <div className="mt-10 border-t border-gray-200 pt-8">
                <p className="text-gray-600 italic border-l-4 border-gray-200 pl-4">
                  "Our operation is built on the simple premise that B2B procurement should be as efficient, transparent, and quality-driven as possible."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 py-20 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl font-extrabold text-white font-heading sm:text-4xl mb-6">
            Looking for a Reliable Hospitality Supply Partner?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto font-light">
            Let&apos;s discuss your procurement needs. We offer customized supply plans and dedicated relationship management.
          </p>
          <Link
            href="/contact"
            className={cn(buttonVariants({ size: "lg", variant: "default" }), "font-heading text-base px-10 py-7 uppercase tracking-wider shadow-lg")}
          >
            Request Custom Proposal
          </Link>
        </div>
      </section>
    </div>
  );
}
