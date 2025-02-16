
export interface DateRange {
    startDate: string;
    endDate: string;
  }
  
export interface TestType {
    id: string;
    name: string;
    isSelected: boolean;
  }
  
export interface TestResult {
    id: string;
    testType: string;
    date: string;
    status: string;
  }
