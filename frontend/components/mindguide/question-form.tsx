// components/mindguide/question-form.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Question } from '@/types';

interface QuestionFormProps {
  question: Question;
  onSubmit: (answer: string) => void;
  isLoading: boolean;
}

export function QuestionForm({ question, onSubmit, isLoading }: QuestionFormProps) {
  const [answer, setAnswer] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim()) {
      onSubmit(answer);
      setAnswer('');
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mb-8">
      <CardHeader>
        <CardTitle className="text-xl">{question.text}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          {question.type === 'text' ? (
            <Input
              placeholder="Type your answer..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full"
              disabled={isLoading}
            />
          ) : (
            <RadioGroup
              value={answer}
              onValueChange={setAnswer}
              className="space-y-3"
              disabled={isLoading}
            >
              {question.options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value}>{option.text}</Label>
                </div>
              ))}
            </RadioGroup>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            disabled={!answer.trim() || isLoading} 
            className="w-full"
          >
            {isLoading ? 'Processing...' : 'Next'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}