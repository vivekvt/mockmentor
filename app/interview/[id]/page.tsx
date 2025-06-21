'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { StreamingAvatarProvider } from '@/components/logic';
import Interview from '@/components/interview';
import LoadingSkeleton from '@/components/loading-skeleton';
import InterviewComplete from '@/components/interview-complete';
import Link from 'next/link';

interface Interview {
  _id: string;
  userId: string;
  jobTitle: string;
  jobDescription?: string;
  userSummary: string;
  jobSummary: string;
  status: 'scheduled' | 'in-progress' | 'completed';
  startDateTime?: string;
  createdAt: string;
  updatedAt: string;
  mentorId: string;
}

export default function InterviewPage() {
  const params = useParams();
  const interviewId = params.id as string;

  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Start interview
  const startInterview = useCallback(
    async (interviewData: Interview) => {
      if (interviewData.status !== 'scheduled') return interviewData;

      try {
        const response = await fetch(`/api/interview/${interviewId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'in-progress',
          }),
        });

        const data = await response.json();

        if (data.success) {
          return data.interview;
        } else {
          console.error('Failed to start interview:', data.error);
          return interviewData;
        }
      } catch (error) {
        console.error('Error starting interview:', error);
        return interviewData;
      }
    },
    [interviewId]
  );

  // Fetch interview data
  const fetchInterview = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/interview/${interviewId}`);
      const data = await response.json();

      if (data.success) {
        // First set the interview data, then conditionally start it
        let interviewData = data.interview;

        // Auto-start if scheduled
        if (interviewData.status === 'scheduled') {
          interviewData = await startInterview(interviewData);
        }

        setInterview(interviewData);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch interview');
      }
    } catch (error) {
      console.error('Error fetching interview:', error);
      setError('Failed to fetch interview');
    } finally {
      setLoading(false);
    }
  }, [interviewId, startInterview]);

  // Auto-complete interview after 5 minutes
  const completeInterview = useCallback(async () => {
    if (!interview || interview.status !== 'in-progress') return;

    try {
      const response = await fetch(`/api/interview/${interviewId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'completed',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setInterview(data.interview);
      }
    } catch (error) {
      console.error('Error completing interview:', error);
    }
  }, [interview, interviewId]);

  // Calculate time remaining for in-progress interviews
  useEffect(() => {
    if (
      !interview ||
      interview.status !== 'in-progress' ||
      !interview.startDateTime
    ) {
      return;
    }

    const startTime = new Date(interview.startDateTime).getTime();
    const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds

    const updateTimer = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const remaining = Math.max(0, fiveMinutes - elapsed);

      // Auto-complete when time is up
      if (remaining === 0) {
        completeInterview();
      }
    };

    // Update immediately
    updateTimer();

    // Update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [interview, completeInterview]);

  // Fetch interview on component mount
  useEffect(() => {
    if (interviewId) {
      fetchInterview();
    }
  }, [interviewId, fetchInterview]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md w-full text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchInterview} variant="outline">
            <Link href="/interview/new">Start New Interview</Link>
          </Button>
        </Card>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md w-full text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Interview Not Found</h2>
          <p className="text-gray-600">
            The requested interview could not be found.
          </p>
        </Card>
      </div>
    );
  }

  if (interview.status === 'completed') {
    return <InterviewComplete />;
  }

  return (
    <StreamingAvatarProvider basePath={process.env.NEXT_PUBLIC_BASE_API_URL}>
      <Interview
        mentorId={interview.mentorId}
        role={interview.jobTitle}
        knowledgeBase={getKnowledgeBase(interview)}
      />
    </StreamingAvatarProvider>
  );
}

const getKnowledgeBase = (interview: Interview) => {
  return `
  You are an AI-powered interviewer conducting a mock interview for a specific job position. The candidate is described as follows: ${interview.userSummary}. 

  The job role is described as follows: ${interview.jobSummary}.

  Your task is to conduct a professional mock interview for this position. Ask 5 relevant, insightful questions to assess the candidate's technical skills, experience, and fit for the role. Tailor the questions to the candidate's background and the job's requirements. Ensure the questions are clear, concise, and encourage detailed responses about their expertise and problem-solving abilities. Maintain a professional and engaging tone throughout the interview.
  `;
};
