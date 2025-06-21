'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Upload,
  FileText,
  Briefcase,
  CheckCircle,
  Loader2,
  User,
} from 'lucide-react';
import { storage, BUCKET_ID } from '@/lib/appwrite';
import { ID } from 'appwrite';
import Navbar from '@/components/navbar';
import { cn } from '@/lib/utils';
import { mentors } from '@/components/mentors';

interface UserProfile {
  resumeUrl?: string;
  resumeSummary?: string;
}

export default function NewInterviewPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Step 1: Resume Upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resumeSummary, setResumeSummary] = useState('');
  const [useExistingResume, setUseExistingResume] = useState(false);

  // Step 2: Job Details
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobSummary, setJobSummary] = useState('');

  // Step 3: Mentor Selection
  const [selectedMentor, setSelectedMentor] = useState<string | null>(null);

  // Fetch existing user profile on mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setFetchLoading(true);
      const response = await fetch('/api/user-profile');
      const data = await response.json();

      if (data.success && data.userProfile) {
        setUserProfile(data.userProfile);
        if (data.userProfile.resumeSummary) {
          setResumeSummary(data.userProfile.resumeSummary);
          setUseExistingResume(true);
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUseExistingResume(false);
    }
  };

  const triggerFileInput = () => {
    const fileInput = document.getElementById(
      'resume-upload'
    ) as HTMLInputElement;
    fileInput?.click();
  };

  const uploadResume = async () => {
    if (!selectedFile) return false;

    setLoading(true);

    try {
      // Upload file directly to Appwrite
      const fileId = ID.unique();
      await storage.createFile(BUCKET_ID, fileId, selectedFile);

      // Get file URL
      const fileUrl = storage.getFileView(BUCKET_ID, fileId);

      // Read file content for AI processing
      const fileContent = await selectedFile.text();

      // Send file URL and content to API for AI processing
      const response = await fetch('/api/process-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileUrl: fileUrl.toString(),
          fileContent,
          fileName: selectedFile.name,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResumeSummary(data.resumeSummary);
        setUserProfile(data.userProfile);
        return true;
      } else {
        alert('Failed to process resume: ' + data.error);
        return false;
      }
    } catch (error) {
      console.error('Error uploading resume:', error);
      alert('Failed to upload resume');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const processJobDetails = async () => {
    if (!jobTitle) {
      alert('Please enter a job title');
      return false;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/process-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobTitle,
          jobDescription,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setJobSummary(data.jobSummary);
        return true;
      } else {
        alert('Failed to process job details: ' + data.error);
        return false;
      }
    } catch (error) {
      console.error('Error processing job details:', error);
      alert('Failed to process job details');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const createInterview = async () => {
    if (!jobTitle || !jobSummary || !resumeSummary) {
      alert('Please complete all steps before starting the interview');
      return;
    }

    if (!selectedMentor) {
      alert('Please select a mentor to continue');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/create-interview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobTitle,
          jobDescription,
          jobSummary,
          mentorId: selectedMentor,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to interview page
        router.push(`/interview/${data?.interview?._id}`);
      } else {
        alert('Failed to create interview: ' + data.error);
      }
    } catch (error) {
      console.error('Error creating interview:', error);
      alert('Failed to create interview');
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = async () => {
    if (currentStep === 1) {
      // Step 1: Resume processing
      if (useExistingResume && resumeSummary) {
        setCurrentStep(2);
      } else if (selectedFile) {
        const success = await uploadResume();
        if (success) {
          setCurrentStep(2);
        }
      } else {
        alert('Please upload a resume or use your existing one');
      }
    } else if (currentStep === 2) {
      // Step 2: Job processing
      const success = await processJobDetails();
      if (success) {
        setCurrentStep(3);
      }
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <Navbar />
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Setup Your Interview
          </h1>
          <p className="text-muted-foreground mt-2">
            Complete the steps below to start your mock interview
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center space-x-2 ${
                currentStep >= 1 ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 1
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                {currentStep > 1 ? <CheckCircle className="w-5 h-5" /> : '1'}
              </div>
              <span className="text-sm font-medium">Resume</span>
            </div>
            <div
              className={`w-8 h-px ${
                currentStep >= 2 ? 'bg-primary' : 'bg-muted'
              }`}
            />
            <div
              className={`flex items-center space-x-2 ${
                currentStep >= 2 ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 2
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                {currentStep > 2 ? <CheckCircle className="w-5 h-5" /> : '2'}
              </div>
              <span className="text-sm font-medium">Job Details</span>
            </div>
            <div
              className={`w-8 h-px ${
                currentStep >= 3 ? 'bg-primary' : 'bg-muted'
              }`}
            />
            <div
              className={`flex items-center space-x-2 ${
                currentStep >= 3 ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 3
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                3
              </div>
              <span className="text-sm font-medium">Start Interview</span>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <Card className="p-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2 flex items-center justify-center gap-2">
                  <FileText className="" />
                  Upload Your Resume
                </h2>
                <p className="text-muted-foreground">
                  Upload your resume to get personalized interview questions
                </p>
              </div>

              {userProfile?.resumeSummary && (
                <div className="border border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-800 dark:text-green-200">
                      Previous Resume Found
                    </span>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                    {userProfile.resumeSummary}
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      variant={useExistingResume ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setUseExistingResume(true)}
                    >
                      Use Existing Resume
                    </Button>
                    <Button
                      variant={!useExistingResume ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setUseExistingResume(false)}
                    >
                      Upload New Resume
                    </Button>
                  </div>
                </div>
              )}

              {!useExistingResume && (
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-4" />
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Choose a file or drag it here
                    </p>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="resume-upload"
                    />
                    <Button
                      variant="outline"
                      onClick={triggerFileInput}
                      className="cursor-pointer"
                    >
                      Browse Files
                    </Button>
                  </div>
                  {selectedFile && (
                    <p className="mt-2 text-sm text-green-600">
                      Selected: {selectedFile.name}
                    </p>
                  )}
                </div>
              )}

              {/* {resumeSummary && (
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Resume Summary:</h3>
                  <p className="text-sm text-muted-foreground">
                    {resumeSummary}
                  </p>
                </div>
              )} */}
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2 flex items-center justify-center gap-2">
                  <Briefcase />
                  Job Details
                </h2>
                <p className="text-muted-foreground">
                  Provide details about the position you&apos;re interviewing
                  for
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Job Title *
                  </label>
                  <Input
                    placeholder="e.g., Senior Software Engineer"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Job Description
                  </label>
                  <textarea
                    className="w-full min-h-[120px] px-3 py-2 border border-input rounded-md bg-background text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="Paste the job description here for more targeted interview questions..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                </div>
              </div>

              {jobSummary && (
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Job Summary:</h3>
                  <p className="text-sm text-muted-foreground">{jobSummary}</p>
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2 flex items-center justify-center gap-2">
                  <User />
                  Choose Your Mentor
                </h2>
                <p className="text-muted-foreground">
                  Select an AI mentor to conduct your interview
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {mentors.map((mentor) => (
                  <div
                    key={mentor.id}
                    className={cn(
                      'relative cursor-pointer rounded-lg border-2 p-3 transition-all hover:shadow-md',
                      selectedMentor === mentor.id
                        ? 'border-primary bg-primary/5'
                        : 'border-muted hover:border-primary/50'
                    )}
                    onClick={() => setSelectedMentor(mentor.id)}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div className="relative w-full h-32 overflow-hidden rounded-md">
                        <img
                          src={mentor.image}
                          alt={mentor.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="font-medium text-center">{mentor.name}</p>
                    </div>
                    {selectedMentor === mentor.id && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle className="w-5 h-5 text-primary" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {selectedMentor && (
                <div className="text-center">
                  <CheckCircle className="w-16 h-16 mx-auto text-green-600 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Ready to Start!
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Everything is set up for your mock interview with{' '}
                    {mentors.find((m) => m.id === selectedMentor)?.name}
                  </p>

                  {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-6">
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Your Profile:</h4>
                      <p className="text-sm text-muted-foreground">
                        {resumeSummary}
                      </p>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Position: {jobTitle}</h4>
                      <p className="text-sm text-muted-foreground">
                        {jobSummary}
                      </p>
                    </div>
                  </div> */}

                  <Button
                    onClick={createInterview}
                    disabled={loading}
                    size="lg"
                    className="w-full md:w-auto"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Starting Interview...
                      </>
                    ) : (
                      'Start Interview'
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          {currentStep < 3 && (
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
              >
                Back
              </Button>
              <Button
                onClick={handleNextStep}
                disabled={
                  loading ||
                  (currentStep === 1 && !useExistingResume && !selectedFile)
                }
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Next'
                )}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
