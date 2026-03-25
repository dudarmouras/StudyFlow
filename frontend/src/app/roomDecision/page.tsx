"use client";

import ModalCreate from "@/components/modalCreate";
import ModalJoin from "@/components/modalJoin";
import { Button } from "@/components/ui/button";

import React from 'react'
import { Sparkles } from 'lucide-react'

export default function RoomDecision() {

  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [isJoinOpen, setIsJoinOpen] = React.useState(false);

  return (
    <div className="bg-pink-100 min-h-screen w-full">
      <main className="mx-auto w-full py-16 flex flex-col gap-8">

        <section className="px-4 flex flex-col gap-8">
          <div className="flex flex-col gap-4 justify-center items-center mt-6">
             <div className='border rounded-2xl w-20 h-20 flex justify-center shadow-md  shadow-pink-300 items-center bg-linear-to-br from-pink-600 to-purple-500 ml-4'>
                <Sparkles className='flex justify-center items-center w-8 h-8 text-white'/>
            </div>

            <div className="flex flex-row text-6xl font-bold">
              <p className="text-black antialiased">Study</p>
              <p className="text-pink-500 antialiased">Flow</p>
            </div>

            <div className="w-160 text-gray-700">
              <p className="text-xl flex justify-center items-center">Crie salas de estudo, acompanhe suas tarefas e mantenha o foco com</p>
              <p className="text-xl flex justify-center items-center"> seus amigos usando o timer Pomodoro</p>
            </div>
          </div>
        </section>

        <div className="flex flex-wrap gap-8 justify-center items-center">


        <div className="flex flex-col">
            <p className="text-pink-700 font-semibold text-2xl flex justify-center items-center mt-8">Escolha entre criar uma sala para você e seus amigos ou entrar uma sala já criada:</p>
            
            <div className="flex flex-row gap-6 justify-center items-center mt-12">

            <Button className= 'text-2xl border-2 shadow-2xl shadow-pink-500 border-pink-600 h-20 w-64 rounded-md bg-pink-200 text-pink-600 hover:text-pink-100 hover:border-purple-600 font-bold hover:bg-pink-600 hover:-translate-y-1 hover:scale-110 py-2 sm:py-2.5 sm:px-8 sm:text-lg cursor-pointer transition delay-150 duration-300 ease-in-out active:translate-y-0.5 active:opacity-80'
                onClick={() => setIsJoinOpen(true)}>
                Entrar em Sala
            </Button>
        

            <ModalJoin
                isOpen={isJoinOpen}
                onClose={() => setIsJoinOpen(false)}
                />
            
            <Button className="text-2xl shadow-2xl shadow-purple-400 h-20 w-64 transition delay-150 hover:-translate-y-1 bg-purple-200 border-2 border-purple-600 font-bold hover:scale-110 hover:text-purple-100 hover:border-pink-400 hover:bg-purple-600 text-purple-600 py-2 sm:py-2.5 sm:px-8 sm:text-lg cursor-pointer duration-300 ease-in-out active:translate-y-0.5 active:opacity-80"
                onClick={() => setIsCreateOpen(true)}>
                Criar Sala
            </Button>

            <ModalCreate
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                />
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
