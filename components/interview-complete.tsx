import React, { useState, useEffect } from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const InterviewComplete = () => {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowAnimation(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="max-w-2xl w-full space-y-8">
        {/* Success Icon and Title */}
        <div
          className={`text-center space-y-4 transition-all duration-1000 ${
            showAnimation
              ? 'translate-y-0 opacity-100'
              : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-green-100 dark:bg-green-900">
              <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground">
              Interview Completed!
            </h1>
            <p className="text-lg text-muted-foreground">
              Great job! You&apos;ve successfully completed your mock interview.
            </p>
          </div>
        </div>

        {/* Email Notification */}
        <div
          className={`text-center transition-all duration-1000 delay-300 ${
            showAnimation
              ? 'translate-y-0 opacity-100'
              : 'translate-y-10 opacity-0'
          }`}
        >
          <p className="text-muted-foreground">
            You will receive detailed feedback on your email soon
          </p>
        </div>

        {/* Action Button */}
        <div
          className={`flex justify-center transition-all duration-1000 delay-500 ${
            showAnimation
              ? 'translate-y-0 opacity-100'
              : 'translate-y-10 opacity-0'
          }`}
        >
          <Button size="lg" asChild>
            <Link href="/interview/new">
              Take New Interview
              <ArrowRight />
            </Link>
          </Button>
        </div>

        {/* Motivational Message */}
        <div
          className={`text-center transition-all duration-1000 delay-700 ${
            showAnimation
              ? 'translate-y-0 opacity-100'
              : 'translate-y-10 opacity-0'
          }`}
        >
          <p className="text-sm text-muted-foreground italic">
            &quot;Success is where preparation and opportunity meets.&quot;
          </p>
        </div>
      </div>
    </div>
  );
};

export default InterviewComplete;
