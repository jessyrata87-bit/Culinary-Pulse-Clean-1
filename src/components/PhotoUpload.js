import React, { useRef, useState } from "react";
import { api, fileUrl } from "@/lib/api";
import { Camera, Loader2, X } from "lucide-react";
import { toast } from "sonner";

export function PhotoUpload({ label, value, onChange, testid }) {
  const ref = useRef();
  const [busy, setBusy] = useState(false);

  const handle = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { data } = await api.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      onChange(data.path);
      toast.success("Photo uploaded");
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-1.5">
      {label && <p className="text-sm font-medium text-muted-foreground">{label}</p>}
      {value ? (
        <div className="relative group w-full">
          <img src={fileUrl(value)} alt={label} className="w-full h-40 object-cover rounded-xl border" />
          <button type="button" data-testid={`${testid}-remove`} onClick={() => onChange("")}
            className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition">
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button type="button" data-testid={testid} onClick={() => ref.current?.click()} disabled={busy}
          className="w-full h-40 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition bg-secondary/40">
          {busy ? <Loader2 className="w-6 h-6 animate-spin" /> : <Camera className="w-6 h-6" />}
          <span className="text-sm">{busy ? "Uploading..." : "Take / upload photo"}</span>
        </button>
      )}
      <input ref={ref} type="file" accept="image/*,application/pdf" capture="environment" className="hidden" onChange={handle} />
    </div>
  );
}
