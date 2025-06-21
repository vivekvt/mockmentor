import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import dbConnect from '@/lib/mongodb';
import UserProfile from '@/lib/models/User';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { fileUrl, fileContent, fileName } = await req.json();

    if (!fileUrl || !fileContent) {
      return NextResponse.json(
        { error: 'File URL and content are required' },
        { status: 400 }
      );
    }

    // Generate resume summary using Gemini
    const { text: resumeSummary } = await generateText({
      model: google('gemini-1.5-flash'),
      prompt: `Please analyze this resume and provide a concise summary (2-3 sentences) highlighting the candidate's key skills, experience, and qualifications:\n\n${fileContent}`,
    });

    console.log('resumeSummary', resumeSummary);

    // Connect to database and save/update user profile
    await dbConnect();

    const userProfile = await UserProfile.findOneAndUpdate(
      { userId },
      {
        resumeUrl: fileUrl,
        resumeSummary,
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      fileUrl,
      resumeSummary,
      userProfile,
      fileName,
    });
  } catch (error) {
    console.error('Error processing resume:', error);
    return NextResponse.json(
      { error: 'Failed to process resume' },
      { status: 500 }
    );
  }
}
