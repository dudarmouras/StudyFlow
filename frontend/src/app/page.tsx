"use client";

import CardInformation from "@/components/cardInformation";
import RegisterModal from "@/components/modalRegister";
import LoginModal from "@/components/modalLogin";
import { Button } from "@/components/ui/button";

import React from 'react'
import { Users , Sparkles, Timer, ListCheck } from 'lucide-react'

export default function Home() {

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isLoginOpen, setIsLoginOpen] = React.useState(false);

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
        
        <div className="p-px rounded-md bg-linear-to-br from-pink-600 to-purple-500 shadow-md">
          <Button className= 'h-12 w-full rounded-md bg-white text-pink-600 hover:bg-white hover:-translate-y-1 hover:scale-110 hover:text-pink-500 py-2 sm:py-2.5 sm:px-8 text-base sm:text-lg cursor-pointer transition delay-150 duration-300 ease-in-out active:translate-y-0.5 active:opacity-80'
            onClick={() => setIsLoginOpen(true)}>
            Login
          </Button>
        </div>

          <LoginModal
            isOpen={isLoginOpen}
            onClose={() => setIsLoginOpen(false)}
          />
        
          <Button className="h-12 bg-linear-to-br from-pink-600 to-purple-500 transition delay-150 hover:-translate-y-1 hover:scale-110 hover:text-pink-500 text-white! shadow-md py-2 sm:py-2.5 sm:px-8 text-base sm:text-lg cursor-pointer duration-300 ease-in-out active:translate-y-0.5 active:opacity-80"
            onClick={() => setIsModalOpen(true)}>
            Cadastre-se
          </Button>

          <RegisterModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
          </div>

        <section className="flex flex-row gap-4 justify-center items-center">
          <CardInformation 
            icon={Users} 
            title="Estude em Grupo" 
            description="Convide amigos e acompanhe o progresso de todos em tempo real" 
            />

          <CardInformation 
            icon={ListCheck} 
            title="Gerencie tarefas" 
            description="Organize suas tarefas e marque como concluídas" 
            />

          <CardInformation 
            icon={Timer} 
            title="Pomodoro Timer" 
            description="Foque nos estudos com Timer personalizável" 
            />
        </section>

      </main>
    </div>
  );
}
