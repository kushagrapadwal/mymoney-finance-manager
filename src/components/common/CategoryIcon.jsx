/**
 * src/components/common/CategoryIcon.jsx
 * Reusable icon renderer that safely matches icon names to Lucide icons.
 */

import {
  Home,
  ShoppingCart,
  Bus,
  Utensils,
  Wifi,
  PiggyBank,
  Tag,
  CreditCard,
  Coffee,
  Plane,
  Heart,
  Briefcase,
  BookOpen,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

const ICON_MAP = {
  Home,
  ShoppingCart,
  Bus,
  Utensils,
  Wifi,
  PiggyBank,
  Tag,
  CreditCard,
  Coffee,
  Plane,
  Heart,
  Briefcase,
  BookOpen,
  DollarSign,
  TrendingUp,
};

export default function CategoryIcon({ name, className = 'w-5 h-5', style }) {
  const IconComponent = ICON_MAP[name] || Tag;
  return <IconComponent className={className} style={style} />;
}

