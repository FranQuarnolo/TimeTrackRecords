import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Timer, PlusCircle } from "lucide-react";
import { Header } from "@/components/layout/header";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col relative">
      {/* Background Image */}
      <div className="fixed inset-0 z-[-1]">
        <Image
          src="/background.png"
          alt="Background"
          fill
          className="object-cover blur-sm brightness-50"
          priority
        />
      </div>

      <Header />
      <main className="flex-1 flex flex-col items-center justify-center gap-8 p-4 relative">

        <div className="w-full max-w-sm">
          <Button asChild size="lg" className="w-full h-24 text-2xl rounded-2xl shadow-lg backdrop-blur-md bg-background/80 hover:bg-background/90 text-foreground border-2 border-primary/20" variant="secondary">
            <Link href="/mis-tiempos" className="flex flex-col gap-2 items-center justify-center">
              <Timer className="h-8 w-8" />
              Mis Tiempos
            </Link>
          </Button>
        </div>

        {/* FAB for Loading Time */}
        <Button
          asChild
          size="icon"
          className="fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-2xl z-50 hover:scale-105 transition-transform"
        >
          <Link href="/cargar-tiempo">
            <PlusCircle className="h-8 w-8" />
            <span className="sr-only">Cargar Tiempo</span>
          </Link>
        </Button>
      </main>
    </div>
  );
}
