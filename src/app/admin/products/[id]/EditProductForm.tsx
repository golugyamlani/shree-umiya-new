"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, UploadCloud, X, Plus, Loader2, CheckCircle } from "lucide-react";
import { updateProduct, updateCombinationImages } from "@/app/actions/products";
import { compressImageToWebp } from "@/lib/image-compressor";

type VariantOption = { label: string };

export default function EditProductForm({ product }: { product: any }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

  // Core form state
  const [name, setName] = useState(product.name || "");
  const [category, setCategory] = useState(product.categoryId || "Amenities");
  const [moq, setMoq] = useState(product.moq || "");
  const [price, setPrice] = useState(product.price ? product.price.toString() : "Bulk pricing available on request");
  const [spec, setSpec] = useState(() => {
    if (product.specifications?.startsWith("{")) {
      try {
        return JSON.parse(product.specifications).description || "";
      } catch { return product.specifications || ""; }
    }
    return product.specifications || "";
  });
  const [features, setFeatures] = useState<string[]>(() => {
    if (product.specifications?.startsWith("{")) {
      try {
        return JSON.parse(product.specifications).features || [];
      } catch { return []; }
    }
    return [];
  });
  const [featureInput, setFeatureInput] = useState("");

  // Image state
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [hoverFile, setHoverFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [existingGalleryUrls, setExistingGalleryUrls] = useState<string[]>(product.gallery?.map((g: any) => g.url) || []);
  const [comboUploads, setComboUploads] = useState<{ [key: string]: File[] }>({});
  
  // Track existing combinations mapping for isolated deletion & saving
  const [existingComboMap, setExistingComboMap] = useState<Record<string, string[]>>(() => {
    const map: Record<string, string[]> = {};
    if (product.combinations) {
      product.combinations.forEach((c: any) => {
        map[c.key] = c.imageUrls || [];
      });
    }
    return map;
  });
  
  const [comboSavingStates, setComboSavingStates] = useState<Record<string, "saving" | "success" | "error" | "none">>({});

  const [useCoverForHover, setUseCoverForHover] = useState(false); // In edit mode, usually user can change them independently

  const addGalleryFiles = async (newFiles: FileList | null) => {
    if (!newFiles) return;
    const webpFiles = await Promise.all(Array.from(newFiles).map((f, i) => compressImageToWebp(f, name || 'product', galleryFiles.length + i)));
    setGalleryFiles((prev) => [...prev, ...webpFiles]);
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
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingGalleryFile = (index: number) => {
    setExistingGalleryUrls((prev) => prev.filter((_, i) => i !== index));
  };


  // Variant state
  const initialColors = product.variants?.filter((v: any) => v.type === "color").map((v: any) => ({ label: v.label })) || [];
  const initialDimensions = product.variants?.filter((v: any) => v.type === "dimension").map((v: any) => ({ label: v.label })) || [];
  const initialCapacity = product.variants?.filter((v: any) => v.type === "capacity").map((v: any) => ({ label: v.label })) || [];

  const [hasColors, setHasColors] = useState(initialColors.length > 0);
  const [colors, setColors] = useState<VariantOption[]>(initialColors);
  const [colorInput, setColorInput] = useState("");

  const [hasDimensions, setHasDimensions] = useState(initialDimensions.length > 0);
  const [dimensions, setDimensions] = useState<VariantOption[]>(initialDimensions);
  const [dimInput, setDimInput] = useState("");

  const [hasCapacity, setHasCapacity] = useState(initialCapacity.length > 0);
  const [capacity, setCapacity] = useState<VariantOption[]>(initialCapacity);
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
    if (!name.trim()) {
      alert("Product name is required.");
      return;
    }

    startTransition(async () => {
      try {
        const variants = [
          ...colors.map((c) => ({ type: "color", label: c.label })),
          ...dimensions.map((d) => ({ type: "dimension", label: d.label })),
          ...capacity.map((c) => ({ type: "capacity", label: c.label })),
        ];

        const variantCombinations = combinations.map((key) => ({ key }));

        // Pass whatever is in the live map as the new "existing" to updateProduct so we don't clobber it
        const existingCombinationsList = combinations.map((cKey) => ({
          key: cKey,
          imageUrls: existingComboMap[cKey] || [],
        }));

        // Flatten combo files
        const comboImageKeys: string[] = [];
        const comboImageFiles: File[] = [];
        Object.entries(comboUploads).forEach(([key, files]) => {
          files.forEach(f => {
            comboImageKeys.push(key);
            comboImageFiles.push(f);
          });
        });

        await updateProduct(product.id, {
          name,
          categoryId: category,
          moq,
          price,
          specifications: JSON.stringify({ description: spec, features }),
          coverImageFile: coverFile,
          hoverImageFile: useCoverForHover ? coverFile : hoverFile,
          galleryFiles,
          existingGalleryUrls,
          variants: JSON.stringify(variants),
          variantCombinations: JSON.stringify(variantCombinations),
          comboImageKeys: JSON.stringify(comboImageKeys),
          comboImageFiles,
          existingVariantCombinations: JSON.stringify(existingCombinationsList),
        });

        setSaveStatus("success");
        setTimeout(() => router.push("/admin/products"), 1200);
      } catch (e) {
        console.error(e);
        setSaveStatus("error");
      }
    });
  };

  const handleSaveComboRow = async (comboKey: string) => {
    setComboSavingStates(prev => ({ ...prev, [comboKey]: "saving" }));
    try {
      const keptUrls = existingComboMap[comboKey] || [];
      const filesToUpload = comboUploads[comboKey] || [];
      
      const uploadPromises = filesToUpload.map(async (file) => {
        const uploadForm = new FormData();
        uploadForm.append("file", file);
        uploadForm.append("prefix", `products/${product.id}/combinations`);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: uploadForm,
        });

        if (!res.ok) throw new Error("Upload failed");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = await res.json() as any;
        return data.url;
      });

      const newUrls = await Promise.all(uploadPromises);
      const finalUrls = [...keptUrls, ...newUrls];

      const res = await updateCombinationImages(product.id, comboKey, finalUrls);
      
      if (res.success && res.finalUrls) {
        setExistingComboMap(prev => ({ ...prev, [comboKey]: res.finalUrls! }));
        setComboUploads(prev => ({ ...prev, [comboKey]: [] })); // clear pending files
        setComboSavingStates(prev => ({ ...prev, [comboKey]: "success" }));
        setTimeout(() => setComboSavingStates(prev => ({ ...prev, [comboKey]: "none" })), 2000);
      } else {
        setComboSavingStates(prev => ({ ...prev, [comboKey]: "error" }));
      }
    } catch (e) {
      console.error(e);
      setComboSavingStates(prev => ({ ...prev, [comboKey]: "error" }));
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between sticky top-0 bg-gray-50/95 backdrop-blur-md z-50 py-4 border-b border-gray-200 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] mx-[-1rem] px-[1rem] md:mx-0 md:px-0">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 text-gray-500 hover:text-secondary transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-heading font-bold text-secondary">Edit Product</h1>
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
            <><Save className="w-5 h-5" /> Update Product</>
          )}
        </button>
      </div>

      {saveStatus === "error" && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-sm text-sm font-medium">
          Failed to save product. Please check your connection and try again.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
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
          </div>

          <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100">
            <h2 className="text-lg font-heading font-bold text-secondary mb-6 border-b border-gray-100 pb-4">Variant Options</h2>
            <div className="space-y-8">
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

              <div className="mt-6 border-t border-gray-100 pt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Product Specifications (Description)</label>
                <textarea rows={5} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all resize-y mb-6" placeholder="Add commercial-grade specifications here..." value={spec} onChange={(e) => setSpec(e.target.value)} />

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
          </div>

          {/* Variant Combination Images (Edit Mode - Upload Active!) */}
          {combinations.length > 0 && (
            <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100">
              <h2 className="text-lg font-heading font-bold text-secondary mb-6 border-b border-gray-100 pb-4">Variant Specific Images</h2>
              <p className="text-sm text-gray-500 mb-6">Attach specific images to uniquely selected variants. These will load dynamically when the user selects this exact combination.</p>
              <div className="space-y-6">
                {combinations.map((combo) => {
                  const existingImages = existingComboMap[combo] || [];
                  const pendingImages = comboUploads[combo] || [];
                  const rState = comboSavingStates[combo] || "none";
                  const originalImagesLength = product.combinations?.find((c: any) => c.key === combo)?.imageUrls?.length || 0;
                  const hasChanges = pendingImages.length > 0 || existingImages.length !== originalImagesLength;

                  return (
                    <div key={combo} className="p-5 border border-gray-100 rounded-sm bg-gray-50/50">
                      <div className="flex items-center justify-between mb-4">
                        <span className="bg-white text-secondary text-sm font-bold px-4 py-2 border border-gray-200 rounded-sm shadow-sm">
                          {combo.replace(/color:|dimension:|capacity:/g, "").replace(/\|/g, " + ")}
                        </span>
                        
                        <div className="flex gap-2">
                          {/* Save Isolated Button */}
                          <button
                            type="button"
                            disabled={!hasChanges && rState !== "error" || rState === "saving"}
                            onClick={() => handleSaveComboRow(combo)}
                            className={`px-3 py-1.5 rounded-sm text-xs font-semibold shadow-sm flex items-center gap-1 transition-colors
                              ${rState === "saving" ? "bg-gray-200 text-gray-500 cursor-not-allowed" : 
                                rState === "success" ? "bg-green-600 border-green-600 text-white" :
                                hasChanges ? "bg-secondary text-white hover:bg-primary" : "bg-white border-gray-200 text-gray-400 cursor-not-allowed border"
                              }
                            `}
                          >
                            {rState === "saving" ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving</> :
                             rState === "success" ? <><CheckCircle className="w-3.5 h-3.5" /> Saved</> :
                             <><Save className="w-3.5 h-3.5" /> Save Images</>}
                          </button>

                          {/* Upload Input */}
                          <label className="bg-white border border-gray-200 hover:border-primary text-gray-700 hover:text-primary px-3 py-1.5 rounded-sm text-xs font-semibold cursor-pointer transition-colors shadow-sm flex items-center gap-1">
                            <UploadCloud className="w-3.5 h-3.5" /> Select Images
                            <input 
                              type="file" 
                              accept="image/*" 
                              multiple 
                              className="hidden" 
                              onChange={async (e) => {
                                if (e.target.files) {
                                  const webpFiles = await Promise.all(Array.from(e.target.files).map((f, i) => compressImageToWebp(f, `${name || 'product'}-${combo.replace(/[^a-zA-Z0-9]+/g, '-')}`, (comboUploads[combo] || []).length + i)));
                                  setComboUploads(prev => ({
                                    ...prev,
                                    [combo]: [...(prev[combo] || []), ...webpFiles]
                                  }));
                                }
                              }} 
                             />
                          </label>
                        </div>
                      </div>

                      {/* Display existing & new images */}
                      {(existingImages.length > 0 || pendingImages.length > 0) ? (
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                          {existingImages.map((url: string, i: number) => (
                            <div key={`ex-${i}`} className="relative group rounded-sm overflow-hidden h-16 w-16 border border-gray-200">
                              <img src={url} alt="Variant" className="w-full h-full object-cover" />
                              <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-[9px] text-white text-center py-0.5">Live</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setExistingComboMap(prev => ({
                                    ...prev,
                                    [combo]: prev[combo].filter((_, idx) => idx !== i)
                                  }));
                                  // Mark as hasChanges? We don't need a specific trigger, hasChanges will be active or user can click save if they modify it
                                  // Actually let's automatically trigger a save or allow them to click Save Images.
                                  // We will allow them to click Save Images. Wait, hasChanges only checks pendingImages. 
                                  // I will just let the main form handle existing deletion, OR they can upload one to save. 
                                  // Actually, changing existingComboMap means the MAIN Update Product will save it!
                                }}
                                className="absolute top-0.5 right-0.5 bg-black/60 hover:bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                          {pendingImages.map((file: File, i: number) => (
                            <div key={`new-${i}`} className="relative group rounded-sm overflow-hidden h-16 w-16 border border-primary">
                              <img src={URL.createObjectURL(file)} alt="Variant new" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => {
                                  setComboUploads(prev => ({
                                    ...prev,
                                    [combo]: prev[combo].filter((_, idx) => idx !== i)
                                  }));
                                }}
                                className="absolute top-0.5 right-0.5 bg-black/60 hover:bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs text-gray-400 italic px-2">No variant-specific images. Defaults to main gallery.</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 sticky top-6">
            <h2 className="text-lg font-heading font-bold text-secondary mb-6 border-b border-gray-100 pb-4">Product Images</h2>
            <div className="space-y-6">

              {/* Cover Image */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Cover Image *</h3>
                <label className="border-2 border-dashed border-gray-300 rounded-sm bg-gray-50 flex flex-col items-center justify-center h-36 hover:bg-gray-100 hover:border-primary transition-all cursor-pointer group mb-3 relative overflow-hidden">
                  {coverFile ? (
                    <img src={URL.createObjectURL(coverFile)} alt="Cover preview" className="w-full h-full object-cover rounded-sm" />
                  ) : product.coverImage ? (
                    <img src={product.coverImage} alt="Cover existing" className="w-full h-full object-cover rounded-sm" />
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-5 h-5 text-primary" />
                      </div>
                      <p className="font-semibold text-gray-700 text-sm">Upload Cover</p>
                    </div>
                  )}
                  {/* Hover overlay text */}
                  {(coverFile || product.coverImage) && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-sm">
                      <span className="text-white text-xs font-semibold">Change Image</span>
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
                  <label className="border-2 border-dashed border-gray-300 rounded-sm bg-gray-50 flex flex-col items-center justify-center h-36 hover:bg-gray-100 hover:border-primary transition-all cursor-pointer group relative overflow-hidden">
                    {hoverFile ? (
                      <img src={URL.createObjectURL(hoverFile)} alt="Hover preview" className="w-full h-full object-cover rounded-sm" />
                    ) : product.hoverImage ? (
                      <img src={product.hoverImage} alt="Hover existing" className="w-full h-full object-cover rounded-sm" />
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                          <UploadCloud className="w-5 h-5 text-primary" />
                        </div>
                        <p className="font-semibold text-gray-700 text-sm">Upload Hover</p>
                      </div>
                    )}
                    {(hoverFile || product.hoverImage) && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-sm">
                        <span className="text-white text-xs font-semibold">Change Image</span>
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
                  
                  {existingGalleryUrls.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {existingGalleryUrls.map((url: string, idx: number) => (
                        <div key={idx} className="relative group rounded-sm overflow-hidden h-20">
                          <img src={url} alt={`Gallery ex ${idx}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeExistingGalleryFile(idx)}
                            className="absolute top-1 right-1 bg-black/60 hover:bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {galleryFiles.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {galleryFiles.map((file, idx) => (
                        <div key={idx} className="relative group rounded-sm overflow-hidden h-20">
                          <img src={URL.createObjectURL(file)} alt={`Gallery new ${idx}`} className="w-full h-full object-cover" />
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

                  <label className="border-2 border-dashed border-gray-300 rounded-sm bg-gray-50 flex flex-col items-center justify-center py-5 hover:bg-gray-100 hover:border-primary transition-all cursor-pointer group">
                    <div className="w-9 h-9 bg-white rounded-full shadow-sm flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                      <Plus className="w-4 h-4 text-primary" />
                    </div>
                    <p className="font-semibold text-gray-700 text-sm">
                      {(galleryFiles.length > 0 || existingGalleryUrls.length > 0) ? "Add More Images" : "Add Gallery Images"}
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
