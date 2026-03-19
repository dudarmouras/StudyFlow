"use client";

import React, { useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { useRouter } from "next/navigation"

import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Button } from "../ui/button"
import { Eye, EyeOff } from "lucide-react"

import api from "../../services/api"
import { AxiosError } from "axios"   

interface ModalLoginProps {
  isOpen: boolean;
  onClose: () => void;
}

type ApiErrorResponse = {
  message: string;
}

type FormLoginData = {
  email: string;
  password: string;
}

export default function LoginModal({isOpen, onClose}: ModalLoginProps) {
    const router = useRouter();

    const [apiError, setApiError] = useState<string | null>(null);
    const [apiSuccess, setApiSuccess] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register, // Connects inputs to react-hook-form
        handleSubmit, // Validates all variables before sending
        reset, // Clean all fields
        formState: { errors, isSubmitting } // Any errors message for each object
    } = useForm<FormLoginData>();

    const onSubmit: SubmitHandler<FormLoginData> = async (data) => {
        setApiError(null);
        setApiSuccess(null);

        try {
        const response = await api.post("/login", {
            email: data.email,
            password: data.password,
      });

        console.log(response.data)

        // Save the Bearer token
        const token = response.data.token;
        localStorage.setItem("token", token);

        setApiSuccess(response.data.message);
        reset(); 

        setTimeout(() => {
            onClose();
        router.push("/dashboard");
        }, 1500);

    } catch (err) {
        const axiosErr = err as AxiosError<ApiErrorResponse>;
        setApiError(
        axiosErr.response?.data?.message ?? "Email ou senha inválidos"
      );
    }
};

if (!isOpen) return null;

    return (
         <div className="fixed inset-0 bg-purple-300/60 transition-colors flex items-center justify-center overflow-y-auto">
            <div className="bg-white w-72 rounded-lg border-2 shadow-pink-600">
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
                                className="cursor-pointer cursor fixed h-6 w-6 mt-1 mr-1 rounded-md font-semibold hover:bg-gray-100 text-pink-800"
                                >
                                ✕
                            </Button>
                        </div>

                        <p className="font-semibold text-[20px] text-gray-700 mt-4">Login:</p>
                    </div>

                    <div className="border-b-2 mt-3 border-purple-300"></div>
                
                    <div className="flex flex-col my-4 mx-4 gap-4">

                    <div>
                        <Label className="font-semibold" htmlFor="email">Email:</Label>
                        <Input
                        className="h-10 mt-1"
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
                        {errors.email && (<p className="text-red-500 text-xs mt-1">{errors.email.message}</p>)}
                    </div>

                    <div>
                        <Label className="font-semibold" htmlFor="password">Sua senha:</Label>
                        <div className="relative">

                        <Input
                            className="h-10 mt-1"
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Digite a senha"
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
                            className="absolute right-2 top-2 text-white bg-pink-500 hover:text-gray-600 text-sm cursor cursor-pointer"
                            aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                        >
                            {showPassword ? <Eye size={10} /> : <EyeOff size={10} />}
                        </Button>
                        {errors.password && (<p className="text-red-500 text-xs mt-1">{errors.password.message}</p>)}
                        </div>
                    </div>

                    <Button type="submit" className="cursor-pointer cursor w-full bg-linear-to-br from-pink-600 to-purple-500 text-white font-bold h-9" disabled={isSubmitting}>Cadastrar</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
    