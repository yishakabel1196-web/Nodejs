// Node.js Academy Types
export interface Lesson {
  id: string;
  title: string;
  theory: string;
  exampleCode: string;
  exercise: {
    instructions: string;
    starterCode: string;
    expectedOutput: string;
    solution: string;
    hint?: string;
    hints?: string[];
    commonMistakes?: Array<{
      mistake: string;
      hint: string;
    }>;
    alternativeSolutions?: Array<{
      approach: string;
      code: string;
      tradeoffs: string;
    }>;
  };
  prerequisites?: string[];
  spiralConnections?: Array<{
    concept: string;
    fromLesson: string;
    connection: string;
  }>;
  furtherReading?: Array<{
    title: string;
    url: string;
    type: 'docs' | 'blog' | 'book' | 'video';
  }>;
  nodeVersion?: string;
  deprecationWarnings?: string[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  lessons: Lesson[];
}

// Daily Routes Types
export interface TestCase {
  request: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    path: string;
    body?: any;
    params?: Record<string, string>;
  };
  expectedStatus: number;
  expectedBody?: any;
  description: string;
}

export interface Challenge {
  day: number;
  type: 'A' | 'B' | 'C';
  title: string;
  spec: string;
  testCases: TestCase[];
  solution: string;
  explanation: string;
  hints?: string[];
}

export interface UserProgress {
  completedDays: number[];
  streak: number;
  lastCompletionDate: string | null;
  badges: string[];
  attempts: Record<number, number>;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: (progress: UserProgress) => boolean;
}
