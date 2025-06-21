import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { storage, BUCKET_ID } from '@/lib/appwrite';
import { ID } from 'appwrite';
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

    const formData = await req.formData();
    const file = formData.get('resume') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Upload file to Appwrite
    const fileId = ID.unique();
    await storage.createFile(BUCKET_ID, fileId, file);

    // Get file URL
    const fileUrl = storage.getFileView(BUCKET_ID, fileId);

    // Read file content for AI processing
    const fileBuffer = await file.arrayBuffer();
    const fileContent = Buffer.from(fileBuffer).toString('utf-8');

    // Generate resume summary using Gemini
    const { text: resumeSummary } = await generateText({
      model: google('gemini-2.5-flash'),
      prompt: `Please analyze this resume and provide a concise summary (2-3 sentences) highlighting the candidate's key skills, experience, and qualifications:\n\n${fileContent}`,
    });

    // Connect to database and save/update user profile
    await dbConnect();

    const userProfile = await UserProfile.findOneAndUpdate(
      { userId },
      {
        resumeUrl: fileUrl.toString(),
        resumeSummary,
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      fileUrl: fileUrl.toString(),
      resumeSummary,
      userProfile,
    });
  } catch (error) {
    console.error('Error uploading resume:', error);
    return NextResponse.json(
      { error: 'Failed to upload resume' },
      { status: 500 }
    );
  }
}
