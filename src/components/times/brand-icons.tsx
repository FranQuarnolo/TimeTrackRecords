import { Car } from "lucide-react";

export const getBrandIcon = (brand?: string) => {
    if (!brand) return <Car className="h-5 w-5" />;

    const normalizedBrand = brand.toLowerCase().replace(/\s+/g, '');

    // We can use simple colored circles with initials or specific SVGs if available.
    // For now, let's use a styled div with the first letter as a placeholder for a logo,
    // or specific colors associated with the brands.

    const getBrandColor = (b: string) => {
        switch (b) {
            case 'ferrari': return 'bg-red-600 text-white';
            case 'mercedes': return 'bg-zinc-300 text-black';
            case 'redbull': return 'bg-blue-900 text-yellow-400';
            case 'mclaren': return 'bg-orange-500 text-black';
            case 'astonmartin': return 'bg-green-800 text-white';
            case 'alpine': return 'bg-blue-600 text-white';
            case 'williams': return 'bg-blue-900 text-white';
            case 'haas': return 'bg-white text-red-600 border border-red-600';
            case 'sauber': return 'bg-green-500 text-black';
            case 'porsche': return 'bg-yellow-500 text-black';
            case 'bmw': return 'bg-blue-500 text-white';
            case 'cadillac': return 'bg-yellow-600 text-black';
            case 'toyota': return 'bg-red-600 text-white';
            case 'peugeot': return 'bg-gray-500 text-white';
            case 'lamborghini': return 'bg-yellow-400 text-black';
            case 'ford': return 'bg-blue-700 text-white';
            case 'lexus': return 'bg-black text-white';
            case 'corvette': return 'bg-yellow-500 text-black';
            case 'chevrolet': return 'bg-yellow-500 text-black';
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
