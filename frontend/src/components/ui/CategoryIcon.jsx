import { Laptop, Shirt, Home, Sparkles, Dumbbell, BookOpen, Gamepad2, Pill, Package } from 'lucide-react';

const iconMap = {
    Laptop,
    Shirt,
    Home,
    Sparkles,
    Dumbbell,
    BookOpen,
    Gamepad2,
    Pill,
};

export default function CategoryIcon({ name, size = 24, className = '' }) {
    if (!name) return <Package size={size} className={className} />;

    if (iconMap[name]) {
        const IconComponent = iconMap[name];
        return <IconComponent size={size} className={className} />;
    }

    return (
        <span 
            className={`flex items-center justify-center ${className} drop-shadow-sm`} 
            style={{ fontSize: `${size}px`, lineHeight: 1 }}
        >
            {name}
        </span>
    );
}
