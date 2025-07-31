import { Survey } from "@/types";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const getAllSurveys = async (): Promise<Survey[]> => {
  const res = await axios.get(`${BASE_URL}/api/surveys`);
  return res.data;
};

export const createSurvey = async (data: Partial<Survey>): Promise<Survey> => {
  const res = await axios.post(`${BASE_URL}/api/surveys`, data);
  return res.data;
};

export const updateSurvey = async (id: string, data: Partial<Survey>): Promise<Survey> => {
  const res = await axios.put(`${BASE_URL}/api/surveys/${id}`, data);
  return res.data;
};

export const deleteSurvey = async (id: string): Promise<{ message: string }> => {
  const res = await axios.delete(`${BASE_URL}/api/surveys/${id}`);
  return res.data;
};
