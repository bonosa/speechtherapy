import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const progress = await prisma.userProgress.findMany({
      include: {
        exercise: true,
      },
      orderBy: {
        completedAt: 'desc',
      },
      take: 10,
    });

    // Calculate statistics
    const stats = {
      totalExercises: await prisma.userProgress.count(),
      averageScore: await prisma.userProgress.aggregate({
        _avg: {
          score: true,
        },
      }),
      completedToday: await prisma.userProgress.count({
        where: {
          completedAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      byType: await prisma.userProgress.groupBy({
        by: ['exercise.type'],
        _count: true,
      }),
    };

    return NextResponse.json({
      progress,
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