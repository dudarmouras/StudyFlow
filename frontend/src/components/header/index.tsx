import { Sparkles } from 'lucide-react';

interface Header {
    roomName: string;
    roomCode: string;
}

export default function Header({roomName, roomCode}:Header){
    return (
       <div className="fixed top-4 w-100% left-0 right-0 mx-8 h-20 rounded-2xl border shadow-[#ae44c6] shadow-2x1 border-gray-300 flex-row items-center flex gap-3">
            
            <div className='border rounded-xl w-12 h-12 flex justify-center items-center bg-linear-to-br from-pink-400 to-purple-500 ml-4'>
                <Sparkles className='flex justify-center items-center w-8 h-8 text-white'/>
            </div>

            <div className="flex flex-col">

                <div className='font-semibold text-gray-800 text-xl '>{roomName}</div>

                <div className="flex flex-row font-light text-gray-800 text-md">
                    <p>Código: </p>
                    <p>{roomCode}</p>
                </div>
            </div>
       </div>
    );
}
