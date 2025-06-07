import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch all progress with exercise included
    const allProgress = await prisma.userProgress.findMany({
      include: { exercise: true },
      orderBy: { completedAt: 'desc' },
      take: 100, // limit for performance
    });

    // Aggregate by type in JS
    const byType: Record<string, number> = {};
    for (const item of allProgress) {
      const type = item.exercise.type;
      byType[type] = (byType[type] || 0) + 1;
    }

    const today = new Date().toISOString().split('T')[0];
    const stats = {
      totalExercises: allProgress.length,
      averageScore:
        allProgress.reduce((acc, curr) => acc + (curr.score || 0), 0) /
        (allProgress.length || 1),
      completedToday: allProgress.filter(
        (item) => item.completedAt.toISOString().split('T')[0] === today
      ).length,
      byType,
    };

    return NextResponse.json({
      progress: allProgress,
      stats,
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { exerciseId, score, feedback, recordingUrl } = data;

    const progress = await prisma.userProgress.create({
      data: {
        exerciseId,
        score,
        feedback,
        recordingUrl,
        userId: '1', // In a real app, this would come from the authenticated user
      },
      include: {
        exercise: true,
      },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error saving progress:', error);
    return NextResponse.json(
      { error: 'Failed to save progress' },
      { status: 500 }
    );
  }
} 