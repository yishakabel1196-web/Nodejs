import { TestCase } from '../data/types';
import { executeCode } from './executor';

export interface ValidationResult {
  passed: boolean;
  testResults: TestResult[];
}

export interface TestResult {
  description: string;
  passed: boolean;
  request: any;
  expectedStatus: number;
  actualStatus: number | null;
  expectedBody: any;
  actualBody: any;
  error?: string;
}

export function validateRoute(userCode: string, testCases: TestCase[]): ValidationResult {
  const testResults: TestResult[] = [];

  for (const testCase of testCases) {
    const result = runTestCase(userCode, testCase);
    testResults.push(result);
  }

  const passed = testResults.every(r => r.passed);

  return {
    passed,
    testResults
  };
}

function runTestCase(userCode: string, testCase: TestCase): TestResult {
  try {
    // Execute the user's code to get the Express app
    const executionResult = executeCode(userCode);
    
    if (!executionResult.success) {
      return {
        description: testCase.description,
        passed: false,
        request: testCase.request,
        expectedStatus: testCase.expectedStatus,
        actualStatus: null,
        expectedBody: testCase.expectedBody,
        actualBody: null,
        error: `Code execution failed: ${executionResult.error}`
      };
    }

    // Simulate HTTP request
    const { method, path, body, params } = testCase.request;
    
    // Create a mock request/response cycle
    const mockReq = {
      method,
      path,
      params: params || {},
      body: body || {},
      query: {},
      headers: {}
    };

    const mockRes = {
      statusCode: 200,
      body: null,
      status(code: number) {
        this.statusCode = code;
        return this;
      },
      json(data: any) {
        this.body = data;
        return this;
      },
      send(data?: any) {
        this.body = data;
        return this;
      }
    };

    // Try to find and call the matching route
    // This is a simplified simulation - in reality, we'd need to actually run the Express app
    // For now, we'll use a pattern-matching approach
    
    const actualStatus = simulateRoute(userCode, mockReq, mockRes);
    const actualBody = mockRes.body;

    const statusMatch = actualStatus === testCase.expectedStatus;
    const bodyMatch = JSON.stringify(actualBody) === JSON.stringify(testCase.expectedBody);

    return {
      description: testCase.description,
      passed: statusMatch && bodyMatch,
      request: testCase.request,
      expectedStatus: testCase.expectedStatus,
      actualStatus,
      expectedBody: testCase.expectedBody,
      actualBody
    };
  } catch (error: any) {
    return {
      description: testCase.description,
      passed: false,
      request: testCase.request,
      expectedStatus: testCase.expectedStatus,
      actualStatus: null,
      expectedBody: testCase.expectedBody,
      actualBody: null,
      error: error.message
    };
  }
}

function simulateRoute(userCode: string, req: any, res: any): number {
  // This is a simplified simulation
  // In a real implementation, we'd actually run the Express app and make HTTP requests
  
  // For now, we'll parse the user's code and try to match routes
  // This is a placeholder - the actual implementation would be more sophisticated
  
  try {
    // Extract route handlers from the code
    const routePattern = /app\.(get|post|put|delete)\(['"]([^'"]+)['"],\s*\(([^)]+)\)\s*=>\s*{([^}]+)}/gi;
    let match;
    
    while ((match = routePattern.exec(userCode)) !== null) {
      const [, method, path, params, handler] = match;
      
      // Check if this route matches the request
      if (method.toUpperCase() === req.method) {
        // Simple path matching (doesn't handle params yet)
        if (path === req.path || pathMatchesPattern(path, req.path, req.params)) {
          // Execute the handler
          // This is where we'd actually run the code
          // For now, return a placeholder
          return 200;
        }
      }
    }
    
    return 404;
  } catch (error) {
    return 500;
  }
}

function pathMatchesPattern(pattern: string, actualPath: string, params: Record<string, string>): boolean {
  // Convert Express pattern to regex
  // e.g., /users/:id -> /users/([^/]+)
  const regexPattern = pattern.replace(/:(\w+)/g, '([^/]+)');
  const regex = new RegExp(`^${regexPattern}$`);
  const match = actualPath.match(regex);
  
  if (match) {
    // Extract param values
    const paramNames = (pattern.match(/:(\w+)/g) || []).map(p => p.slice(1));
    paramNames.forEach((name, index) => {
      params[name] = match[index + 1];
    });
    return true;
  }
  
  return false;
}

export function formatValidationResult(result: ValidationResult): string {
  let output = '';
  
  result.testResults.forEach((test, index) => {
    output += `\n${test.passed ? '✓' : '✗'} Test ${index + 1}: ${test.description}\n`;
    
    if (!test.passed) {
      output += `  Request: ${test.request.method} ${test.request.path}\n`;
      if (test.request.body) {
        output += `  Body: ${JSON.stringify(test.request.body)}\n`;
      }
      output += `  Expected: ${test.expectedStatus} ${JSON.stringify(test.expectedBody)}\n`;
      output += `  Actual: ${test.actualStatus} ${JSON.stringify(test.actualBody)}\n`;
      
      if (test.error) {
        output += `  Error: ${test.error}\n`;
      }
    }
  });
  
  return output;
}
