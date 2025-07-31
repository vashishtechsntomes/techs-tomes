"use client"

import React, { useEffect, useState, useRef } from "react"
import { HiOutlineUser } from "react-icons/hi2"
import { BsBarChartSteps, BsHandbag } from "react-icons/bs"
import { TbBrightness } from "react-icons/tb"
import StatCard from "@/components/common/cards/StatCard"
import { ChartSkinTypeDistribution } from "@/components/common/charts/ChartSkinTypeDistribution"
import { AgeDistribution } from "@/components/common/charts/AgeDistribution"
import { GenderDistribution } from "@/components/common/charts/GenderDistribution"
import SurveyTable from "@/components/common/Tables/SurveyTable"
import { DashboardOverview, SkinTypeDistributionData } from "@/types"
import { fetchDashboardOverview } from "./services/dashboard"

const Dashboard = () => {
    const [data, setData] = useState<DashboardOverview | null>(null)
    const [error, setError] = useState<string | null>(null)
    
    
    const dataFetched = useRef(false)

    useEffect(() => {
    
        if (dataFetched.current) return

        const getData = async () => {
            try {
                dataFetched.current = true
                const result = await fetchDashboardOverview()
                setData(result)
            } catch (err) {
                console.error(err)
                setError("Failed to load dashboard data.")
            }
        }

        getData()
    }, [])

    if (error) return <div className="text-red-500">{error}</div>
    if (!data) return <div className="p-6">Loading dashboard...</div>

    return (
        <div className="space-y-6">
            <div className="gap-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Active Users"
                    value={data.activeUsers.toLocaleString()}
                    icon={<HiOutlineUser className="w-10 h-10" />}
                    accentColor="bg-[#fbd7e0] dark:bg-secondary"
                    barColor="bg-secondary/70"
                />
                <StatCard
                    title="Number of Routines"
                    value={data.totalRoutines.toLocaleString()}
                    icon={<BsBarChartSteps className="w-10 h-10" />}
                    accentColor="bg-violet-200 dark:bg-violet-500"
                    barColor="bg-violet-300"
                />
                <StatCard
                    title="Avg Routines per User"
                    value={data.avgRoutinesPerUser.toString()}
                    icon={<TbBrightness className="w-10 h-10" />}
                    accentColor="bg-[#fbd7e0] dark:bg-secondary"
                    barColor="bg-secondary"
                />
                <StatCard
                    title="Avg Products per Routine"
                    value={data.avgProductsPerRoutine.toString()}
                    icon={<BsHandbag className="w-10 h-10" />}
                    accentColor="bg-blue-200 dark:bg-blue-500"
                    barColor="bg-blue-300"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <GenderDistribution data={data.genderDistribution} />
                <AgeDistribution data={data.ageDistribution} />
                <ChartSkinTypeDistribution chartData={data.skinTypeDistribution as SkinTypeDistributionData} />
            </div>

            <SurveyTable />
        </div>
    )
}

export default Dashboard