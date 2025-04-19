// components/mindguide/decision-output.tsx
import { Decision } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface DecisionOutputProps {
  decision: Decision;
  onReset: () => void;
}

export function DecisionOutput({ decision, onReset }: DecisionOutputProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl text-center">Your Personalized Plan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-lg font-medium mb-2">{decision.recommendation}</div>
        
        <div>
          <h3 className="font-medium mb-2">Next Steps:</h3>
          <ul className="list-disc pl-5 space-y-1">
            {decision.steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ul>
        </div>
        
        {decision.resources && (
          <div>
            <h3 className="font-medium mb-2">Recommended Resources:</h3>
            <ul className="list-disc pl-5 space-y-1">
              {decision.resources.map((resource, index) => (
                <li key={index}>{resource}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="flex justify-center mt-6">
          <Button 
            onClick={onReset}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Start Over
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}