"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Upload, User as UserIcon, Mail, Lock, AlertCircle, CheckCircle2, ChevronLeft } from "lucide-react"

export default function SettingsPage() {
    const { user, loading: authLoading } = useAuth()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    // Form states
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
    const [uploading, setUploading] = useState(false)

    const isGoogleAuth = user?.app_metadata?.provider === 'google'

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login')
        }
        if (user) {
            setEmail(user.email || "")
            setAvatarUrl(user.user_metadata?.avatar_url || null)

            // Fetch username from profiles table
            const fetchProfile = async () => {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('username')
                    .eq('id', user.id)
                    .single()

                if (data) {
                    setUsername((data as any).username || user.user_metadata?.username || "")
                }
            }
            fetchProfile()
        }
    }, [user, authLoading, router])

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        try {
            if (isGoogleAuth) {
                // Only update avatar if changed (handled separately usually, but here we might just save other things if any)
                // Actually, if Google Auth, we only allow Avatar update which is handled by the file input change immediately or a separate button?
                // The prompt says "guardar los datos". So maybe a single save button.
                // But for Avatar, usually it's uploaded immediately or upon save. I'll do it upon save if I had a file object, but here I'll implement immediate upload for avatar to get the URL, then save the URL.
            } else {
                // Update Email/Password if changed
                if (email !== user?.email) {
                    const { error } = await supabase.auth.updateUser({ email })
                    if (error) throw error
                }

                if (password) {
                    if (password !== confirmPassword) {
                        throw new Error("Las contraseñas no coinciden")
                    }
                    const { error } = await supabase.auth.updateUser({ password })
                    if (error) throw error
                }

                if (!user) throw new Error("No user found");

                // Update Username in profiles
                const { error: profileError } = await supabase
                    .from('profiles')
                    .update({ username } as any)
                    .eq('id', user.id)

                if (profileError) throw profileError

                // Also update metadata for consistency if needed, but profiles is the source of truth for username in this app
                await supabase.auth.updateUser({
                    data: { username }
                })
            }

            setMessage({ type: 'success', text: "Perfil actualizado correctamente" })
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || "Error al actualizar el perfil" })
        } finally {
            setLoading(false)
        }
    }

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true)
            setMessage(null)

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('Debe seleccionar una imagen para subir.')
            }

            const file = event.target.files[0]
            const fileExt = file.name.split('.').pop()
            const fileName = `${user?.id}-${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file)

            if (uploadError) {
                throw uploadError
            }

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath)

            setAvatarUrl(publicUrl)

            // Update user metadata with new avatar URL immediately or wait for save?
            // Usually better to wait for save, but for avatar it's often immediate.
            // The prompt says "guardar los datos", implying a save button.
            // But I need to store this URL to save it later.
            // However, if I don't save it to Auth/Profile now, a refresh will lose it.
            // I will update the auth metadata immediately for the avatar to show it persists, 
            // or just keep it in state and save on "Guardar Cambios".
            // Let's save it immediately to metadata to be safe, or just state.
            // I'll stick to state and save on "Guardar Cambios" to be consistent with "guardar los datos".
            // BUT, if I upload and don't save, the file is orphaned. That's fine for now.

            // Actually, for better UX, I'll update the local state and let the main "Guardar" button commit it to the DB/Auth.
            // Wait, if I update `avatarUrl` state, I need to send it in `handleUpdateProfile`.

            // Let's add avatar update to `handleUpdateProfile`.

        } catch (error: any) {
            setMessage({ type: 'error', text: error.message })
        } finally {
            setUploading(false)
        }
    }

    // We need to update handleUpdateProfile to include avatar update
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        try {
            const updates: any = {}

            // Avatar update (for both Google and Email users)
            if (avatarUrl && avatarUrl !== user?.user_metadata?.avatar_url) {
                updates.data = { ...updates.data, avatar_url: avatarUrl }
            }

            if (!isGoogleAuth) {
                // Email
                if (email !== user?.email) {
                    updates.email = email
                }
                // Password
                if (password) {
                    if (password !== confirmPassword) {
                        throw new Error("Las contraseñas no coinciden")
                    }
                    updates.password = password
                }
                // Username (in profiles table)
                if (!user) throw new Error("No user found");

                const { error: profileError } = await supabase
                    .from('profiles')
                    .update({ username } as any)
                    .eq('id', user.id)

                if (profileError) throw profileError

                // Sync username to metadata
                updates.data = { ...updates.data, username }
            }

            if (Object.keys(updates).length > 0) {
                const { error } = await supabase.auth.updateUser(updates)
                if (error) throw error
            }

            setMessage({ type: 'success', text: "Perfil actualizado correctamente" })
            setPassword("")
            setConfirmPassword("")
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || "Error al actualizar el perfil" })
        } finally {
            setLoading(false)
        }
    }

    if (authLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-black text-white">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-8 pt-20">
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex flex-col gap-4">
                    <div className="flex justify-start">
                        <Button
                            variant="ghost"
                            onClick={() => router.back()}
                            className="text-primary hover:text-primary/80 hover:bg-primary/10 pl-0 gap-2"
                        >
                            <ChevronLeft className="h-5 w-5" />
                            Volver
                        </Button>
                    </div>
                    <h1 className="text-4xl font-black italic uppercase tracking-tighter">Configuración</h1>
                </div>

                <Card className="bg-white/5 border-white/10 text-white">
                    <CardHeader>
                        <CardTitle>Perfil de Usuario</CardTitle>
                        <CardDescription className="text-white/60">
                            Administra tu información personal y cuenta.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {message && (
                            <Alert variant={message.type === 'success' ? 'default' : 'destructive'} className={message.type === 'success' ? "border-green-500/50 text-green-500 bg-green-500/10" : "border-red-500/50 text-red-500 bg-red-500/10"}>
                                {message.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                                <AlertTitle>{message.type === 'success' ? "Éxito" : "Error"}</AlertTitle>
                                <AlertDescription>{message.text}</AlertDescription>
                            </Alert>
                        )}

                        <div className="flex flex-col items-center gap-4 py-4">
                            <div className="relative group">
                                <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-primary/50 bg-white/5 flex items-center justify-center">
                                    {avatarUrl ? (
                                        <Image src={avatarUrl} alt="Avatar" fill className="object-cover" unoptimized />
                                    ) : (
                                        <UserIcon className="h-12 w-12 text-white/20" />
                                    )}
                                </div>
                                <label
                                    htmlFor="avatar-upload"
                                    className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full"
                                >
                                    {uploading ? (
                                        <Loader2 className="h-6 w-6 animate-spin text-white" />
                                    ) : (
                                        <Upload className="h-6 w-6 text-white" />
                                    )}
                                </label>
                                <input
                                    id="avatar-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleAvatarUpload}
                                    disabled={uploading}
                                />
                            </div>
                            <p className="text-sm text-white/40">Click en la imagen para cambiar</p>
                        </div>

                        <form onSubmit={handleSave} className="space-y-4">
                            {!isGoogleAuth && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="username">Nombre de Usuario</Label>
                                        <div className="relative">
                                            <UserIcon className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                                            <Input
                                                id="username"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                className="pl-9 bg-white/5 border-white/10 text-white"
                                                placeholder="Tu nombre de usuario"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Correo Electrónico</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                                            <Input
                                                id="email"
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="pl-9 bg-white/5 border-white/10 text-white"
                                                placeholder="tu@email.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="password">Nueva Contraseña</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="pl-9 bg-white/5 border-white/10 text-white"
                                                    placeholder="Dejar en blanco para mantener"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-3 h-4 w-4 text-white/40" />
                                                <Input
                                                    id="confirmPassword"
                                                    type="password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    className="pl-9 bg-white/5 border-white/10 text-white"
                                                    placeholder="Confirmar nueva contraseña"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {isGoogleAuth && (
                                <Alert className="bg-blue-500/10 border-blue-500/20 text-blue-200">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Cuenta de Google</AlertTitle>
                                    <AlertDescription>
                                        Has iniciado sesión con Google. Tu nombre de usuario, correo y contraseña son administrados por Google.
                                    </AlertDescription>
                                </Alert>
                            )}

                            <div className="pt-4">
                                <Button type="submit" className="w-full" disabled={loading || uploading}>
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Guardando...
                                        </>
                                    ) : (
                                        "Guardar Cambios"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
