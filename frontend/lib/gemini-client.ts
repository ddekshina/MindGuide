// lib/gemini-client.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConversationItem, Question, Decision } from '@/types';

// Initialize the Google Generative AI client
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GOOGLE_AI_API_KEY is not defined in environment variables');
  }
  return new GoogleGenerativeAI(apiKey);
}

// Get available models to help with debugging
export async function listAvailableModels() {
  try {
    const genAI = getGeminiClient();
    // This is not directly supported in the JS SDK, but we'll log what models we're trying to use
    console.log("Attempting to use model: gemini-1.5-pro");
    return ["gemini-1.5-pro", "gemini-1.5-flash"];
  } catch (error) {
    console.error("Error listing models:", error);
    throw error;
  }
}

// Convert our conversation format to Google's format
function formatConversationHistory(history: ConversationItem[]) {
  const formattedHistory = [];
  
  // Ensure the first message has a 'user' role for Gemini API
  // If there's no user message yet, we'll create a placeholder
  if (history.length > 0 && history[0].role !== 'user') {
    // Create a placeholder user message if needed
    formattedHistory.push({
      role: 'user',
      parts: [{ text: 'Hello, I need assistance with decision making.' }],
    });
  }
  
  for (let i = 0; i < history.length; i++) {
    const item = history[i];
    
    // Skip system messages - Gemini doesn't support them directly
    // Or convert them to model responses if they contain important info
    if (item.role === 'system') {
      formattedHistory.push({
        role: 'model',
        parts: [{ text: item.content }],
      });
    } else {
      formattedHistory.push({
        role: 'user',
        parts: [{ text: item.content }],
      });
    }
  }
  
  return formattedHistory;
}

export async function generateNextQuestion(conversationHistory: ConversationItem[]): Promise<Question> {
  try {
    const genAI = getGeminiClient();
    // Use the latest model name - gemini-1.5-pro
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    // Format conversation for the Google AI API
    const formattedHistory = formatConversationHistory(conversationHistory);
    
    // Ensure we have at least one user message
    if (formattedHistory.length === 0 || formattedHistory[0].role !== 'user') {
      formattedHistory.unshift({
        role: 'user',
        parts: [{ text: 'I need help with making a decision about my professional growth.' }],
      });
    }
    
    console.log("Formatted history for Gemini:", JSON.stringify(formattedHistory, null, 2));
    
    // Create a chat session
    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });
    
    // Prompt for the next question
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
    Return only valid JSON, no additional text.
    `;
    
    const result = await chat.sendMessage(prompt);
    const responseText = result.response.text();
    
    console.log("Raw API response:", responseText);
    
    // Parse the JSON response
    // First, try to find a JSON object in the response
    const jsonMatch = responseText.match(/({[\s\S]*})/);
    let questionData;
    
    if (jsonMatch) {
      questionData = JSON.parse(jsonMatch[0]);
    } else {
      // If no JSON pattern found, try parsing the whole text
      try {
        questionData = JSON.parse(responseText);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        console.log("Response text:", responseText);
        
        // Fallback to a default question if parsing fails
        return {
          id: "fallback-question",
          text: "Could you tell me more about your goals in this area?",
          type: "text"
        };
      }
    }
    
    // Validate the response has the required fields
    if (!questionData.id || !questionData.text || !questionData.type) {
      console.warn("Invalid question format from API:", questionData);
      
      // Provide a fallback question
      return {
        id: "fallback-question",
        text: "What specific aspects of this are you most interested in exploring?",
        type: "text"
      };
    }
    
    return questionData as Question;
  } catch (error) {
    console.error('Error generating next question:', error);
    throw error;
  }
}

export async function generateDecision(conversationHistory: ConversationItem[]): Promise<Decision> {
  try {
    const genAI = getGeminiClient();
    // Use the latest model name - gemini-1.5-pro
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    // Format conversation for the Google AI API
    const formattedHistory = formatConversationHistory(conversationHistory);
    
    // Ensure we have at least one user message
    if (formattedHistory.length === 0 || formattedHistory[0].role !== 'user') {
      formattedHistory.unshift({
        role: 'user',
        parts: [{ text: 'I need help with making a decision about my professional growth.' }],
      });
    }
    
    console.log("Formatted history for Gemini decision:", JSON.stringify(formattedHistory, null, 2));
    
    // Create a chat session
    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });
    
    // Prompt for the decision
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
    Return only valid JSON, no additional text.
    `;
    
    const result = await chat.sendMessage(prompt);
    const responseText = result.response.text();
    
    console.log("Raw API response for decision:", responseText);
    
    // Parse the JSON response
    // First, try to find a JSON object in the response
    const jsonMatch = responseText.match(/({[\s\S]*})/);
    let decisionData;
    
    if (jsonMatch) {
      decisionData = JSON.parse(jsonMatch[0]);
    } else {
      // If no JSON pattern found, try parsing the whole text
      try {
        decisionData = JSON.parse(responseText);
      } catch (parseError) {
        console.error("JSON parse error for decision:", parseError);
        
        // Fallback decision if parsing fails
        return {
          recommendation: "Based on our conversation, I recommend taking a structured approach to your goals.",
          steps: [
            "Define clear objectives for what you want to achieve",
            "Break down your goals into smaller, manageable tasks",
            "Set a timeline with specific milestones",
            "Regularly review your progress and adjust as needed"
          ],
          resources: [
            "Online learning platforms relevant to your field",
            "Community forums and discussion groups in your area of interest"
          ]
        };
      }
    }
    
    // Validate the response has the required fields
    if (!decisionData.recommendation || !decisionData.steps) {
      console.warn("Invalid decision format from API:", decisionData);
      
      // Provide a fallback decision
      return {
        recommendation: "Based on what you've shared, I recommend focusing on building practical experience in your area of interest.",
        steps: [
          "Identify key skills needed for your chosen path",
          "Create a consistent practice schedule",
          "Find projects that will challenge and develop your abilities",
          "Connect with others in your field for feedback and growth"
        ],
        resources: [
          "Online tutorials and courses",
          "Practice exercises and projects",
          "Industry blogs and newsletters"
        ]
      };
    }
    
    return decisionData as Decision;
  } catch (error) {
    console.error('Error generating decision:', error);
    throw error;
  }
}