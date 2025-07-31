'use client'

import React from 'react'
import { FileBarChart2 } from 'lucide-react'

const Reports = () => {
  return (
    <div className="flex items-center justify-center min-h-[70vh] bg-background text-foreground">
      <div className="text-center space-y-4 p-6 rounded-2xl shadow-md border border-muted max-w-md w-full">
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-gradient-to-tr from-pink-300 to-red-400 dark:from-pink-700 dark:to-red-600 shadow-lg">
            <FileBarChart2 className="h-10 w-10 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight animate-pulse">
          Reports Page Coming Soon
        </h1>
        <p className="text-muted-foreground">
          Analytics and reports are in progress. Check back soon for powerful insights!
        </p>
      </div>
    </div>
  )
}

export default Reports
