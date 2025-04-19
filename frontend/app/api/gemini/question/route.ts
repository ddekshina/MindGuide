// app/api/gemini/question/route.ts
import { NextResponse } from 'next/server';
import { ConversationItem } from '@/types';
import { generateNextQuestion, listAvailableModels } from '@/lib/gemini-client';

export async function POST(request: Request) {
  try {
    const { conversationHistory } = await request.json() as { 
      conversationHistory: ConversationItem[] 
    };
    
    // List available models for debugging
    await listAvailableModels();
    
    // Use the Gemini client to generate the next question
    const nextQuestion = await generateNextQuestion(conversationHistory);
    
    return NextResponse.json(nextQuestion);
  } catch (error) {
    console.error('Error in question API route:', error);
    
    // Provide detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';
    
    return NextResponse.json(
      { 
        error: 'Failed to process question', 
        details: errorMessage,
        stack: errorStack,
        apiKey: process.env.GEMINI_API_KEY ? "API key is set" : "API key is missing" 
      },
      { status: 500 }
    );
  }
}