"use client";

import { useState } from "react";
import { Plus, Trash, Loader2, ArrowUp, ArrowDown } from "lucide-react";
import { createTeamMember, deleteTeamMember, updateTeamOrder } from "@/app/actions/team";
import { compressImageToWebp } from "@/lib/image-compressor";

type Member = { id: string; name: string; role: string; image: string };

export default function TeamClient({ initialMembers }: { initialMembers: Member[] }) {
    const [members, setMembers] = useState<Member[]>(initialMembers);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !role || !file) return alert("Please fill all fields");

        setIsSubmitting(true);
        try {
            // Compress Image and Name it dynamically
            const compressedWebp = await compressImageToWebp(file, `team-${name}`);
            
            // Upload to R2 via generic Upload API
            const formData = new FormData();
            formData.append("file", compressedWebp);
            formData.append("path", `team/${Date.now()}`);

            const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
            const uploadData: any = await uploadRes.json();
            
            if (!uploadRes.ok) throw new Error("Upload failed");

            // Attach DB Logic
            await createTeamMember({
                name,
                role,
                image: uploadData.url
            });

            // Optimistic Client Update
            setMembers([...members, { id: Date.now().toString(), name, role, image: uploadData.url }]);
            setName("");
            setRole("");
            setFile(null);
            alert("Team member added!");
        } catch (e: any) {
            alert(e.message || "Failed to add team member");
        }
        setIsSubmitting(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Remove this team member?")) return;
        setMembers(members.filter(m => m.id !== id));
        await deleteTeamMember(id);
        alert("Team member removed!");
    };

    const handleMove = async (index: number, direction: "up" | "down") => {
        if (direction === "up" && index === 0) return;
        if (direction === "down" && index === members.length - 1) return;

        const newMembers = [...members];
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        
        // Swap
        const temp = newMembers[index];
        newMembers[index] = newMembers[targetIndex];
        newMembers[targetIndex] = temp;

        setMembers(newMembers);

        // Build order payload mapping 1-based index to avoid 0 defaults logic overlaps if needed
        const updates = newMembers.map((m, i) => ({ id: m.id, newOrder: i }));
        await updateTeamOrder(updates);
    };

    return (
        <div className="max-w-7xl mx-auto py-10">
            <h1 className="text-3xl font-heading font-bold text-secondary mb-8">Manage Team</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Add Form */}
                <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold font-heading mb-6">Add New Member</h2>
                    <form onSubmit={handleAdd} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Name</label>
                            <input
                                required
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-primary focus:ring-1 focus:ring-primary"
                                placeholder="e.g. John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">Role Title</label>
                            <input
                                required
                                value={role}
                                onChange={e => setRole(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-primary focus:ring-1 focus:ring-primary"
                                placeholder="e.g. CEO"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">Profile Image</label>
                            <input
                                required
                                type="file"
                                accept="image/*"
                                onChange={e => setFile(e.target.files?.[0] || null)}
                                className="w-full bg-gray-50 border border-gray-200 py-3 px-4 rounded-sm text-sm p-4 h-auto cursor-pointer file:cursor-pointer file:bg-gray-200 file:border-none file:px-4 file:py-2 file:rounded-sm file:mr-4 file:font-semibold"
                            />
                            <p className="text-xs text-gray-400 mt-2">Optimal: 1:1 Square Ratio. Will be automatically optimized to WebP.</p>
                        </div>
                        
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-primary hover:bg-[#B41561] text-white font-bold py-3 px-4 rounded-sm w-full transition flex items-center justify-center gap-2 mt-4"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : <><Plus className="w-5 h-5"/> Add Member</>}
                        </button>
                    </form>
                </div>

                {/* Team List */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold font-heading mb-6">Current Roster</h2>
                    {members.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-sm border border-gray-100">
                            No team members added yet.
                        </div>
                    ) : (
                        members.map(member => (
                            <div key={member.id} className="bg-white p-4 flex items-center gap-4 rounded-sm shadow-sm border border-gray-100">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={member.image} alt={member.name} className="w-16 h-16 rounded-full object-cover border border-gray-200" />
                                <div className="flex-grow">
                                    <h3 className="font-bold text-secondary text-lg">{member.name}</h3>
                                    <p className="text-sm text-primary uppercase font-bold tracking-wider">{member.role}</p>
                                </div>
                                <div className="flex items-center flex-col gap-1 mr-2">
                                    <button 
                                        onClick={() => handleMove(members.indexOf(member), "up")}
                                        disabled={members.indexOf(member) === 0}
                                        className="p-1 text-gray-400 hover:text-primary disabled:opacity-30 transition"
                                    >
                                        <ArrowUp className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => handleMove(members.indexOf(member), "down")}
                                        disabled={members.indexOf(member) === members.length - 1}
                                        className="p-1 text-gray-400 hover:text-primary disabled:opacity-30 transition"
                                    >
                                        <ArrowDown className="w-4 h-4" />
                                    </button>
                                </div>
                                <button
                                    onClick={() => handleDelete(member.id)}
                                    className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-sm transition flex-shrink-0 ml-2"
                                >
                                    <Trash className="w-5 h-5" />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
