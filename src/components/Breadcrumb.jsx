import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Breadcrumb = () => {
  const location = useLocation();
  const { menus } = useAuth();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Build route names map from menu structure dynamically
  const routeNames = useMemo(() => {
    const nameMap = {};
    
    const buildNameMap = (menuItems) => {
      menuItems.forEach(menu => {
        if (menu.path) {
          // Extract the last segment of the path as the key
          const pathSegments = menu.path.split('/').filter(x => x);
          const lastSegment = pathSegments[pathSegments.length - 1];
          if (lastSegment) {
            nameMap[lastSegment] = menu.name;
          }
        }
        
        // Recursively process submenus
        if (menu.subMenus && menu.subMenus.length > 0) {
          buildNameMap(menu.subMenus);
        }
      });
    };
    
    buildNameMap(menus);
    
    // Add common route segments that aren't in menus
    nameMap['add'] = 'Add New';
    nameMap['edit'] = 'Edit';
    nameMap['profile'] = 'My Profile';
    
    return nameMap;
  }, [menus]);

  // Don't show breadcrumb on login page or root
  if (location.pathname === '/login' || location.pathname === '/') {
    return null;
  }

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3">
      <nav className="flex items-center space-x-2 text-sm">
        <Link
          to="/dashboard"
          className="flex items-center text-gray-500 hover:text-indigo-600 transition"
          title="Home"
        >
          <Home size={16} />
        </Link>

        {pathnames.map((segment, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const isNumber = !isNaN(segment); // Check if it's an ID

          // Skip numeric IDs in breadcrumb display
          if (isNumber) {
            return null;
          }

          // Get display name from dynamic map or capitalize segment
          const displayName = routeNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);

          return (
            <React.Fragment key={routeTo}>
              <ChevronRight size={16} className="text-gray-400" />
              {isLast ? (
                <span className="font-medium text-indigo-600">
                  {displayName}
                </span>
              ) : (
                <Link
                  to={routeTo}
                  className="text-gray-500 hover:text-indigo-600 transition"
                >
                  {displayName}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </nav>
    </div>
  );
};

export default Breadcrumb;