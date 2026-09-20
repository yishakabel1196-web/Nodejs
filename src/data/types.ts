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
  };
}

export interface Course {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  lessons: Lesson[];
}
