'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AnimatePresence, motion } from 'framer-motion';

import { FormStep } from './FormStep';
import { ConfirmationStep } from './ConfirmationStep';
import { SuccessStep } from './SuccessStep';

const formSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: 'Please enter a valid phone number.' }),
  dateOfBirth: z.date({ required_error: 'Date of birth is required.' }).refine(date => date < new Date(), { message: 'Date of birth must be in the past.' }),
  university: z.string().min(3, { message: 'University name is required.' }),
  gender: z.enum(['male', 'female', 'other'], { required_error: 'Please select a gender.' }),
  photo: z.string().refine(val => val.startsWith('data:image/'), { message: 'A passport-style photo is required.' }),
});

export function RegistrationPortal() {
  const [step, setStep] = useState(1);

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    // Define all default values upfront to prevent the "uncontrolled to controlled" error
    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      dateOfBirth: null,
      university: '',
      gender: '',
      photo: '',
    },
  });

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const reset = () => {
    // Calling reset() with no arguments resets the form to its defaultValues
    form.reset();
    setStep(1);
  };
  
  const clearForm = () => {
    // Same for clearForm, just reset to the defaults
    form.reset();
  }

  return (
    <div className="w-full max-w-4xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {step === 1 && <FormStep form={form} nextStep={nextStep} clearForm={clearForm} />}
          {step === 2 && <ConfirmationStep formData={form.getValues()} prevStep={prevStep} nextStep={nextStep} />}
          {step === 3 && <SuccessStep reset={reset} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
