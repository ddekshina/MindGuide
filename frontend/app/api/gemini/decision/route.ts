// app/api/gemini/decision/route.ts
import { NextResponse } from 'next/server';
import { ConversationItem } from '@/types';
import { generateDecision } from '@/lib/gemini-client';

export async function POST(request: Request) {
  try {
    const { conversationHistory } = await request.json() as { 
      conversationHistory: ConversationItem[] 
    };
    
    // Use the Gemini client to generate the decision
    const decision = await generateDecision(conversationHistory);
    
    return NextResponse.json(decision);
  } catch (error) {
    console.error('Error in decision API route:', error);
    return NextResponse.json(
      { error: 'Failed to generate decision', details: (error as Error).message },
      { status: 500 }
    );
  }
}