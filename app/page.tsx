"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { ImageUploader } from "@/components/image-uploader"
import { EffectControls } from "@/components/effect-controls"
import { ImageCanvas, type ImageCanvasHandle } from "@/components/image-canvas"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Download, Video, RotateCcw, Loader2, Github, Info } from "lucide-react"

type RecordingState = "idle" | "recording" | "done"

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<HTMLImageElement | null>(null)
  const [halftoneSize, setHalftoneSize] = useState(4)
  const [contrast, setContrast] = useState(1.5)
  const [accentColor, setAccentColor] = useState("#00d9ff")
  const [mouseRadius, setMouseRadius] = useState(100)
  const [repulsionStrength, setRepulsionStrength] = useState(1.0)
  const [returnSpeed, setReturnSpeed] = useState(0.3)
  const [accentProbability, setAccentProbability] = useState(0.03)
  const [sizeVariation, setSizeVariation] = useState(0.3)
  const canvasHandleRef = useRef<ImageCanvasHandle>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Recording state
  const [recordingState, setRecordingState] = useState<RecordingState>("idle")
  const [recordingProgress, setRecordingProgress] = useState(0)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const isFormingRef = useRef(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const progressIntervalRef = useRef<ReturnType<typeof setInterval>>()

  useEffect(() => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      setUploadedImage(img)
    }
    img.src = "/IMG_0136.jpg"
  }, [])

  const handleImageUpload = (image: HTMLImageElement) => {
    setUploadedImage(image)
    setRecordingState("idle")
    setVideoUrl(null)
    setRecordingProgress(0)
    isFormingRef.current = true
  }

  const handleFormationComplete = useCallback(() => {
    isFormingRef.current = false
  }, [])

  const handleDownloadImage = () => {
    const canvas = canvasHandleRef.current?.canvas
    if (!canvas) return
    const link = document.createElement("a")
    link.download = "shader-effect.png"
    link.href = canvas.toDataURL()
    link.click()
  }

  const handleReplay = () => {
    if (!canvasHandleRef.current) return
    isFormingRef.current = true
    canvasHandleRef.current.startFormation()
  }

  const handleRecordVideo = useCallback(() => {
    const canvas = canvasHandleRef.current?.canvas
    if (!canvas) return

    // Clean up previous URL
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl)
      setVideoUrl(null)
    }

    chunksRef.current = []
    setRecordingState("recording")
    setRecordingProgress(0)

    // Start the formation animation
    isFormingRef.current = true
    canvasHandleRef.current.startFormation()

    // Capture the canvas stream at 30fps
    const stream = canvas.captureStream(30)
    const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
      ? "video/webm;codecs=vp9"
      : "video/webm"

    const recorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: 5_000_000,
    })

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data)
      }
    }

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mimeType })
      const url = URL.createObjectURL(blob)
      setVideoUrl(url)
      setRecordingState("done")
      setRecordingProgress(100)

      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }

    mediaRecorderRef.current = recorder
    recorder.start(100) // Collect data every 100ms

    // Progress timer
    const duration = 8000
    const startTime = performance.now()
    progressIntervalRef.current = setInterval(() => {
      const elapsed = performance.now() - startTime
      const progress = Math.min(100, (elapsed / duration) * 100)
      setRecordingProgress(progress)
    }, 50)

    // Stop recording after formation completes plus a small buffer
    setTimeout(() => {
      if (recorder.state === "recording") {
        recorder.stop()
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }, duration + 500)
  }, [videoUrl])

  const handleDownloadVideo = () => {
    if (!videoUrl) return
    const link = document.createElement("a")
    link.download = "particle-formation.webm"
    link.href = videoUrl
    link.click()
  }

  const handleUploadNewImage = () => {
    fileInputRef.current?.click()
  }

  // Clean up blob URL on unmount
  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl)
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [videoUrl])

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-10 text-center">
          <h1 className="text-5xl font-bold text-white mb-3 text-glow tracking-tight">Partixel</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_400px] gap-4 lg:gap-6">
          <div className="space-y-4 order-1">
            {!uploadedImage ? (
              <ImageUploader onImageUpload={handleImageUpload} />
            ) : (
              <>
                <ImageCanvas
                  ref={canvasHandleRef}
                  image={uploadedImage}
                  halftoneSize={halftoneSize}
                  contrast={contrast}
                  accentColor={accentColor}
                  mouseRadius={mouseRadius}
                  repulsionStrength={repulsionStrength}
                  returnSpeed={returnSpeed}
                  accentProbability={accentProbability}
                  sizeVariation={sizeVariation}
                  onFormationComplete={handleFormationComplete}
                />

                {/* Recording progress */}
                {recordingState === "recording" && (
                  <div className="glass-card p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="relative flex items-center justify-center">
                        <span className="absolute h-3 w-3 rounded-full bg-red-500 animate-ping opacity-75 shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                        <span className="relative h-3 w-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                      </div>
                      <span className="text-sm font-medium text-white/90">
                        Recording... {Math.round(recordingProgress)}%
                      </span>
                    </div>
                    <Progress value={recordingProgress} />
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                  <Button onClick={handleDownloadImage} variant="outline" className="gap-2 flex-1 sm:flex-none min-w-[120px]">
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Download</span>
                    <span className="sm:hidden">Save</span>
                  </Button>

                  <Button
                    onClick={handleReplay}
                    variant="outline"
                    className="gap-2"
                    disabled={recordingState === "recording"}
                  >
                    <RotateCcw className="w-4 h-4" />
                    Replay
                  </Button>

                  <Button
                    onClick={handleRecordVideo}
                    className="gap-2"
                    disabled={recordingState === "recording"}
                  >
                    {recordingState === "recording" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Video className="w-4 h-4" />
                    )}
                    {recordingState === "recording" ? "Recording..." : "Record"}
                  </Button>

                  {recordingState === "done" && videoUrl && (
                    <Button onClick={handleDownloadVideo} className="gap-2 bg-green-600 hover:bg-green-700 text-white">
                      <Download className="w-4 h-4" />
                      Get Video
                    </Button>
                  )}

                  <Button variant="outline" onClick={handleUploadNewImage} className="flex-1 sm:flex-none">
                    New Image
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      const reader = new FileReader()
                      reader.onload = (event) => {
                        const img = new Image()
                        img.crossOrigin = "anonymous"
                        img.onload = () => handleImageUpload(img)
                        img.src = event.target?.result as string
                      }
                      reader.readAsDataURL(file)
                    }}
                  />
                </div>
              </>
            )}
          </div>

          {uploadedImage && (
            <div className="order-2 lg:order-2">
              <EffectControls
                halftoneSize={halftoneSize}
                contrast={contrast}
                accentColor={accentColor}
                mouseRadius={mouseRadius}
                repulsionStrength={repulsionStrength}
                returnSpeed={returnSpeed}
                accentProbability={accentProbability}
                sizeVariation={sizeVariation}
                onHalftoneSizeChange={setHalftoneSize}
                onContrastChange={setContrast}
                onAccentColorChange={setAccentColor}
                onMouseRadiusChange={setMouseRadius}
                onRepulsionStrengthChange={setRepulsionStrength}
                onReturnSpeedChange={setReturnSpeed}
                onAccentProbabilityChange={setAccentProbability}
                onSizeVariationChange={setSizeVariation}
              />
            </div>
          )}
        </div>
        <footer className="mt-16 py-8 text-center text-lg text-white/70 flex items-center justify-center gap-6">
          <a
            href="https://github.com/freyazou"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 hover:text-white transition-colors"
          >
            <Github className="w-6 h-6" />
            <span className="font-medium">freyazou</span>
          </a>

          <Dialog>
            <DialogTrigger asChild>
              <button className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-base">
                <Info className="w-5 h-5" />
                About
              </button>
            </DialogTrigger>
            <DialogContent className="glass-card border-white/20 max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-white">About Partixel</DialogTitle>
                <DialogDescription className="text-white/70">
                  Transform images into interactive particle halftone formations.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 text-white/80 py-4">
                <p>
                  Partixel converts your images into dynamic particle systems.
                  Each pixel becomes a physical particle that responds to your touch.
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-white/60">
                  <li>Upload any image to transform</li>
                  <li>Particles react to mouse/touch movement</li>
                  <li>Customize colors, sizes, and physics</li>
                  <li>Record and download animations</li>
                </ul>
                <p className="text-sm text-white/50 pt-2">
                  Built with Next.js, React, and HTML5 Canvas.
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </footer>
      </div>
    </main>
  )
}
