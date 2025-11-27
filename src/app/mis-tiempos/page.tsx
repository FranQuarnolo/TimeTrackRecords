import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimeList } from "@/components/times/time-list";
import { Header } from "@/components/layout/header";

export default function MisTiemposPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 container p-4 mx-auto max-w-md">
                <h1 className="text-2xl font-bold mb-6">Mis Tiempos</h1>

                <Tabs defaultValue="qualifying" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="qualifying">Clasificación</TabsTrigger>
                        <TabsTrigger value="race">Carrera</TabsTrigger>
                    </TabsList>
                    <TabsContent value="qualifying">
                        <TimeList type="qualifying" />
                    </TabsContent>
                    <TabsContent value="race">
                        <TimeList type="race" />
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
