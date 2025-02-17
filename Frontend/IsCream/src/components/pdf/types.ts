
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
  testId: number;
  title: string;
  date: string;
  childName: string;
  type: 'HTP' | 'PAT' | 'BFI';
  }
