// app/api/gemini/decision/route.ts
import { NextResponse } from 'next/server';
import { ConversationItem, Decision } from '@/types';

export async function POST(request: Request) {
  try {
    const { conversationHistory } = await request.json() as { 
      conversationHistory: ConversationItem[] 
    };
    
    // In a real implementation, this would call the Gemini API
    // For now, we'll create a mock decision based on the conversation
    
    const userAnswers = conversationHistory
      .filter(item => item.role === 'user')
      .map(item => item.content.toLowerCase());
    
    let decision: Decision;
    
    // Simple logic to create different decisions based on first answer
    if (userAnswers[0].includes('internship')) {
      decision = {
        recommendation: "Based on your inputs, you're ready to pursue a backend development internship with your Node.js skills.",
        steps: [
          "Strengthen your Node.js skills by building a small but complete project",
          "Enhance your understanding of databases (MongoDB or PostgreSQL)",
          "Practice common backend interview questions",
          "Update your resume to highlight relevant projects and skills",
          "Apply to at least 10 internships in the next month"
        ],
        resources: [
          "NodeJS.org documentation",
          "MongoDB University free courses",
          "Backend developer roadmap on roadmap.sh",
          "LeetCode problems tagged with 'Backend'"
        ]
      };
    } else if (userAnswers[0].includes('skill')) {
      decision = {
        recommendation: "For data structures and algorithms skill development, a structured 3-month learning plan would be most effective.",
        steps: [
          "Start with basic data structures (arrays, linked lists, trees)",
          "Move to fundamental algorithms (sorting, searching)",
          "Practice 2-3 problems daily on platforms like LeetCode",
          "Join a study group for accountability",
          "Implement algorithms from scratch in your preferred language"
        ],
        resources: [
          "Cracking the Coding Interview book",
          "AlgoExpert platform",
          "Visualization tools like VisuAlgo",
          "YouTube channels like 'Back To Back SWE'"
        ]
      };
    } else {
      decision = {
        recommendation: "For career growth in your field, focus on both technical skills and networking opportunities.",
        steps: [
          "Identify 2-3 technical skills that are in high demand in your industry",
          "Create a portfolio showcasing your best work",
          "Connect with at least 5 professionals in your target roles",
          "Attend industry conferences or meetups",
          "Consider getting a relevant certification"
        ],
        resources: [
          "LinkedIn Learning courses",
          "Industry-specific forums and communities",
          "Mentorship platforms like MentorCruise",
          "Job boards to understand current market demands"
        ]
      };
    }
    
    return NextResponse.json(decision);
  } catch (error) {
    console.error('Error in decision API route:', error);
    return NextResponse.json(
      { error: 'Failed to generate decision' },
      { status: 500 }
    );
  }
}