import Link from "next/link";
import { Package, Users, ShoppingCart, TrendingUp } from "lucide-react";

const stats = [
    { name: "Total Products", value: "24", icon: Package, change: "+3 this week", positive: true },
    { name: "Categories", value: "8", icon: ShoppingCart, change: "No change", positive: true },
    { name: "Low Stock Items", value: "3", icon: TrendingUp, change: "-2 from last week", positive: true },
    { name: "Total Enquiries", value: "142", icon: Users, change: "+12% vs last month", positive: true },
];

export default function AdminDashboard() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-heading font-bold text-secondary">Dashboard Overview</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-gray-500 font-semibold text-sm uppercase tracking-wider">{stat.name}</h3>
                            <div className="p-2 bg-primary/10 rounded-sm">
                                <stat.icon className="w-5 h-5 text-primary" />
                            </div>
                        </div>
                        <p className="text-3xl font-heading font-bold text-secondary mb-2">{stat.value}</p>
                        <p className={`text-sm ${stat.positive ? 'text-green-600' : 'text-red-600'} font-medium`}>
                            {stat.change}
                        </p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-sm shadow-sm border border-gray-100 min-h-[400px]">
                    <h3 className="text-lg font-heading font-bold text-secondary mb-4 border-b border-gray-100 pb-4">
                        Recent Activity
                    </h3>
                    <div className="flex items-center justify-center h-64 text-gray-400 text-sm italic">
                        Activity chart placeholder...
                    </div>
                </div>
                <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 min-h-[400px]">
                    <h3 className="text-lg font-heading font-bold text-secondary mb-4 border-b border-gray-100 pb-4">
                        Quick Actions
                    </h3>
                    <div className="space-y-3">
                        <Link href="/admin/products/new" className="block w-full text-left px-4 py-3 bg-gray-50 hover:bg-primary/5 hover:text-primary transition-colors rounded-sm text-sm font-semibold border border-gray-100">
                            + Add New Product
                        </Link>
                        <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-primary/5 hover:text-primary transition-colors rounded-sm text-sm font-semibold border border-gray-100">
                            Edit Categories
                        </button>
                        <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-primary/5 hover:text-primary transition-colors rounded-sm text-sm font-semibold border border-gray-100">
                            View Recent Enquiries
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
