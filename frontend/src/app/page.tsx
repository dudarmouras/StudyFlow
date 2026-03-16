import CardInformation from "@/components/cardInformation";
import Header from "@/components/header";

import { Users } from 'lucide-react'
export default function Home() {

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
      </main>
    </div>
  );
}
