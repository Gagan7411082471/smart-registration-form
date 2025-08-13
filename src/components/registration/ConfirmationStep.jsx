'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, Download, Edit } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast'; 

export function ConfirmationStep({ formData, prevStep, nextStep }) {
  const summaryRef = useRef(null);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDownloadPdf = () => {
    const input = summaryRef.current;
    if (input) {
      html2canvas(input, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'px', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const ratio = canvasWidth / canvasHeight;
        const width = pdfWidth;
        const height = width / ratio;
        
        let finalHeight = height > pdfHeight ? pdfHeight : height;
        
        pdf.addImage(imgData, 'PNG', 0, 0, width, finalHeight);
        pdf.save('registration-summary.pdf');
      });
    }
  };
  
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Create a copy of the formData to avoid state mutations
      const submissionData = { ...formData };
      // Format the date of birth to a string for easier backend handling
      submissionData.dateOfBirth = format(submissionData.dateOfBirth, 'yyyy-MM-dd');
      
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Registration failed');
      }

      // Show success toast and move to the next step
      toast({
        title: 'Registration Successful',
        description: result.message,
        variant: 'success',
      });
      nextStep();
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: 'Registration Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full shadow-2xl shadow-primary/10">
      <CardHeader>
        <CardTitle className="font-headline text-3xl text-center">Confirm Your Details</CardTitle>
        <CardDescription className="text-center">Please review your registration summary below.</CardDescription>
      </CardHeader>
      <CardContent ref={summaryRef} className="p-6 space-y-6 bg-card">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Image
              src={formData.photo}
              alt="User photo"
              width={150}
              height={200}
              className="rounded-lg object-cover border-4 border-white shadow-lg"
              data-ai-hint="person portrait"
            />
          <div className="flex-1 space-y-4 text-center sm:text-left">
            <h2 className="text-2xl font-bold font-headline text-primary">{formData.fullName}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Phone:</strong> {formData.phoneNumber}</p>
              <p><strong>Date of Birth:</strong> {format(formData.dateOfBirth, 'MMMM d, yyyy')}</p>
              <p><strong>Gender:</strong> {capitalize(formData.gender)}</p>
              <p className="md:col-span-2"><strong>University:</strong> {formData.university}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col-reverse sm:flex-row justify-between gap-4">
        <Button variant="outline" onClick={prevStep}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Details
        </Button>
        <div className="flex gap-4">
            <Button variant="secondary" onClick={handleDownloadPdf}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                    'Submitting...'
                ) : (
                    <>
                        Confirm & Submit
                        <Check className="ml-2 h-4 w-4" />
                    </>
                )}
            </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
