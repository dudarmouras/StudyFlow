import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export function useSocket(roomId: string) {
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    if (!roomId) return

    const newSocket = io(SOCKET_URL)
    newSocket.emit('join-room', roomId)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSocket(newSocket)

    return () => {
      newSocket.emit('leave-room', roomId)
      newSocket.disconnect()
      setSocket(null)
    }
  }, [roomId])

  return socket
}