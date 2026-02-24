"use client"

import type React from "react"

import { useCallback } from "react"
import { Upload } from "lucide-react"
import { Card } from "@/components/ui/card"

interface ImageUploaderProps {
  onImageUpload: (image: HTMLImageElement) => void
}

export function ImageUploader({ onImageUpload }: ImageUploaderProps) {
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (event) => {
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => {
          onImageUpload(img)
        }
        img.src = event.target?.result as string
      }
      reader.readAsDataURL(file)
    },
    [onImageUpload],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      const file = e.dataTransfer.files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (event) => {
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => {
          onImageUpload(img)
        }
        img.src = event.target?.result as string
      }
      reader.readAsDataURL(file)
    },
    [onImageUpload],
  )

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  return (
    <Card
      className="glass-card border-2 border-dashed border-white/20 hover:border-cyan-400/50 transition-all duration-300 cursor-pointer group"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <label className="flex flex-col items-center justify-center min-h-[500px] cursor-pointer p-8">
        <div className="w-20 h-20 rounded-2xl glass-button flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
          <Upload className="w-10 h-10 text-cyan-400" />
        </div>
        <h3 className="text-2xl font-semibold text-white mb-2">Upload an image</h3>
        <p className="text-white/50 text-center mb-4">Drag and drop or click to select</p>
        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
      </label>
    </Card>
  )
}
