"use client"

import * as React from "react"
import { useForm, Controller } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Setup } from "@/types"
import { Loader2 } from "lucide-react"

interface SetupFormProps {
    carId: string
    initialData?: Setup
    onSubmit: (data: Omit<Setup, 'id' | 'created_at'>) => Promise<void>
    onCancel: () => void
}

export function SetupForm({ carId, initialData, onSubmit, onCancel }: SetupFormProps) {
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const { register, handleSubmit, control, formState: { errors } } = useForm<Omit<Setup, 'id' | 'created_at'>>({
        defaultValues: initialData ? {
            carId: initialData.carId,
            name: initialData.name,
            sessionType: initialData.sessionType,
            tires: initialData.tires,
            pressure: initialData.pressure,
            fuel: initialData.fuel,
            notes: initialData.notes
        } : {
            carId: carId,
            name: "",
            sessionType: "Qualy",
            tires: "Soft",
            pressure: { fl: "", fr: "", rl: "", rr: "" },
            fuel: "",
            notes: ""
        }
    })

    const onFormSubmit = async (data: Omit<Setup, 'id' | 'created_at'>) => {
        setIsSubmitting(true)
        try {
            await onSubmit({ ...data, carId })
        } catch (error) {
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">Nombre del Setup</Label>
                    <Input
                        id="name"
                        placeholder="Ej: Clasificación Monza"
                        className="bg-white/5 border-white/10 text-white"
                        {...register("name", { required: "El nombre es obligatorio" })}
                    />
                    {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="sessionType" className="text-white">Tipo de Sesión</Label>
                    <Controller
                        name="sessionType"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                    <SelectValue placeholder="Seleccionar tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Qualy">Clasificación</SelectItem>
                                    <SelectItem value="Race">Carrera</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="tires" className="text-white">Neumáticos</Label>
                    <Controller
                        name="tires"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                    <SelectValue placeholder="Seleccionar compuesto" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Soft">Blandos (Soft)</SelectItem>
                                    <SelectItem value="Medium">Medios (Medium)</SelectItem>
                                    <SelectItem value="Hard">Duros (Hard)</SelectItem>
                                    <SelectItem value="Wet">Lluvia (Wet)</SelectItem>
                                    <SelectItem value="Inter">Intermedios</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="fuel" className="text-white">Combustible (L)</Label>
                    <Input
                        id="fuel"
                        placeholder="Ej: 50L"
                        className="bg-white/5 border-white/10 text-white"
                        {...register("fuel")}
                    />
                </div>
            </div>

            <div className="space-y-3">
                <Label className="text-white">Presión de Neumáticos (PSI)</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                        <Label htmlFor="fl" className="text-xs text-white/50">Del. Izq (FL)</Label>
                        <Input
                            id="fl"
                            placeholder="26.5"
                            className="bg-white/5 border-white/10 text-white"
                            {...register("pressure.fl")}
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="fr" className="text-xs text-white/50">Del. Der (FR)</Label>
                        <Input
                            id="fr"
                            placeholder="26.5"
                            className="bg-white/5 border-white/10 text-white"
                            {...register("pressure.fr")}
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="rl" className="text-xs text-white/50">Tras. Izq (RL)</Label>
                        <Input
                            id="rl"
                            placeholder="27.0"
                            className="bg-white/5 border-white/10 text-white"
                            {...register("pressure.rl")}
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="rr" className="text-xs text-white/50">Tras. Der (RR)</Label>
                        <Input
                            id="rr"
                            placeholder="27.0"
                            className="bg-white/5 border-white/10 text-white"
                            {...register("pressure.rr")}
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="notes" className="text-white">Notas Adicionales</Label>
                <Textarea
                    id="notes"
                    placeholder="Detalles de suspensión, alerones, clima..."
                    className="bg-white/5 border-white/10 text-white min-h-[100px]"
                    {...register("notes")}
                />
            </div>

            <div className="flex gap-3 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    className="flex-1 border-white/10 text-white hover:bg-white/10 hover:text-white"
                >
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={isSubmitting}
                >
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Guardar Setup
                </Button>
            </div>
        </form>
    )
}
