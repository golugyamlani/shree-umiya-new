"use client";

import { motion, type Variants } from "framer-motion";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/types";

interface ProductGridProps {
    products: Product[];
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

export function ProductGrid({ products }: ProductGridProps) {
    return (
        <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-10"
        >
            {products.map((product) => (
                <motion.div key={product.id} variants={item}>
                    <ProductCard product={product} />
                </motion.div>
            ))}
        </motion.div>
    );
}
