// types/index.ts
export interface ConversationItem {
    role: 'user' | 'system';
    content: string;
  }
  
  export interface QuestionOptions {
    text: string;
    value: string;
  }
  
  export interface Question {
    id: string;
    text: string;
    type: 'text' | 'options';
    options?: QuestionOptions[];
  }
  
  export interface Decision {
    recommendation: string;
    steps: string[];
    resources?: string[];
  }