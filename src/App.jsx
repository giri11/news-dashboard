import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import UserForm from './pages/UserForm';
import Roles from './pages/Roles';
import Categories from './pages/Categories';
import CategoryForm from './pages/CategoryForm';
import Articles from './pages/Articles';
import ArticleForm from './pages/ArticleForm';
import ArticleView from './pages/ArticleView';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Settings from './pages/Settings';
import Profile from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* Users */}
            <Route path="users" element={<Users />} />
            <Route path="users/add" element={<UserForm />} />
            <Route path="users/edit/:id" element={<UserForm />} />
            
            {/* Roles */}
            <Route path="roles" element={<Roles />} />
            
            {/* Categories */}
            <Route path="categories" element={<Categories />} />
            <Route path="categories/add" element={<CategoryForm />} />
            <Route path="categories/edit/:id" element={<CategoryForm />} />
            
            {/* Articles */}
            <Route path="articles" element={<Articles />} />
            <Route path="articles/add" element={<ArticleForm />} />
            <Route path="articles/edit/:id" element={<ArticleForm />} />
            <Route path="articles/view/:id" element={<ArticleView />} />
            
            {/* Other routes */}
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
            <Route path="settings" element={<Settings />} />
            <Route path="settings/profile" element={<Settings />} />
            <Route path="settings/system" element={<Settings />} />
            <Route path="reports/sales" element={<Dashboard />} />
            <Route path="reports/inventory" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;