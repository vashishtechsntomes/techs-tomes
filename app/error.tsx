"use client"

import { useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"


interface ErrorPageProps {
  error: Error
  reset: () => void
}

export default function GlobalError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("Global Error:", error)
  }, [error])

  return (
    <div className="relative flex flex-col items-center justify-center p-6 overflow-hidden min-h-screen z-1 w-full">

      <div className="p-8 mx-auto w-full max-w-3xl text-center">
        <h1 className="mb-6 font-bold text-title-md text-gray-800 dark:text-white xl:text-title-2xl">
          Something went wrong
        </h1>

        <Image
          src="/img/503.svg" 
          alt="Global error"
          width={400}
          height={200}
          className="mx-auto"
        />

        <p className="mt-8 mb-6 text-base text-gray-700 dark:text-gray-400 sm:text-lg">
          We’re sorry, an unexpected error occurred. Please try again or go back to a safe page.
        </p>

        <div className="flex gap-5 justify-center items-center flex-wrap">
          <Button size="lg" className="text-lg h-12" onClick={reset}>
            <AlertTriangle className="w-5 h-5 mr-2" />
            Try Again
          </Button>

          <Button asChild size="lg" variant="secondary" className="text-lg h-12">
            <Link href="/">Go to Home</Link>
          </Button>
        </div>

        <p className="absolute text-sm text-center text-gray-500 -translate-x-1/2 bottom-6 left-1/2 dark:text-gray-400">
          &copy; {new Date().getFullYear()} - Tech&tomes
        </p>
      </div>
    </div>
  )
}
