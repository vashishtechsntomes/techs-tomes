export type Survey = {
  _id: string;
  code: string;
  name: string;
  category: string;
  status: "Active" | "Draft" | "Closed";
  startDate: string | Date;
  endDate: string | Date;
  respondents: string;
  cost: number;
  currency: "₹" | "$" | "€" | "£";
};

export type SkinTypeDistributionData = Record<"dry" | "normal" | "oil" | "combination" | "unknown", number>

export interface DashboardOverview {
  activeUsers: number
  totalRoutines: number
  avgRoutinesPerUser: number
  avgProductsPerRoutine: number
  genderDistribution: Record<"male" | "female" | "unknown", number>
  ageDistribution: Record<"18-24" | "25-32" | "33-50" | "51+" | "unknown", number>
  skinTypeDistribution: SkinTypeDistributionData
}
