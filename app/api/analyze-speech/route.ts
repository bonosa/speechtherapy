import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    const exerciseId = formData.get('exerciseId') as string;
    const expectedText = formData.get('expectedText') as string;

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Convert audio to text using Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      language: "en",
    });

    // Analyze pronunciation using GPT-4
    const analysis = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a speech therapy expert. Analyze the pronunciation and provide detailed feedback.
          Expected text: ${expectedText}
          Actual transcription: ${transcription.text}
          
          Focus on:
          1. Accuracy of pronunciation
          2. Clarity of speech
          3. Speed and rhythm
          4. Specific sounds that need improvement
          5. Practical exercises for improvement`
        },
        {
          role: "user",
          content: "Please provide detailed feedback on the pronunciation, including specific suggestions for improvement."
        }
      ],
    });

    return NextResponse.json({
      transcription: transcription.text,
      feedback: analysis.choices[0].message.content,
    });
  } catch (error) {
    console.error('Error analyzing speech:', error);
    return NextResponse.json(
      { error: 'Failed to analyze speech' },
      { status: 500 }
    );
  }
} 