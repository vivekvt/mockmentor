import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongodb';
import Interview from '@/lib/models/Interview';
import UserProfile from '@/lib/models/User';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { jobTitle, jobDescription, jobSummary } = await req.json();

    if (!jobTitle || !jobSummary) {
      return NextResponse.json(
        {
          error: 'Job title and job summary are required',
        },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Get user profile for resume summary
    const userProfile = await UserProfile.findOne({ userId });

    if (!userProfile || !userProfile.resumeSummary) {
      return NextResponse.json(
        {
          error: 'User profile with resume summary not found',
        },
        { status: 404 }
      );
    }

    // Create interview session
    const interview = new Interview({
      userId,
      jobTitle,
      jobDescription,
      userSummary: userProfile.resumeSummary,
      jobSummary,
      status: 'scheduled',
    });

    await interview.save();

    return NextResponse.json({
      success: true,
      interview,
    });
  } catch (error) {
    console.error('Error creating interview:', error);
    return NextResponse.json(
      { error: 'Failed to create interview' },
      { status: 500 }
    );
  }
}
