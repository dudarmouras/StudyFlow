"use client"

import { useEffect, useState, useRef } from "react"
import { createPortal } from "react-dom"
import api from "@/services/api"
import { AxiosError } from "axios"
import { Plus, Check, MoreVertical, Pencil, Trash2 } from "lucide-react"
import { Input } from "../ui/input"
import { useSocket } from '@/hooks/useSocket'

type Task = {
  id: string
  title: string
  isDone: boolean
  userId: string
}

type Props = {
  roomId: string
  currentUserId: string
}

export default function TaskList({ roomId, currentUserId }: Props) {
  const [tasks, setTasks]               = useState<Task[]>([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState<string | null>(null)
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [editingId, setEditingId]       = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState("")
  const [openMenuId, setOpenMenuId]     = useState<string | null>(null)
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const socket = useSocket(roomId)

  useEffect(() => {
    if (!socket) return

    socket.off('task-created')
    socket.off('task-updated')
    socket.off('task-deleted')
    socket.off('user-tasks-cleared')

    socket.on('task-created', (task: Task) => {
      setTasks(prev => prev.find(t => t.id === task.id) ? prev : [...prev, task])
    })
    socket.on('task-updated', (task: Task) => {
      setTasks(prev => prev.map(t => t.id === task.id ? task : t))
    })
    socket.on('task-deleted', (taskId: string) => {
      setTasks(prev => prev.filter(t => t.id !== taskId))
    })
    socket.on('user-tasks-cleared', (userId: string) => {
      setTasks(prev => prev.filter(t => t.userId !== userId))
    })

    return () => {
      socket.off('task-created')
      socket.off('task-updated')
      socket.off('task-deleted')
      socket.off('user-tasks-cleared')
    }
  }, [socket])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null)
        setMenuPosition(null)
      }
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true)
      try {
        const response = await api.get(`/tasks/room/${roomId}`)
        setTasks(response.data.data)
      } catch (err) {
        const axiosErr = err as AxiosError<{ message: string }>
        setError(axiosErr.response?.data?.message ?? "Erro ao carregar tasks.")
      } finally {
        setLoading(false)
      }
    }
    fetchTasks()
  }, [roomId])

  const handleCreate = async () => {
    if (!newTaskTitle.trim()) return
    try {
      await api.post("/tasks/create", { title: newTaskTitle, roomId })
      setNewTaskTitle("")
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>
      setError(axiosErr.response?.data?.message ?? "Erro ao criar task.")
    }
  }

  const handleToggle = async (task: Task) => {
    try {
      await api.put(`/tasks/${task.id}`, { isDone: !task.isDone })
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>
      setError(axiosErr.response?.data?.message ?? "Erro ao atualizar task.")
    }
  }

  const handleEdit = async (taskId: string) => {
    if (!editingTitle.trim()) return
    try {
      await api.put(`/tasks/${taskId}`, { title: editingTitle })
      setEditingId(null)
      setEditingTitle("")
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>
      setError(axiosErr.response?.data?.message ?? "Erro ao editar task.")
    }
  }

  const handleDelete = async (taskId: string) => {
    try {
      await api.delete(`/tasks/${taskId}`)
      setOpenMenuId(null)
      setMenuPosition(null)
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>
      setError(axiosErr.response?.data?.message ?? "Erro ao deletar task.")
    }
  }

  if (loading) return <p className="text-sm text-gray-400">Carregando tasks...</p>
  if (error)   return <p className="text-sm text-red-500">{error}</p>

  const myTasks    = tasks.filter(t => t.userId === currentUserId)
  const otherTasks = tasks.filter(t => t.userId !== currentUserId)

  const progressPercent = myTasks.length === 0
    ? 0
    : Math.round((myTasks.filter(t => t.isDone).length / myTasks.length) * 100)

  return (
    <div className="flex flex-col gap-6">

      <div className="flex flex-col gap-3">

        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-pink-600 text-lg">Minhas Tasks</h2>
            <span className="text-xs text-gray-400">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-pink-100 rounded-full overflow-hidden">
            <div
              className="h-2 bg-pink-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <ul className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
          {myTasks.map(task => (
            <li key={task.id} className="flex items-center gap-2 p-2 rounded-lg bg-pink-50 border border-pink-100">

              <button
                onClick={() => handleToggle(task)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                  task.isDone ? 'bg-pink-500 border-pink-500' : 'border-gray-300 hover:border-pink-400'
                }`}
              >
                {task.isDone && <Check size={10} className="text-white" />}
              </button>

              {editingId === task.id ? (
                <Input
                  autoFocus
                  value={editingTitle}
                  onChange={e => setEditingTitle(e.target.value)}
                  className="h-7 text-sm flex-1"
                  onKeyDown={e => e.key === 'Enter' && handleEdit(task.id)}
                  onBlur={() => handleEdit(task.id)}
                />
              ) : (
                <span className={`flex-1 text-sm ${task.isDone ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                  {task.title}
                </span>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (openMenuId === task.id) {
                    setOpenMenuId(null)
                    setMenuPosition(null)
                  } else {
                    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
                    setMenuPosition({ top: rect.bottom + 4, left: rect.right - 128 })
                    setOpenMenuId(task.id)
                  }
                }}
                className="text-gray-400 hover:text-pink-500 p-1 rounded"
              >
                <MoreVertical size={14} />
              </button>

            </li>
          ))}

          {myTasks.length === 0 && (
            <p className="text-sm text-purple-400">Nenhuma task ainda. Crie uma!</p>
          )}
        </ul>

        <div className="flex gap-2 mt-1">
          <Input
            value={newTaskTitle}
            onChange={e => setNewTaskTitle(e.target.value)}
            placeholder="Nova tarefa..."
            className="h-9 text-sm"
            onKeyDown={e => e.key === 'Enter' && handleCreate()}
          />
          <button
            onClick={handleCreate}
            className="h-9 w-9 shrink-0 bg-pink-500 hover:bg-pink-600 text-white rounded-lg flex items-center justify-center"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {otherTasks.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className="font-semibold text-purple-700 text-lg">Tasks dos colegas</h2>
          <ul className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
            {otherTasks.map(task => (
              <li key={task.id} className="flex items-center gap-2 p-2 rounded-lg bg-purple-50 border border-purple-100">
                <div className={`w-5 h-5 rounded border-2 shrink-0 flex items-center justify-center ${
                  task.isDone ? 'bg-purple-400 border-purple-400' : 'border-gray-300'
                }`}>
                  {task.isDone && <Check size={10} className="text-white" />}
                </div>
                <span className={`text-sm ${task.isDone ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                  {task.title}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {openMenuId && menuPosition && tasks.find(t => t.id === openMenuId) && createPortal(
        <div
          ref={menuRef}
          className="fixed z-[9999] bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-32"
          style={{ top: menuPosition.top, left: menuPosition.left }}
        >
          <button
            onClick={() => {
              const task = tasks.find(t => t.id === openMenuId)!
              setEditingId(task.id)
              setEditingTitle(task.title)
              setOpenMenuId(null)
              setMenuPosition(null)
            }}
            className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-gray-700 hover:bg-pink-50"
          >
            <Pencil size={12} /> Editar
          </button>
          <button
            onClick={() => handleDelete(openMenuId)}
            className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-red-500 hover:bg-red-50"
          >
            <Trash2 size={12} /> Excluir
          </button>
        </div>,
        document.body
      )}

    </div>
  )
}