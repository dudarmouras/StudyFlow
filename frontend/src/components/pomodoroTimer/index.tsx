"use client"

import { useEffect, useState, useCallback } from "react"
import { RotateCcw, Pause, Play, AlarmClock} from "lucide-react"
import { Button } from "../ui/button"
import { useSocket } from "@/hooks/useSocket"

type Mode = "pomodoro" | "shortBreak" | "longBreak"

const TIMES: Record<Mode, number> = {
  pomodoro:   25 * 60,
  shortBreak:  5 * 60,
  longBreak:  15 * 60,
}

const LABELS: Record<Mode, string> = {
  pomodoro:   "Pomodoro",
  shortBreak: "Pausa Curta",
  longBreak:  "Pausa Longa",
}

type Props = {
  roomId: string
}

export default function PomodoroTimer({ roomId }: Props) {
  const [mode, setMode]       = useState<Mode>("pomodoro")
  const [seconds, setSeconds] = useState(TIMES["pomodoro"])
  const [running, setRunning] = useState(false)

  const socket = useSocket(roomId)

    useEffect(() => {
    if (!socket) return

    socket.off('timer-start')
    socket.off('timer-pause')
    socket.off('timer-reset')
    socket.off('timer-mode')

    socket.on('timer-start', () => setRunning(true))
    socket.on('timer-pause', () => setRunning(false))
    socket.on('timer-reset', (incomingMode: Mode) => {
      setMode(incomingMode)
      setSeconds(TIMES[incomingMode])
      setRunning(false)
    })
    socket.on('timer-mode', (incomingMode: Mode) => {
      setMode(incomingMode)
      setSeconds(TIMES[incomingMode])
      setRunning(false)
    })

    return () => {
      socket.off('timer-start')
      socket.off('timer-pause')
      socket.off('timer-reset')
      socket.off('timer-mode')
    }
  }, [socket])

  // ── Change Mode ────────────────────────────────
  const handleMode = (newMode: Mode) => {
    setMode(newMode)
    setSeconds(TIMES[newMode])
    setRunning(false)
    socket?.emit('timer-mode', { roomId, mode: newMode })
  }

  // ── Reset ────────────────────────────────────────
  const handleReset = useCallback(() => {
    setSeconds(TIMES[mode])
    setRunning(false)
    socket?.emit('timer-reset', { roomId, mode })
  }, [mode, roomId, socket])

  // ── Play/Pause — emite para os outros ────────────
  const handleToggle = () => {
    const next = !running
    setRunning(next)
    socket?.emit(next ? 'timer-start' : 'timer-pause', roomId)
  }

  // ── Tick ─────────────────────────────────────────
    useEffect(() => {
    if (!running) return

    const interval = setInterval(() => {
        setSeconds((prev) => {
        // Se o próximo valor for chegar a zero (ou menos)
        if (prev <= 1) {
            setRunning(false)
            clearInterval(interval)
            return 0
        }
        return prev - 1
        })
    }, 1000)

    return () => clearInterval(interval)
    }, [running]) 


  // ── Format mm:ss ────────────────────────────────
  const display = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`

  // ── Circular Progress ───────────────────────────
  const total    = TIMES[mode]
  const progress = (seconds / total) * 100
  const size     = 156
  const stroke   = 8
  const center   = size / 2
  const radius   = (size - stroke) / 2
  const circ     = 2 * Math.PI * radius
  const offset   = circ - (progress / 100) * circ

  return (
    <div className="bg-white rounded-2xl p-4 shadow-md flex flex-col gap-4 items-center">

      {/* Title */}
      <div className="flex items-center gap-2 self-start">
        <AlarmClock className="text-pink-600 text-md"/>
        <span className="font-bold text-md text-pink-600">Pomodoro Timer</span>
      </div>

      {/* Mode Selector */}
      <div className="flex gap-1 bg-pink-50 rounded-xl p-1 w-full">
        {(["pomodoro", "shortBreak", "longBreak"] as Mode[]).map(m => (
          <button
            key={m}
            onClick={() => handleMode(m)}
            className={`flex-1 text-xs py-1.5 rounded-lg font-medium transition-colors cursor cursor-pointer ${
              mode === m
                ? "bg-[#c378d4] text-white shadow"
                : "text-gray-500 hover:text-pink-500"
            }`}
          >
            {LABELS[m]}
          </button>
        ))}
      </div>

      {/* Progress circle */}
      <div className="flex justify-center">
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
          <svg className="absolute inset-0 -rotate-90" width={size} height={size}>
            {/* trail */}
            <circle
              cx={center} cy={center} r={radius}
              fill="none" stroke="#fce7f3" strokeWidth={stroke}
            />
            {/* progress */}
            <circle
              cx={center} cy={center} r={radius}
              fill="none" stroke="#c378d4" strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={offset}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="flex flex-col items-center z-10">
            <span className="text-4xl font-bold text-gray-800">{display}</span>
            <span className="text-xs text-gray-400 mt-1">{LABELS[mode]}</span>
          </div>
        </div>
      </div>

      {/* Control */}
      <div className="flex items-center justify-center gap-4 w-full">
        <button
          onClick={handleReset}
          className="text-gray-400 hover:text-pink-500 transition-colors cursor cursor-pointer"
        >
          <RotateCcw size={18} />
        </button>

        <Button
          onClick={handleToggle}
          className="cursor cursor-pointer bg-pink-500 hover:bg-pink-600 text-white px-8 h-10 rounded-xl font-semibold"
        >
          {running
            ? <><Pause size={16} className="mr-2" /> Pausar</>
            : <><Play  size={16} className="mr-2" /> Iniciar</>
          }
        </Button>
      </div>

    </div>
  )
}