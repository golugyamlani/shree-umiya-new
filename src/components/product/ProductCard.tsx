import Image from "next/image";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

interface ProductCardProps {
    product: Product;
    className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
    return (
        <div className={cn("group flex flex-col space-y-3", className)}>
            <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 rounded-sm">
                <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                />
                {!product.inStock && (
                    <div className="absolute top-3 left-3 bg-black/80 text-white text-xs px-2 py-1 tracking-wider uppercase">
                        Out of Stock
                    </div>
                )}
            </div>
            <div className="flex flex-col space-y-1">
                <h3 className="text-sm font-medium tracking-wide text-foreground">
                    {product.name}
                </h3>
                <p className="text-sm text-foreground/70">
                    ${product.price.toFixed(2)}
                </p>
            </div>
        </div>
    );
}
