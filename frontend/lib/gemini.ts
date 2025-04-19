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
      const errorData = await response.json().catch(() => ({}));
      console.error(`API Error (${response.status}):`, errorData);
      throw new Error(`Failed to get next question: ${errorData.details || response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting next question:', error);
    throw error; // Re-throw to allow UI to handle it
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
      const errorData = await response.json().catch(() => ({}));
      console.error(`API Error (${response.status}):`, errorData);
      throw new Error(`Failed to get decision: ${errorData.details || response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting decision:', error);
    throw error; // Re-throw to allow UI to handle it
  }
}