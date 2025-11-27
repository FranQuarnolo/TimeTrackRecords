import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Timer, PlusCircle, Flag } from "lucide-react";
import { Header } from "@/components/layout/header";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center gap-8 p-4">
        <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center mb-4 overflow-hidden border-4 border-primary/20">
          {/* Placeholder Logo */}
          <Flag className="h-16 w-16 text-primary" />
        </div>
        <div className="grid w-full max-w-sm gap-4">
          <Button asChild size="lg" className="h-24 text-xl" variant="secondary">
            <Link href="/mis-tiempos" className="flex flex-col gap-2">
              <Timer className="h-8 w-8" />
              Mis Tiempos
            </Link>
          </Button>
          <Button asChild size="lg" className="h-24 text-xl">
            <Link href="/cargar-tiempo" className="flex flex-col gap-2">
              <PlusCircle className="h-8 w-8" />
              Cargar Tiempo
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
