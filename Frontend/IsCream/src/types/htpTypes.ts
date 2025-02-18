export type DrawingType = "house" | "tree" | "male" | "female";

export interface HTPResult {
  id: number;
  childId: number;
  type: DrawingType;
  imageUrl: string;
  analysis: string;
}
