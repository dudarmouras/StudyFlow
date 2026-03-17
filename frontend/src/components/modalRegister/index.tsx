"use client";

import { useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { useRouter } from "next/navigation"

import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Button } from "../ui/button"
import { Eye, EyeOff } from "lucide-react"

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
  name: string;
  email: string;
  password: string;
}

export default function RegisterModal({isOpen, onClose}: ModalProps) {
    const router = useRouter();
    const [apiError, setApiError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);const [apiSuccess, setApiSuccess] = useState<string | null>(null);

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
      const response = await api.post("/user", {
        name: data.name,
        email: data.email,
        password: data.password,
      });

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
         <div className="fixed inset-0 bg-purple-500 flex items-center justify-center z-50 overflow-y-auto my-10">
            <div className="bg-white rounded-lg shadow-x">
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
                
                    <Button
                        onClick={onClose}
                        variant="ghost"
                        className="absolute top-2 right-2 h-6 w-6 rounded-full hover:bg-gray-100"
                        >
                        ✕
                    </Button>

                    <p>Cadastrar Nova Conta:</p>

                    <div>
                        <Label htmlFor="name">Seu nome:</Label>
                        <Input
                        id="name"
                        type="text"
                        placeholder="Como você quer ser chamado?"
                        {...register("name", {
                        required: "O Nome é obrigatório",
                        minLength: {
                        value: 3,
                        message: "O Nome precisa ter pelo menos 3 caracteres"
                    }})}
                        />
                        {errors.name && (<p className="text-red-500 text-xs mt-1">{errors.name.message}</p>)}
                    </div>

                    <div>
                        <Label htmlFor="email">Email:</Label>
                        <Input
                        id="email"
                        type="email"
                        placeholder="ex: seu@email.com"
                        {...register("email",{
                            required: "O Email é obrigatório",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Digite um email válido"
                            }})}
                        />
                        {errors.email && <p style={{color: "#f00"}}>{errors.email.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="password">Sua senha:</Label>
                        <div className="relative">

                        <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Crie uma senha segura"
                        {...register("password", {
                        required: "Senha é obrigatória",
                        minLength: {
                            value: 8,
                            message: "A senha precisa ter pelo menos 8 caracteres"
                        }})}
                        />
                        <Button
                            type="button"
                            onClick={() => setShowPassword(prev => !prev)}
                            className="absolute right-3 top-1/2 text-gray-400 hover:text-gray-600 text-sm cursor cursor-pointer"
                            aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                        >
                            {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                        </Button>
                        {errors.password && <p style={{color: "#f00"}}>{errors.password.message}</p>}
                        </div>
                    </div>

                    <Button type="submit" className="cursor-pointer cursor w-full" disabled={isSubmitting}>Cadastrar</Button>
                </form>
            </div>
        </div>
    )
}
    