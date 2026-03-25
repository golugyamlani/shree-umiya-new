"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, UploadCloud, X, Plus, Loader2, CheckCircle, Trash2 } from "lucide-react";
import { createProduct } from "@/app/actions/products";
import { compressImageToWebp } from "@/lib/image-compressor";

type VariantOption = { label: string };

export default function NewProductPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

  // Core form state
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Amenities");
  const [moq, setMoq] = useState("");
  const [price, setPrice] = useState("Bulk pricing available on request");
  const [spec, setSpec] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState("");

  // Image state
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [hoverFile, setHoverFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

  const addGalleryFiles = async (newFiles: FileList | null) => {
    if (!newFiles) return;
    const webpFiles = await Promise.all(Array.from(newFiles).map((f, i) => compressImageToWebp(f, name || 'product', galleryFiles.length + i)));
    setGalleryFiles(prev => [...prev, ...webpFiles]);
  };

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setCoverFile(await compressImageToWebp(file, `${name || 'product'}-cover`));
  };

  const handleHoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setHoverFile(await compressImageToWebp(file, `${name || 'product'}-hover`));
  };

  const removeGalleryFile = (index: number) => {
    setGalleryFiles(prev => prev.filter((_, i) => i !== index));
  };
  const [useCoverForHover, setUseCoverForHover] = useState(false);

  // Variant state
  const [hasColors, setHasColors] = useState(false);
  const [colors, setColors] = useState<VariantOption[]>([]);
  const [colorInput, setColorInput] = useState("");

  const [hasDimensions, setHasDimensions] = useState(false);
  const [dimensions, setDimensions] = useState<VariantOption[]>([]);
  const [dimInput, setDimInput] = useState("");

  const [hasCapacity, setHasCapacity] = useState(false);
  const [capacity, setCapacity] = useState<VariantOption[]>([]);
  const [capInput, setCapInput] = useState("");

  const handleAddVariant = (
    input: string,
    setInput: React.Dispatch<React.SetStateAction<string>>,
    list: VariantOption[],
    setList: React.Dispatch<React.SetStateAction<VariantOption[]>>
  ) => {
    if (!input.trim() || list.some((i) => i.label === input.trim())) return;
    setList([...list, { label: input.trim() }]);
    setInput("");
  };

  const handleRemoveVariant = (
    itemToRemove: string,
    list: VariantOption[],
    setList: React.Dispatch<React.SetStateAction<VariantOption[]>>
  ) => {
    setList(list.filter((item) => item.label !== itemToRemove));
  };

  // Generate Cartesian combinations
  const generateCombinations = () => {
    const activeLists: string[][] = [];
    if (hasColors && colors.length > 0) activeLists.push(colors.map((c) => `color:${c.label}`));
    if (hasDimensions && dimensions.length > 0) activeLists.push(dimensions.map((d) => `dimension:${d.label}`));
    if (hasCapacity && capacity.length > 0) activeLists.push(capacity.map((c) => `capacity:${c.label}`));
    if (activeLists.length === 0) return [];
    return activeLists.reduce((acc, currentList) => {
      const temp: string[] = [];
      acc.forEach((a) => currentList.forEach((c) => temp.push(`${a}|${c}`)));
      return temp;
    });
  };

  const combinations = generateCombinations();

  const handleSubmit = () => {
    if (!name.trim()) { alert("Product name is required."); return; }

    startTransition(async () => {
      try {
        // Flatten all variants into { type, label } objects
        const variants = [
          ...colors.map((c) => ({ type: "color", label: c.label })),
          ...dimensions.map((d) => ({ type: "dimension", label: d.label })),
          ...capacity.map((c) => ({ type: "capacity", label: c.label })),
        ];

        const variantCombinations = combinations.map((key) => ({ key }));

        await createProduct({
          name,
          categoryId: category,
          moq,
          price,
          specifications: JSON.stringify({ description: spec, features }),
          coverImageFile: coverFile,
          hoverImageFile: useCoverForHover ? coverFile : hoverFile,
          galleryFiles,
          variants: JSON.stringify(variants),
          variantCombinations: JSON.stringify(variantCombinations),
        });

        setSaveStatus("success");
        setTimeout(() => router.push("/admin/products"), 1200);
      } catch (e) {
        console.error(e);
        setSaveStatus("error");
      }
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 text-gray-500 hover:text-secondary transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-heading font-bold text-secondary">Add New Product</h1>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending || saveStatus === "success"}
          className="bg-secondary hover:bg-primary disabled:opacity-60 text-white px-6 py-3 rounded-sm font-semibold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-lg"
        >
          {isPending ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
          ) : saveStatus === "success" ? (
            <><CheckCircle className="w-5 h-5" /> Saved!</>
          ) : (
            <><Save className="w-5 h-5" /> Save Product</>
          )}
        </button>
      </div>

      {saveStatus === "error" && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-sm text-sm font-medium">
          Failed to save product. Please check your connection and try again.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100">
            <h2 className="text-lg font-heading font-bold text-secondary mb-6 border-b border-gray-100 pb-4">Basic Information</h2>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name *</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-lg font-bold"
                placeholder="e.g. Premium White Duvet Cover"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mt-6 border-t border-gray-100 pt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Product Specifications (Description)</label>
              <textarea
                rows={5}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all resize-y mb-6"
                placeholder="Add commercial-grade specifications here..."
                value={spec}
                onChange={(e) => setSpec(e.target.value)}
              />

              <label className="block text-sm font-semibold text-gray-700 mb-2">Detailed Features (Bullet Points)</label>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="e.g. 5000 Lbs Tested"
                  className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && featureInput.trim() !== "") {
                      e.preventDefault();
                      setFeatures(prev => [...prev, featureInput.trim()]);
                      setFeatureInput("");
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (featureInput.trim()) {
                      setFeatures(prev => [...prev, featureInput.trim()]);
                      setFeatureInput("");
                    }
                  }}
                  className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-sm text-sm font-semibold transition-colors"
                >
                  Add Feature
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {features.map((feat, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white border border-gray-100 px-4 py-2 rounded-sm shadow-sm group">
                    <span className="text-sm text-gray-700 font-medium">{feat}</span>
                    <button
                      type="button"
                      onClick={() => setFeatures(prev => prev.filter((_, i) => i !== idx))}
                      className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Variant Options */}
          <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100">
            <h2 className="text-lg font-heading font-bold text-secondary mb-6 border-b border-gray-100 pb-4">Variant Options</h2>
            <p className="text-sm text-gray-500 mb-6">Enable specific variants for this product.</p>
            <div className="space-y-8">
              {/* Color Variants */}
              <div className="border border-gray-200 rounded-sm p-5">
                <label className="flex items-center gap-3 cursor-pointer mb-4">
                  <input type="checkbox" className="w-5 h-5 accent-primary" checked={hasColors} onChange={() => setHasColors(!hasColors)} />
                  <span className="font-bold text-secondary">Has Color Variants</span>
                </label>
                {hasColors && (
                  <div>
                    <div className="flex gap-2 mb-4">
                      <input type="text" placeholder="e.g. Navy Blue" className="flex-1 px-4 py-2 border border-gray-200 rounded-sm text-sm" value={colorInput} onChange={(e) => setColorInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAddVariant(colorInput, setColorInput, colors, setColors)} />
                      <button type="button" onClick={() => handleAddVariant(colorInput, setColorInput, colors, setColors)} className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-sm text-sm font-semibold">Add</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {colors.length === 0 && <span className="text-xs text-gray-400 italic">No colors added yet.</span>}
                      {colors.map((c) => (
                        <div key={c.label} className="inline-flex items-center gap-1 bg-secondary text-white text-xs font-semibold pl-3 pr-1 py-1 rounded-sm">
                          <span>{c.label}</span>
                          <button type="button" onClick={() => handleRemoveVariant(c.label, colors, setColors)} className="p-1 hover:text-primary ml-1"><X className="w-3 h-3" /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Dimension Variants */}
              <div className="border border-gray-200 rounded-sm p-5">
                <label className="flex items-center gap-3 cursor-pointer mb-4">
                  <input type="checkbox" className="w-5 h-5 accent-primary" checked={hasDimensions} onChange={() => setHasDimensions(!hasDimensions)} />
                  <span className="font-bold text-secondary">Has Dimension Variants</span>
                </label>
                {hasDimensions && (
                  <div>
                    <div className="flex gap-2 mb-4">
                      <input type="text" placeholder="e.g. King Size" className="flex-1 px-4 py-2 border border-gray-200 rounded-sm text-sm" value={dimInput} onChange={(e) => setDimInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAddVariant(dimInput, setDimInput, dimensions, setDimensions)} />
                      <button type="button" onClick={() => handleAddVariant(dimInput, setDimInput, dimensions, setDimensions)} className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-sm text-sm font-semibold">Add</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {dimensions.length === 0 && <span className="text-xs text-gray-400 italic">No dimensions added yet.</span>}
                      {dimensions.map((d) => (
                        <div key={d.label} className="inline-flex items-center gap-1 bg-secondary text-white text-xs font-semibold pl-3 pr-1 py-1 rounded-sm">
                          <span>{d.label}</span>
                          <button type="button" onClick={() => handleRemoveVariant(d.label, dimensions, setDimensions)} className="p-1 hover:text-primary ml-1"><X className="w-3 h-3" /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Capacity Variants */}
              <div className="border border-gray-200 rounded-sm p-5">
                <label className="flex items-center gap-3 cursor-pointer mb-4">
                  <input type="checkbox" className="w-5 h-5 accent-primary" checked={hasCapacity} onChange={() => setHasCapacity(!hasCapacity)} />
                  <span className="font-bold text-secondary">Has Capacity / Size Variants</span>
                </label>
                {hasCapacity && (
                  <div>
                    <div className="flex gap-2 mb-4">
                      <input type="text" placeholder="e.g. 50 Liters" className="flex-1 px-4 py-2 border border-gray-200 rounded-sm text-sm" value={capInput} onChange={(e) => setCapInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAddVariant(capInput, setCapInput, capacity, setCapacity)} />
                      <button type="button" onClick={() => handleAddVariant(capInput, setCapInput, capacity, setCapacity)} className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-sm text-sm font-semibold">Add</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {capacity.length === 0 && <span className="text-xs text-gray-400 italic">No capacities added yet.</span>}
                      {capacity.map((c) => (
                        <div key={c.label} className="inline-flex items-center gap-1 bg-secondary text-white text-xs font-semibold pl-3 pr-1 py-1 rounded-sm">
                          <span>{c.label}</span>
                          <button type="button" onClick={() => handleRemoveVariant(c.label, capacity, setCapacity)} className="p-1 hover:text-primary ml-1"><X className="w-3 h-3" /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100">
            <h2 className="text-lg font-heading font-bold text-secondary mb-6 border-b border-gray-100 pb-4">Product Details</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                  <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="Amenities">Amenities</option>
                    <option value="Bath">Bath</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Paper & Bio Products">Paper & Bio Products</option>
                    <option value="Platform Beds">Platform Beds</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Minimum Order Qty (MOQ) *</label>
                  <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all" placeholder="e.g. 50 Pieces" value={moq} onChange={(e) => setMoq(e.target.value)} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Pricing Tier</label>
                <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all" value={price} onChange={(e) => setPrice(e.target.value)} />
              </div>


            </div>
          </div>

          {/* Variant Combination Images */}
          {combinations.length > 0 && (
            <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100">
              <h2 className="text-lg font-heading font-bold text-secondary mb-6 border-b border-gray-100 pb-4">Variant Images (Combinations)</h2>
              <p className="text-sm text-gray-500 mb-6">Attach specific images to variant combinations (e.g. show a unique photo when "Navy Blue" AND "King Size" are selected).</p>
              <div className="space-y-4">
                {combinations.map((combo) => (
                  <div key={combo} className="flex items-center justify-between p-4 border border-gray-100 rounded-sm bg-gray-50/50">
                    <span className="bg-white text-secondary text-sm font-semibold px-3 py-1 border border-gray-200 rounded-sm shadow-sm">
                      {combo.replace(/color:|dimension:|capacity:/g, "").replace(/\|/g, " + ")}
                    </span>
                    <span className="text-xs text-gray-400 italic">Image upload available after save</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Images */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 sticky top-6">
            <h2 className="text-lg font-heading font-bold text-secondary mb-6 border-b border-gray-100 pb-4">Product Images</h2>
            <div className="space-y-6">

              {/* Cover Image */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Cover Image *</h3>
                <label className="border-2 border-dashed border-gray-300 rounded-sm bg-gray-50 flex flex-col items-center justify-center h-36 hover:bg-gray-100 hover:border-primary transition-all cursor-pointer group mb-3">
                  {coverFile ? (
                    <div className="relative w-full h-full">
                      <img src={URL.createObjectURL(coverFile)} alt="Cover preview" className="w-full h-full object-cover rounded-sm" />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-sm">
                        <span className="text-white text-xs font-semibold">Change Image</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-5 h-5 text-primary" />
                      </div>
                      <p className="font-semibold text-gray-700 text-sm">Upload Cover</p>
                      <p className="text-xs text-gray-400">Main catalog image</p>
                    </div>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-primary" checked={useCoverForHover} onChange={() => setUseCoverForHover(!useCoverForHover)} />
                  <span className="text-sm font-semibold text-gray-600">Use cover image for hover state</span>
                </label>
              </div>

              {/* Hover Image */}
              {!useCoverForHover && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Hover Image</h3>
                  <label className="border-2 border-dashed border-gray-300 rounded-sm bg-gray-50 flex flex-col items-center justify-center h-36 hover:bg-gray-100 hover:border-primary transition-all cursor-pointer group">
                    {hoverFile ? (
                      <div className="relative w-full h-full">
                        <img src={URL.createObjectURL(hoverFile)} alt="Hover preview" className="w-full h-full object-cover rounded-sm" />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-sm">
                          <span className="text-white text-xs font-semibold">Change Image</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                          <UploadCloud className="w-5 h-5 text-primary" />
                        </div>
                        <p className="font-semibold text-gray-700 text-sm">Upload Hover</p>
                        <p className="text-xs text-gray-400">Reveals on hover in catalog</p>
                      </div>
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={handleHoverChange} />
                  </label>
                </div>
              )}

              {/* Gallery */}
              {!(hasColors || hasDimensions || hasCapacity) && (
                <div className="pt-4 border-t border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Product Gallery</h3>
                  <p className="text-xs text-gray-500 mb-3">Add as many photos as you want for the expanded product view.</p>

                  {/* Existing gallery previews */}
                  {galleryFiles.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {galleryFiles.map((file, idx) => (
                        <div key={idx} className="relative group rounded-sm overflow-hidden h-20">
                          <img src={URL.createObjectURL(file)} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeGalleryFile(idx)}
                            className="absolute top-1 right-1 bg-black/60 hover:bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add more button */}
                  <label className="border-2 border-dashed border-gray-300 rounded-sm bg-gray-50 flex flex-col items-center justify-center py-5 hover:bg-gray-100 hover:border-primary transition-all cursor-pointer group">
                    <div className="w-9 h-9 bg-white rounded-full shadow-sm flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                      <Plus className="w-4 h-4 text-primary" />
                    </div>
                    <p className="font-semibold text-gray-700 text-sm">
                      {galleryFiles.length > 0 ? "Add More Images" : "Add Gallery Images"}
                    </p>
                    <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => addGalleryFiles(e.target.files)} />
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
