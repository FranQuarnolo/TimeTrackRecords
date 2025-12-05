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
import { toast } from "sonner"
import { Fuel, Thermometer, Disc, StickyNote, Type, Gauge, Loader } from "lucide-react"

// ... (imports remain the same, just adding icons)

export function SetupForm({ carId, initialData, onSubmit, onCancel }: any) {
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
            toast.success("Setup guardado correctamente")
        } catch (error: any) {
            console.error(error)
            toast.error(error.message || "Error al guardar el setup")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="name" className="text-white flex items-center gap-2">
                        <Type className="h-4 w-4 text-primary" />
                        Nombre del Setup
                    </Label>
                    <div className="relative">
                        <Input
                            id="name"
                            placeholder="Ej: Clasificación Monza"
                            className="bg-black/40 border-white/10 text-white focus:border-primary/50 transition-colors pl-4"
                            {...register("name", { required: "El nombre es obligatorio" })}
                        />
                    </div>
                    {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="sessionType" className="text-white flex items-center gap-2">
                        <Gauge className="h-4 w-4 text-primary" />
                        Tipo de Sesión
                    </Label>
                    <Controller
                        name="sessionType"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger className="bg-black/40 border-white/10 text-white focus:border-primary/50 transition-colors">
                                    <SelectValue placeholder="Seleccionar tipo" />
                                </SelectTrigger>
                                <SelectContent className="bg-black border-white/10 text-white">
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
                    <Label htmlFor="tires" className="text-white flex items-center gap-2">
                        <Disc className="h-4 w-4 text-primary" />
                        Neumáticos
                    </Label>
                    <Controller
                        name="tires"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger className="bg-black/40 border-white/10 text-white focus:border-primary/50 transition-colors">
                                    <SelectValue placeholder="Seleccionar compuesto" />
                                </SelectTrigger>
                                <SelectContent className="bg-black border-white/10 text-white">
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
                    <Label htmlFor="fuel" className="text-white flex items-center gap-2">
                        <Fuel className="h-4 w-4 text-primary" />
                        Combustible (L)
                    </Label>
                    <Input
                        id="fuel"
                        placeholder="Ej: 50L"
                        className="bg-black/40 border-white/10 text-white focus:border-primary/50 transition-colors"
                        {...register("fuel")}
                    />
                </div>
            </div>

            <div className="space-y-4 bg-white/5 p-4 rounded-xl border border-white/10">
                <Label className="text-white flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-primary" />
                    Presión de Neumáticos (PSI)
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                        <Label htmlFor="fl" className="text-xs text-white/50 uppercase tracking-wider">Del. Izq</Label>
                        <Input
                            id="fl"
                            placeholder="26.5"
                            className="bg-black/40 border-white/10 text-white text-center font-mono focus:border-primary/50"
                            {...register("pressure.fl")}
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="fr" className="text-xs text-white/50 uppercase tracking-wider">Del. Der</Label>
                        <Input
                            id="fr"
                            placeholder="26.5"
                            className="bg-black/40 border-white/10 text-white text-center font-mono focus:border-primary/50"
                            {...register("pressure.fr")}
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="rl" className="text-xs text-white/50 uppercase tracking-wider">Tras. Izq</Label>
                        <Input
                            id="rl"
                            placeholder="27.0"
                            className="bg-black/40 border-white/10 text-white text-center font-mono focus:border-primary/50"
                            {...register("pressure.rl")}
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="rr" className="text-xs text-white/50 uppercase tracking-wider">Tras. Der</Label>
                        <Input
                            id="rr"
                            placeholder="27.0"
                            className="bg-black/40 border-white/10 text-white text-center font-mono focus:border-primary/50"
                            {...register("pressure.rr")}
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="notes" className="text-white flex items-center gap-2">
                    <StickyNote className="h-4 w-4 text-primary" />
                    Notas Adicionales
                </Label>
                <Textarea
                    id="notes"
                    placeholder="Detalles de suspensión, alerones, clima..."
                    className="bg-black/40 border-white/10 text-white min-h-[100px] focus:border-primary/50 transition-colors resize-none"
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
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
                    disabled={isSubmitting}
                >
                    {isSubmitting && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                    Guardar Setup
                </Button>
            </div>
        </form>
    )
}
