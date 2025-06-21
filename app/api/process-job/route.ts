import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { jobTitle, jobDescription } = await req.json();

    if (!jobTitle) {
      return NextResponse.json(
        { error: 'Job title is required' },
        { status: 400 }
      );
    }

    // Generate job summary using Gemini
    const jobPrompt = jobDescription
      ? `Please analyze this job posting and provide a concise summary (2-3 sentences) highlighting the key requirements, responsibilities, and what the ideal candidate should have:

Job Title: ${jobTitle}
Job Description: ${jobDescription}`
      : `Please provide a brief summary (2-3 sentences) of typical requirements and responsibilities for a ${jobTitle} position.`;

    const { text: jobSummary } = await generateText({
      model: google('gemini-2.5-flash'),
      prompt: jobPrompt,
    });

    return NextResponse.json({
      success: true,
      jobSummary,
    });
  } catch (error) {
    console.error('Error processing job:', error);
    return NextResponse.json(
      { error: 'Failed to process job details' },
      { status: 500 }
    );
  }
}
