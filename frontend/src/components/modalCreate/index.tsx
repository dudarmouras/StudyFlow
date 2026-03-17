"use client";

import React, { useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { useRouter } from "next/navigation"

import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Button } from "../ui/button"
import { Eye, EyeOff , Pencil, Lock} from "lucide-react"

import api from "../../services/api"
import { AxiosError } from "axios"   

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ApiErrorResponse = {
  message: string;
}

type FormData = {
  roomName: string;
  password: string;
}

export default function CreateRoomModal({isOpen, onClose}: ModalProps) {
    const router = useRouter();
    
    const [apiError, setApiError] = useState<string | null>(null);
    const [apiSuccess, setApiSuccess] = useState<string | null>(null);

    const [showPassword, setShowPassword] = useState(false);
    
    const {
        register, // Connects inputs to react-hook-form
        handleSubmit, // Validates all variables before sending
        reset, // Clean all fields
        formState: { errors, isSubmitting } // Any errors message for each object
    } = useForm<FormData>();

    const onSubmit: SubmitHandler<FormData> = async (data) => {
    setApiError(null);
    setApiSuccess(null);

    try {
      const response = await api.post("/room/create", {
        roomName: data.roomName,
        password: data.password,
      });

        console.log(response.data)

        setApiSuccess(response.data.message);
        reset(); 
        setTimeout(() => {
        onClose();

        router.push("/dashboard");

      }, 1500);

    } catch (err) {
        const axiosErr = err as AxiosError<ApiErrorResponse>;
        setApiError(
        axiosErr.response?.data?.message ?? "Erro inesperado. Tente novamente."
      );
    }
};

if (!isOpen) return null;

    return (
         <div className="fixed inset-0 bg-purple-500/50 flex items-center justify-center overflow-y-auto">
            <div className="bg-pink-100 w-72 rounded-lg border-2 shadow-pink-600">
                <form onSubmit={handleSubmit(onSubmit)}>

                    {apiSuccess && (
                        <p className="mb-4 text-sm text-green-600 bg-green-50 border border-green-200 rounded p-2">
                        {apiSuccess}
                        </p>
                    )}
                    {apiError && (
                        <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
                        {apiError}
                        </p>
                    )}
                
                    <div className="ml-4">
                        <div className="flex justify-end">
                            <Button
                                onClick={onClose}
                                variant="ghost"
                                className="fixed h-6 w-6 mt-1 mr-1 rounded-md font-semibold hover:bg-gray-100 text-pink-800"
                                >
                                ✕
                            </Button>
                        </div>

                        <p className="flex justify-center font-semibold text-[20px] text-pink-900 mt-4 mr-4">Criar Nova Sala:</p>
                    </div>

                    <div className="border-b-2 mt-3 border-purple-300"></div>
                
                    <div className="flex flex-col my-4 mx-4 gap-4">
                    <div>
                        <Label className="font-semibold text-pink-950" htmlFor="roomName"><Pencil size={8} />Nome da sala:</Label>
                        <Input
                        className="h-10 mt-1"
                        id="roomName"
                        type="text"
                        placeholder="Ex: Estudos de Matemática"
                        {...register("roomName", {
                        required: "O Nome da Sala é obrigatório",
                        })}
                        />
                        {errors.roomName && (<p className="text-red-500 text-xs mt-1">{errors.roomName.message}</p>)}
                    </div>

                    <div>
                        <Label className="font-semibold text-pink-950" htmlFor="password"><Lock size={8}/>Sua senha:</Label>
                        <div className="relative">

                        <Input
                        className="h-10 mt-1"
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Crie uma senha segura"
                        {...register("password", {
                            required: "Senha é obrigatória",
                        minLength: {
                            value: 4,
                            message: "A senha precisa ter pelo menos 4 caracteres"
                        }})}
                        />
                        <Button
                            type="button"
                            onClick={() => setShowPassword(prev => !prev)}
                            className="absolute right-2 top-2 text-white bg-pink-500 hover:text-gray-600 text-sm cursor cursor-pointer"
                            aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                        >
                            {showPassword ? <Eye size={10} /> : <EyeOff size={10} />}
                        </Button>
                        {errors.password && (<p className="text-red-500 text-xs mt-1">{errors.password.message}</p>)}
                        </div>
                    </div>

                    <Button type="submit" className="cursor-pointer cursor w-full bg-linear-to-br from-pink-600 to-purple-500 text-white font-bold h-9" disabled={isSubmitting}>Criar</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
    