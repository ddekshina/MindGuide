// components/mindguide/conversation.tsx
import { ConversationItem } from '@/types';
import { Card, CardContent } from '@/components/ui/card';

interface ConversationProps {
  history: ConversationItem[];
}

export function Conversation({ history }: ConversationProps) {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 mb-8">
      {history.map((item, index) => (
        <Card 
          key={index} 
          className={`${item.role === 'user' ? 'bg-blue-50 ml-12' : 'bg-gray-50 mr-12'}`}
        >
          <CardContent className="pt-4">
            <div className="flex gap-2">
              <div className="font-medium">
                {item.role === 'user' ? 'You' : 'MindGuide'}:
              </div>
              <div>{item.content}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}