export interface ExecutionResult {
  output: string;
  error: string | null;
  success: boolean;
}

export function executeCode(code: string): ExecutionResult {
  const output: string[] = [];
  
  // Create a sandboxed console
  const sandboxConsole = {
    log: (...args: any[]) => {
      output.push(args.map(arg => {
        if (typeof arg === 'object' && arg !== null) {
          try {
            return JSON.stringify(arg);
          } catch {
            return String(arg);
          }
        }
        return String(arg);
      }).join(' '));
    },
    error: (...args: any[]) => {
      output.push('Error: ' + args.map(String).join(' '));
    },
    warn: (...args: any[]) => {
      output.push('Warning: ' + args.map(String).join(' '));
    },
    info: (...args: any[]) => {
      output.push(args.map(String).join(' '));
    }
  };

  try {
    // Create a function with console as a parameter to sandbox it
    const fn = new Function('console', code);
    fn(sandboxConsole);
    
    return {
      output: output.join('\n'),
      error: null,
      success: true
    };
  } catch (err: any) {
    return {
      output: output.join('\n'),
      error: err.message || 'Unknown error',
      success: false
    };
  }
}

export function checkOutput(actual: string, expected: string): boolean {
  // Normalize both outputs for comparison
  const normalize = (s: string) => s.trim().replace(/\r\n/g, '\n').replace(/\s+/g, ' ');
  return normalize(actual) === normalize(expected);
}
