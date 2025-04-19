// app/page.tsx
'use client';

import { useState } from 'react';
import { ConversationItem, Question, Decision } from '@/types';
import { Conversation } from '@/components/mindguide/conversation';
import { QuestionForm } from '@/components/mindguide/question-form';
import { DecisionOutput } from '@/components/mindguide/decision-output';
import { getNextQuestion, getDecision } from '@/lib/gemini';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

const INITIAL_QUESTION: Question = {
  id: 'initial',
  text: 'What area are you focusing on right now for your personal or professional growth?',
  type: 'options',
  options: [
    { text: 'Internship Planning', value: 'internship' },
    { text: 'Skill Development', value: 'skill' },
    { text: 'Career Growth', value: 'career' },
    { text: 'Project Execution', value: 'project' },
  ],
};

export default function Home() {
  const [conversationHistory, setConversationHistory] = useState<ConversationItem[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question>(INITIAL_QUESTION);
  const [decision, setDecision] = useState<Decision | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleQuestionSubmit = async (answer: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Add user's answer to conversation history
      const updatedHistory = [
        ...conversationHistory,
        { role: 'system' as const, content: currentQuestion.text },
        { role: 'user' as const, content: answer },
      ];
      
      setConversationHistory(updatedHistory);
      
      // Check if we've reached decision point (after 5 exchanges)
      if (updatedHistory.filter(item => item.role === 'user').length >= 5) {
        const decisionResult = await getDecision(updatedHistory);
        if (decisionResult) {
          setDecision(decisionResult);
        }
      } else {
        // Otherwise get next question
        const nextQuestion = await getNextQuestion(updatedHistory);
        if (nextQuestion) {
          setCurrentQuestion(nextQuestion);
        }
      }
    } catch (err) {
      setError((err as Error).message || 'An unexpected error occurred');
      console.error('Error in question submission:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setConversationHistory([]);
    setCurrentQuestion(INITIAL_QUESTION);
    setDecision(null);
    setError(null);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 lg:p-24">
      <Card className="w-full max-w-2xl mx-auto mb-8">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">MindGuide</CardTitle>
          <p className="text-sm text-gray-500">
            Your AI-powered decision-making assistant
          </p>
        </CardHeader>
      </Card>

      {error && (
        <Card className="w-full max-w-2xl mx-auto mb-8 bg-red-50 border-red-300">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle size={18} />
              <p>{error}</p>
            </div>
            <div className="mt-2 flex justify-end">
              <button 
                className="text-sm text-blue-600 hover:underline" 
                onClick={handleReset}
              >
                Start Over
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {conversationHistory.length > 0 && (
        <Conversation history={conversationHistory} />
      )}

      {!decision ? (
        <QuestionForm 
          question={currentQuestion}
          onSubmit={handleQuestionSubmit}
          isLoading={isLoading}
        />
      ) : (
        <DecisionOutput
          decision={decision}
          onReset={handleReset}
        />
      )}
    </main>
  );
}