// lib/gemini-client.ts
import { ConversationItem, Question, Decision } from '@/types';

// This would be your actual API client for Gemini
export async function callGeminiAPI(
  prompt: string,
  conversationHistory: ConversationItem[]
): Promise<any> {
  try {
    // Replace with your actual Gemini API endpoint and key
    
    const response = await fetch('https://api.gemini.com/v1/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`,
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: buildPrompt(prompt, conversationHistory) }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
}

function buildPrompt(instructionPrompt: string, conversationHistory: ConversationItem[]): string {
  // Convert conversation history to a string format
  const historyText = conversationHistory
    .map(item => `${item.role === 'user' ? 'User' : 'System'}: ${item.content}`)
    .join('\n');

  return `
${instructionPrompt}

Conversation history:
${historyText}

Respond with valid JSON only, no additional text.
`;
}

export async function generateNextQuestion(conversationHistory: ConversationItem[]): Promise<Question> {
  const prompt = `
You are an AI assistant that helps users make decisions by asking relevant follow-up questions.
Based on the conversation history, generate the next question to ask the user.

The question should help guide the user towards making a decision about their professional or personal growth.
Focus on understanding their needs, goals, constraints, and preferences.

Return the question in the following JSON format:
{
  "id": "unique-id",
  "text": "The question text",
  "type": "text" or "options",
  "options": [{ "text": "Option display text", "value": "option-value" }, ...] (only if type is "options")
}

The options should be relevant to the question and help the user provide a structured response.
For open-ended questions, use type "text".
`;

  const response = await callGeminiAPI(prompt, conversationHistory);
  // Extract and parse the JSON response from Gemini
  const questionData = extractJsonFromGeminiResponse(response);
  return questionData as Question;
}

export async function generateDecision(conversationHistory: ConversationItem[]): Promise<Decision> {
  const prompt = `
You are an AI assistant that helps users make decisions about their professional or personal growth.
Based on the entire conversation history, generate a final recommendation or decision for the user.

The decision should be actionable, specific, and tailored to the user's needs and circumstances.

Return the decision in the following JSON format:
{
  "recommendation": "A concise summary of your recommendation",
  "steps": ["Step 1 description", "Step 2 description", ...],
  "resources": ["Resource 1", "Resource 2", ...] (optional)
}

The steps should be practical actions the user can take to implement your recommendation.
The resources should be helpful materials, tools, or references that can assist the user.
`;

  const response = await callGeminiAPI(prompt, conversationHistory);
  // Extract and parse the JSON response from Gemini
  const decisionData = extractJsonFromGeminiResponse(response);
  return decisionData as Decision;
}

function extractJsonFromGeminiResponse(response: any): any {
  // This function would extract the JSON from the Gemini response
  // The exact implementation depends on the Gemini API response structure
  // For now, we'll assume the response has a content field with text
  try {
    const text = response.candidates[0].content.parts[0].text;
    // Extract JSON from the text (may need to handle different formats)
    const jsonMatch = text.match(/({[\s\S]*})/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    // If no JSON pattern found, try parsing the whole text
    return JSON.parse(text);
  } catch (error) {
    console.error('Error extracting JSON from Gemini response:', error);
    throw new Error('Failed to parse Gemini response');
  }
}