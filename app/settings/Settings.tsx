'use client'

import React from 'react'
import { Wrench } from 'lucide-react'

const Settings = () => {
  return (
    <div className="flex items-center justify-center min-h-[70vh] bg-background text-foreground">
      <div className="text-center space-y-4 p-6 rounded-2xl shadow-md border border-muted max-w-md w-full">
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-gradient-to-tr from-purple-300 to-indigo-400 dark:from-purple-700 dark:to-indigo-600 shadow-lg">
            <Wrench className="h-10 w-10 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight animate-pulse">
          Settings Page Coming Soon
        </h1>
        <p className="text-muted-foreground">
          We’re working hard to bring you a customizable settings experience.
          Stay tuned!
        </p>
      </div>
    </div>
  )
}

export default Settings
