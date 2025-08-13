'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, RefreshCw } from 'lucide-react';

export function SuccessStep({ reset }) {
  return (
    <Card className="w-full shadow-2xl shadow-primary/10 text-center">
      <CardHeader>
        <div className="mx-auto bg-green-100 dark:bg-green-900/50 rounded-full h-16 w-16 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-500 dark:text-green-400" />
        </div>
      </CardHeader>
      <CardContent>
        <CardTitle className="font-headline text-3xl">Registration Successful!</CardTitle>
        <CardDescription className="mt-2">Your details have been submitted. Thank you for registering.</CardDescription>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={reset}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Register Another Person
        </Button>
      </CardFooter>
    </Card>
  );
} 
