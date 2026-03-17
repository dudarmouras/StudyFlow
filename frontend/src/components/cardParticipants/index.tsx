"use client";

import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { AxiosError } from "axios";
import { Users } from "lucide-react";

type Participant = {
    id: string;
    name: string;
}

type Props = {
  roomId: string;
}

export default function CardParticipants({roomId}: Props){
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [error, setError] = useState<string | null>(null);

useEffect(() => {
    const fetchParticipants = async () => {
      setError(null);

      try {
        const response = await api.get(`/roomParticipant/room/${roomId}`);

        setParticipants(response.data.data);

      } catch (err) {
        const axiosErr = err as AxiosError<{ message: string }>;
        setError(
          axiosErr.response?.data?.message ?? "Erro ao carregar participantes."
        );
      } 
    };

    fetchParticipants();
  }, [roomId]);

    if (error) return (
        <p className="text-sm text-red-500">{error}</p>
    );

  return (
    <div className="flex flex-col gap-3">

      {/* Counting */}
      <div className="flex items-center gap-2 text-gray-600">
        <Users size={12} />
        <span className="text-sm font-semibold">
          {participants.length} {participants.length === 1 ? "participante" : "participantes"}
        </span>
      </div>

      {/* List */}
      <ul className="flex flex-col gap-2  max-h-48 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-pink-400 scrollbar-track-transparent">
        {participants.map((participant) => (
          <li
            key={participant.id}
            className="flex items-center gap-3 p-2 rounded-lg bg-pink-300 "
          >
            {/* Avatar with Initial*/}
            <div className="h-8 w-8 rounded-full bg-pink-800 flex items-center justify-center text-white font-semibold text-sm">
              {participant.name.charAt(0).toUpperCase()}
            </div>

            <span className="text-sm text-gray-700">{participant.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}