import api from "@/lib/axios"
import { DashboardOverview } from "@/types"

export const fetchDashboardOverview = async (): Promise<DashboardOverview> => {
  const response = await api.get<DashboardOverview>("/api/dashboardoverview")
  return response.data
}
