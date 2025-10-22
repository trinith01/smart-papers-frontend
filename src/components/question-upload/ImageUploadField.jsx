"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { ImageIcon, FileImage } from "lucide-react"

export default function ImageUploadField({ 
  id, 
  label, 
  preview, 
  onImageChange, 
  onImageRemove,
  required = false 
}) {
  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result
        onImageChange(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemove = (e) => {
    e.stopPropagation()
    onImageRemove()
  }

  return (
    <div className="space-y-2">
      <Label
        htmlFor={id}
        className="text-sm font-medium text-gray-700 flex items-center gap-2"
      >
        <ImageIcon className="w-4 h-4 text-purple-600" />
        {label}
      </Label>
      <div className="space-y-3">
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor={`${id}File`}
            className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors overflow-hidden"
          >
            {preview ? (
              <>
                <img
                  src={preview}
                  alt={`${label} preview`}
                  className="absolute inset-0 object-cover w-full h-full"
                />
                <button
                  type="button"
                  className="absolute top-2 right-2 z-10 bg-red-500 text-white text-xs px-2 py-1 rounded shadow"
                  onClick={handleRemove}
                >
                  Remove
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center pt-5 pb-6 z-10">
                <FileImage className="w-8 h-8 mb-2 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> {label.toLowerCase()}
                </p>
                <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 10MB)</p>
              </div>
            )}
            <input
              id={`${id}File`}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              required={required && !preview}
            />
          </label>
        </div>
      </div>
    </div>
  )
}
