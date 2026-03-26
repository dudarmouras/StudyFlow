"use client";

import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { AxiosError } from "axios";
import { Users } from "lucide-react";
import { useSocket } from '@/hooks/useSocket';
import { useRouter } from "next/navigation"; // ← corrigido

type Participant = {
  userId: string
  user: {
    id: string
    name: string
  }
}

type Props = {
  roomId: string;
}

export default function CardParticipants({ roomId }: Props) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter() // ← vira hook

  const socket = useSocket(roomId)

  useEffect(() => {
    if (!socket) return

    socket.off('participant-joined')
    socket.off('participant-left')
    socket.off('room-closed')

    socket.on('participant-joined', (data: { userId: string, user: { id: string, name: string } }) => {
      // ── O backend emite { userId, user: { id, name } }
      // ── Garante que não duplica
      setParticipants(prev =>
        prev.find(p => p.userId === data.userId)
          ? prev
          : [...prev, { userId: data.userId, user: data.user }]
      )
    })

    socket.on('participant-left', (userId: string) => {
      setParticipants(prev => prev.filter(p => p.userId !== userId))
    })

    // ── Quando sala é deletada, redireciona todos ──
    socket.on('room-closed', () => {
      router.push('/roomDecision')
    })

    return () => {
      // ── Limpa todos os listeners ──────────────────
      socket.off('participant-joined')
      socket.off('participant-left')
      socket.off('room-closed') // ← estava faltando
    }
  }, [socket, router])

  useEffect(() => {
    const fetchParticipants = async () => {
      setError(null);
      try {
        const response = await api.get(`/roomParticipant/room/${roomId}`);
        const data = response.data.data;
        setParticipants(Array.isArray(data) ? data : []);
      } catch (err) {
        const axiosErr = err as AxiosError<{ message: string }>;
        setError(axiosErr.response?.data?.message ?? "Erro ao carregar participantes.");
      }
    };
    fetchParticipants();
  }, [roomId]);

  if (error) return <p className="text-sm text-red-500">{error}</p>;

  return (
    <div className="flex flex-col gap-3 bg-white border rounded-xl border-purple-300">
      <div className="flex items-center gap-2 text-gray-600 mt-4 ml-4">
        <Users size={16} className="text-pink-600" />
        <span className="text-lg font-semibold text-pink-600">
          {participants.length} {participants.length === 1 ? "participante:" : "participantes:"}
        </span>
      </div>

      <ul className="flex flex-col gap-2 h-146 bg-white overflow-y-auto pr-1 ml-2 mr-1 scrollbar-thin scrollbar-thumb-pink-400 scrollbar-track-transparent">
        {participants.map((participant) => (
          <li key={participant.userId} className="flex items-center gap-3 p-2 rounded-lg bg-purple-200">
            <div className="h-8 w-8 rounded-full bg-pink-600 flex items-center justify-center text-white font-semibold text-sm">
              {participant.user?.name?.charAt(0).toUpperCase() ?? "?"}
            </div>
            <span className="text-sm text-gray-700">{participant.user?.name ?? "Usuário"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}