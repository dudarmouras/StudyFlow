"use client";

import CardInformation from "@/components/cardInformation";
import Header from "@/components/header";
import RegisterModal from "@/components/modalRegister";
import { Button

 } from "@/components/ui/button";
import React from 'react'
import { Users } from 'lucide-react'

export default function Home() {

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
      <Header
        roomName="Estudos Duda"
        roomCode="#12A3DF"/>
       <CardInformation 
        icon={Users} 
        title="Estude em Grupo" 
        description="Convide amigos e acompanhe o progresso de todos em tempo real" 
    />
    <Button className="bg-red-700! text-white! shadow-md hover:bg-red-800! hover:text-white py-2 sm:py-2.5 px-6 sm:px-8 text-base sm:text-lg cursor-pointer transition-all duration-150 active:translate-y-0.5 active:opacity-80 active:shadow-none"
      onClick={() => setIsModalOpen(true)}>
      Cadastre-se
    </Button>

    <RegisterModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
    />
   
      </main>
    </div>
  );
}
