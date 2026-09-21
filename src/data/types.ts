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
    hint?: string; // Legacy single hint
    hints?: string[]; // Progressive hints (3-tier)
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
  prerequisites?: string[]; // Course IDs or lesson IDs
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
  nodeVersion?: string; // e.g., "20.x LTS"
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
