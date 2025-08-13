'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Camera, Upload, UserCheck, Video, VideoOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export function PhotoCapture({ form }) {
  const [mode, setMode] = useState('upload');
  const [hasCameraPermission, setHasCameraPermission] = useState(true);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    async function setupCamera() {
      if (mode === 'camera') {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setHasCameraPermission(true);
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description: 'Please enable camera permissions in your browser settings.',
          });
        }
      } else {
        // Stop camera stream when switching away
        if (videoRef.current && videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject;
          stream.getTracks().forEach(track => track.stop());
          videoRef.current.srcObject = null;
        }
      }
    }
    setupCamera();
  }, [mode, toast]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (file.size > 4 * 1024 * 1024) { // 4MB limit
        toast({
            title: "File too large",
            description: "Please upload an image smaller than 4MB.",
            variant: "destructive",
        });
        return;
    }

    const reader = new FileReader();
    reader.onload = e => {
      const imageUrl = e.target?.result;
      form.setValue('photo', imageUrl, { shouldValidate: true });
    };
    reader.readAsDataURL(file);
  };
  
  const handleCapture = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageUrl = canvas.toDataURL('image/jpeg');
    form.setValue('photo', imageUrl, { shouldValidate: true });
    setMode('upload'); // Switch back to upload mode after capture
  }
  
  const handleUploadClick = () => {
    setMode('upload');
    fileInputRef.current?.click();
  }

  const photoValue = form.watch('photo');

  return (
    <FormField
      control={form.control}
      name="photo"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Your Photo</FormLabel>
          <FormControl>
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-full md:w-1/3 flex flex-col items-center gap-4">
                 <div className="w-48 h-64 rounded-lg bg-muted flex items-center justify-center overflow-hidden border-2 border-dashed">
                    {photoValue ? (
                        <Image src={photoValue} alt="User photo" width={192} height={256} className="object-cover w-full h-full" />
                    ) : (
                        <UserCheck className="w-16 h-16 text-muted-foreground" />
                    )}
                 </div>

              </div>
              <div className="w-full md:w-2/3 space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <Button type="button" variant={mode === 'upload' ? 'default' : 'outline'} onClick={handleUploadClick} >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload
                    </Button>
                    <Button type="button" variant={mode === 'camera' ? 'default' : 'outline'} onClick={() => setMode('camera')}>
                        <Video className="mr-2 h-4 w-4" />
                        Camera
                    </Button>
                  </div>

                <div className={cn("transition-all duration-300", mode === 'upload' ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden')}>
                     <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/png, image/jpeg, image/webp" />
                     <p className="text-xs text-muted-foreground mt-2 text-center">Max 4MB. PNG, JPG, WEBP.</p>
                </div>
                
                <div className={cn("space-y-4 transition-all duration-300", mode === 'camera' ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden')}>
                     <div className="relative w-full aspect-[4/3] bg-muted rounded-md overflow-hidden border">
                       <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                     </div>
                     {!hasCameraPermission && (
                       <Alert variant="destructive">
                         <VideoOff className="h-4 w-4" />
                         <AlertTitle>Camera Access Required</AlertTitle>
                         <AlertDescription>
                           Please allow camera access in your browser.
                         </AlertDescription>
                       </Alert>
                     )}
                     <Button type="button" onClick={handleCapture} disabled={!hasCameraPermission} className="w-full">
                       <Camera className="mr-2 h-4 w-4" />
                       Take Photo
                     </Button>
                </div>
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
} 
