import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, Users, Settings, Package, ShoppingCart, 
  FileText, BarChart2, ChevronDown, ChevronRight 
} from 'lucide-react';

const MenuItem = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const hasChildren = item.subMenus && item.subMenus.length > 0;
  const isActive = location.pathname === item.path;

  const getIcon = (iconName) => {
    const icons = {
      Home, Users, Settings, Package, ShoppingCart, FileText, BarChart2
    };
    const Icon = icons[iconName] || Home;
    return <Icon size={20} />;
  };

  const ItemContent = () => (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-3">
        {getIcon(item.icon)}
        <span className="font-medium">{item.name}</span>
      </div>
      {hasChildren && (
        isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />
      )}
    </div>
  );

  return (
    <div>
      {hasChildren ? (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center px-4 py-3 hover:bg-indigo-50 transition ${
            isActive ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600' : 'text-gray-700'
          }`}
        >
          <ItemContent />
        </button>
      ) : (
        <Link
          to={item.path}
          className={`w-full flex items-center px-4 py-3 hover:bg-indigo-50 transition ${
            isActive ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600' : 'text-gray-700'
          }`}
        >
          <ItemContent />
        </Link>
      )}
      
      {hasChildren && isOpen && (
        <div className="pl-4 bg-gray-50">
          {item.subMenus.map((sub) => (
            <MenuItem key={sub.id} item={sub} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuItem;