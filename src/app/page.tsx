"use client"
import { useSession } from "next-auth/react"


export default function Home() {
  const { data: session } = useSession()
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Witaj w świecie filmów!</h1>
        <p className="text-lg text-gray-400 mb-8">Przygotuj się na niezapomnianą przygodę.</p>
        <div className="flex justify-center gap-4">
          {!session ? (<a href="/signup" className="btn btn-primary">Dołącz teraz</a>) : null}
          <a href="/filmy" className="btn btn-secondary">Przeglądaj katalog</a>
        </div>
      </div>
    </main>
  )
}
