'use client'; // Add 'use client' for useState and useEffect

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GraduationCap, Briefcase, Building, UserPlus, LogIn, LogOut } from 'lucide-react'; // Changed User icon to LogOut
import React, { useState, useEffect } from 'react'; // Import useState and useEffect

// --- localStorage Interaction (Client-Side Only) ---
const safeLocalStorageGet = (key: string) => {
    // This function MUST run only on the client
    if (typeof window === 'undefined') {
        return null;
    }
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error(`Error reading localStorage key “${key}”:`, error);
        return null;
    }
};

export default function Header() {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true); // Start loading

  useEffect(() => {
    // This effect runs only on the client after hydration
    const profile = safeLocalStorageGet('userProfile');
    console.log("Header checking userProfile:", profile); // Debug log
    setUserProfile(profile);
    setIsLoading(false); // Finished loading
  }, []); // Empty dependency array ensures it runs once on mount

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userProfile');
      setUserProfile(null);
      // Redirect to login page after logout
      window.location.href = '/login';
    }
  };


  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <nav className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <GraduationCap size={28} />
          <span>Pasantías UTN</span>
        </Link>
        <div className="flex items-center gap-1 md:gap-2"> {/* Further reduced gap */}
          <Link href="/internships" passHref>
            <Button variant="ghost" className="text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground text-xs sm:text-sm px-1 sm:px-2">
              <Briefcase className="mr-1 size-4" /> Pasantías
            </Button>
          </Link>
          <Link href="/companies" passHref>
             <Button variant="ghost" className="text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground text-xs sm:text-sm px-1 sm:px-2">
               <Building className="mr-1 size-4" /> Empresas
             </Button>
          </Link>
           {/* Link to Post Internship for logged-in companies */}
           {userProfile?.userType === 'company' && (
             <Link href="/post-internship" passHref>
               <Button variant="ghost" className="text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground text-xs sm:text-sm px-1 sm:px-2">
                 {/* Consider a different icon, maybe FilePlus */}
                 <Briefcase className="mr-1 size-4" /> Publicar
               </Button>
             </Link>
           )}

          {/* Conditional Rendering based on loading state and profile */}
          {isLoading ? (
            <>
                {/* Optional: Show skeleton loaders while checking auth state */}
                <div className="h-9 w-20 animate-pulse rounded-md bg-primary/80"></div>
                <div className="h-9 w-20 animate-pulse rounded-md bg-primary/80"></div>
            </>
          ) : userProfile ? (
             <>
                {/* Removed Profile Button */}
                <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="text-primary-foreground border-primary-foreground/50 hover:bg-primary/90 hover:text-primary-foreground text-xs sm:text-sm px-2 sm:px-3"
                    >
                    <LogOut className="mr-1 size-4" /> Salir
                </Button>
            </>
          ) : (
            <>
              <Link href="/register" passHref>
                <Button variant="secondary" className="bg-accent text-accent-foreground hover:bg-accent/90 text-xs sm:text-sm px-2 sm:px-3">
                  <UserPlus className="mr-1 size-4" /> Registrarse
                </Button>
              </Link>
               <Link href="/login" passHref>
                 <Button variant="outline" className="text-primary-foreground border-primary-foreground/50 hover:bg-primary/90 hover:text-primary-foreground text-xs sm:text-sm px-2 sm:px-3">
                    <LogIn className="mr-1 size-4" /> Ingresar
                 </Button>
               </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
