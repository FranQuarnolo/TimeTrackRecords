import { Car } from "lucide-react";
import Image from "next/image";

export const getBrandIcon = (brand?: string) => {
    if (!brand) return <Car className="h-5 w-5" />;

    const normalizedBrand = brand.toLowerCase().replace(/\s+/g, '');
    const logoMap: Record<string, string> = {
        'astonmartin': '/logos/aston_martin_logo_icon.svg',
        'bmw': '/logos/bmw_logo_icon.svg',
        'cadillac': '/logos/cadillac_logo_icon.svg',
        'chevrolet': '/logos/chevrolet_logo_icon.svg',
        'ferrari': '/logos/ferrari_logo_icon.svg',
        'ford': '/logos/ford_logo_icon.svg',
        'lamborghini': '/logos/lamborghini_logo_icon.svg',
        'mercedes': '/logos/mercedes_benz_logo_icon.svg',
        'peugeot': '/logos/peugeot_logo_icon.svg',
        'porsche': '/logos/porsche_logo_icon.svg',
        'toyota': '/logos/toyota_logo_icon.svg',
    };

    const logoPath = logoMap[normalizedBrand];

    if (logoPath) {
        return (
            <div className="relative h-8 w-8 flex items-center justify-center filter drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
                <Image
                    src={logoPath}
                    alt={`${brand} logo`}
                    fill
                    className="object-contain brightness-0 invert"
                />
            </div>
        );
    }

    // Fallback for brands without logos
    const getBrandColor = (b: string) => {
        switch (b) {
            case 'redbull': return 'bg-[#121F45] text-[#FFCC00] border border-[#FFCC00]';
            case 'mclaren': return 'bg-[#FF8000] text-black border border-black';
            case 'alpine': return 'bg-[#0090FF] text-white border border-[#FD4BC7]';
            case 'williams': return 'bg-[#00A0DE] text-black border border-white';
            case 'haas': return 'bg-white text-[#E6002B] border border-[#E6002B]';
            case 'sauber': return 'bg-[#52E252] text-black border border-black';
            case 'kicksauber': return 'bg-[#52E252] text-black border border-black';
            case 'rb': return 'bg-[#1634CC] text-white border border-[#FF3555]';
            case 'lexus': return 'bg-black text-white border border-white';
            case 'corvette': return 'bg-[#C6C8CA] text-[#D8AC3F] border border-black';
            case 'dodge': return 'bg-[#B91C1C] text-white border border-black';
            case 'torino': return 'bg-gray-600 text-white border border-white';
            case 'isottafraschini': return 'bg-[#002D72] text-white border border-[#C60C30]';
            case 'audi': return 'bg-white text-black border border-black';
            case 'custom': return 'bg-white/10 text-white border border-white/30';
            default: return 'bg-zinc-800 text-white border border-white/10';
        }
    };

    return (
        <div className={`h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-black uppercase shadow-lg ${getBrandColor(normalizedBrand)}`}>
            {brand.substring(0, 2)}
        </div>
    );
};
