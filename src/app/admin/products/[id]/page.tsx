import { getProductById } from "@/app/actions/products";
import EditProductForm from "./EditProductForm";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const product = await getProductById(resolvedParams.id);

  if (!product) {
    notFound();
  }

  return <EditProductForm product={product} />;
}
