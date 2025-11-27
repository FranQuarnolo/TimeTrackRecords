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
            <div className="relative h-8 w-8 flex items-center justify-center">
                <Image
                    src={logoPath}
                    alt={`${brand} logo`}
                    fill
                    className="object-contain"
                />
            </div>
        );
    }

    // Fallback for brands without logos
    const getBrandColor = (b: string) => {
        switch (b) {
            case 'redbull': return 'bg-blue-900 text-yellow-400';
            case 'mclaren': return 'bg-orange-500 text-black';
            case 'alpine': return 'bg-blue-600 text-white';
            case 'williams': return 'bg-blue-900 text-white';
            case 'haas': return 'bg-white text-red-600 border border-red-600';
            case 'sauber': return 'bg-green-500 text-black';
            case 'lexus': return 'bg-black text-white';
            case 'corvette': return 'bg-yellow-500 text-black';
            case 'dodge': return 'bg-red-700 text-white';
            case 'torino': return 'bg-gray-600 text-white';
            case 'isottafraschini': return 'bg-blue-800 text-white';
            default: return 'bg-zinc-500 text-white';
        }
    };

    return (
        <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold uppercase ${getBrandColor(normalizedBrand)}`}>
            {brand.substring(0, 1)}
        </div>
    );
};
