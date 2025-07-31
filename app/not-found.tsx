
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden z-1 w-full">
    
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl rounded-2xl p-8 mx-auto w-full max-w-2xl text-center">
        <h1 className="mb-8 font-bold text-gray-800 text-title-md dark:text-white/90 xl:text-title-2xl">
          ERROR
        </h1>

        <Image
          src="/img/404.svg"
          alt="404"
          width={472}
          height={152}
          className="mx-auto"
        />
      

        <p className="mt-10 mb-6 text-base text-gray-700 dark:text-gray-400 sm:text-lg">
          We can’t seem to find the page you are looking for!
        </p>

        <div className="flex gap-5 justify-center items-center">
          <Button asChild className="text-lg h-12" size="lg">
            <Link href="/">
              <Home className=" !h-5 !w-5" />
              Go To Home
            </Link>
          </Button>

        </div>
      </div>

      {/* Footer */}
      <p className="absolute text-sm text-center text-gray-500 -translate-x-1/2 bottom-6 left-1/2 dark:text-gray-400">
        &copy; {new Date().getFullYear()} - Tech&tomes
      </p>
    </div>
  )
}
