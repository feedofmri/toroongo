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
    const IconComponent = iconMap[name] || Package;
    return <IconComponent size={size} className={className} />;
}
