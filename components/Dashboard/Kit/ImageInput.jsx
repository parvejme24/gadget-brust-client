"use client";

import { useRef, useState } from "react";
import { ImagePlus, Upload } from "lucide-react";
import { toast } from "sonner";
import { adminService } from "@/lib/services/adminService";
import { Button } from "./Button";
import { Field, inputClass } from "./Form";

// paste a URL or upload a file
export function ImageInput({ value, onChange, label = "Image", hint }) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const upload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await adminService.uploadImage(file);
      if (!url) throw new Error("Upload failed");
      onChange(url);
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Upload failed. Paste an image URL instead.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <Field label={label} hint={hint}>
      <div className="flex gap-3">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-gray-300 bg-gray-50">
          {value ? <img src={value} alt="" className="h-full w-full object-contain p-1.5" /> : <ImagePlus className="h-6 w-6 text-gray-300" />}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <input value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder="https://… image URL" className={inputClass} />
          <div className="flex gap-2">
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => upload(e.target.files?.[0])} />
            <Button type="button" variant="secondary" size="sm" loading={uploading} onClick={() => fileRef.current?.click()}>
              {!uploading && <Upload className="h-3.5 w-3.5" />} Upload file
            </Button>
            {value && (
              <Button type="button" variant="ghost" size="sm" onClick={() => onChange("")}>
                Remove
              </Button>
            )}
          </div>
        </div>
      </div>
    </Field>
  );
}
