export type AutoPartRequest = {
  id: string;
  title: string;
  description: string;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_model_trim: string;
  urgency: "low" | "medium" | "high";
  required_by_date: string;
  attachment?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
};
