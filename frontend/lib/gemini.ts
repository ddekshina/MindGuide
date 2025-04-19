// lib/gemini.ts
import { ConversationItem, Question, Decision } from '@/types';

export async function getNextQuestion(
  conversationHistory: ConversationItem[]
): Promise<Question | null> {
  try {
    const response = await fetch('/api/gemini/question', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ conversationHistory }),
    });

    if (!response.ok) {
      throw new Error('Failed to get next question');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting next question:', error);
    return null;
  }
}

export async function getDecision(
  conversationHistory: ConversationItem[]
): Promise<Decision | null> {
  try {
    const response = await fetch('/api/gemini/decision', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ conversationHistory }),
    });

    if (!response.ok) {
      throw new Error('Failed to get decision');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting decision:', error);
    return null;
  }
}