import type { ReactNode } from "react"
type ErrorMessageProps = {
  children: ReactNode
}

export default function ErrorMessage({ children }: ErrorMessageProps) {
  return (
    <>
      <p
        className="bg-red-50 w-auto max-w-xs md:max-w-md text-red-500 rounded-lg p-1 uppercase text-xs font-black text-center mx-auto"
      >
        {children}
      </p>
    </>
  )
}
