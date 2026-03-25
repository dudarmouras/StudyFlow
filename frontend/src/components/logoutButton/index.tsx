"use client"

import { useRouter } from "next/navigation"
import { Button } from "../ui/button"
import { DoorOpen } from "lucide-react"

function deleteCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0`
}

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("token")
    deleteCookie("token")
    router.push("/")
  }

  return (
    <Button 
      onClick={handleLogout}
      variant="ghost"
      className="group w-14 h-14 rounded-2xl bg-pink-50 hover:bg-red-50 text-red-500 hover:text-red-600 transition-all duration-200 shadow-sm cursor-pointer flex items-center justify-center"
    >
      <DoorOpen 
        size={32} 
        className="transition-transform duration-200 group-hover:translate-x-1" 
      />
    </Button>
  )
}