"use client"

import { useParams } from "next/navigation"
import { useEffect, useSyncExternalStore, useState } from "react"
import { jwtDecode } from "jwt-decode"
import api from "../../../services/api"  

import CardParticipants from "../../../components/cardParticipants"
import TaskList from "../../../components/task"
import Header from "../../../components/header"
import LogoutButton from "../../../components/logoutButton"
import PomodoroTimer from "@/components/pomodoroTimer"

type TokenPayload = {
  id: string
}

function getUserIdFromToken(): string {
  const token = localStorage.getItem("token")
  if (!token) return ""
  try {
    const payload = jwtDecode<TokenPayload>(token)
    return payload.id
  } catch {
    return ""
  }
}

// useSyncExternalStore resolve o hydration mismatch nativamente
function useCurrentUserId() {
  return useSyncExternalStore(
    () => () => {}, // sem subscribe (dado estático)
    () => getUserIdFromToken(), // cliente
    () => ""  // servidor
  )
}

export default function Room() {
  const params = useParams()
  const roomId = params.id as string

  const currentUserId = useCurrentUserId()
  const [roomCode, setRoomCode] = useState<string>("")
  const [roomName, setRoomName] = useState<string>("")

  useEffect(() => {
    if (!roomId) return
    const fetchRoom = async () => {
      try {
        const response = await api.get(`/room/${roomId}`)
        setRoomCode(response.data.data.code)
        setRoomName(response.data.data.roomName)
      } catch (err) {
        console.error("Erro ao buscar sala:", err)
      }
    }
    fetchRoom()
  }, [roomId])

  return (
    <div className="bg-pink-100 min-h-screen w-full">

      <div className="pt-4 sm:pt-6 px-4">
        <div className="flex items-center justify-between gap-4">
          <Header
            roomCode={roomCode || "..."}
            roomName={roomName || "Carregando..."}
          />
          <LogoutButton/>
        </div>
      </div>

      <main className="flex flex-row gap-4 px-4 py-6">

        <aside className="w-64 border shrink-0">
          <CardParticipants roomId={roomId} />
        </aside>

        <section className="flex-1 bg-white rounded-2xl p-4 shadow-md" suppressHydrationWarning>
          {currentUserId ? (
            <TaskList roomId={roomId} currentUserId={currentUserId} />
          ) : (
            <p className="text-sm text-gray-400">Carregando...</p>
          )}
        </section>
        
        <aside className="w-72 shrink-0">
          <PomodoroTimer />
        </aside>
      </main>
    </div>
  )
}