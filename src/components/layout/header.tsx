
'use client'; // Add 'use client' for useState and useEffect

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GraduationCap, Briefcase, Building, UserPlus, LogIn, LogOut, User } from 'lucide-react'; // Changed User icon to LogOut, Added User
import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton
import { safeLocalStorageGet } from '@/lib/local-storage'; // Use safe function


// Simple user profile type
interface UserProfile {
    username: string;
    userType: 'student' | 'company';
    // Add other potential fields if needed, e.g., name for display
}


export default function Header() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
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
      // Redirect to home page after logout for a cleaner flow
      window.location.href = '/';
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
           {!isLoading && userProfile?.userType === 'company' && (
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
                {/* Skeleton loaders while checking auth state */}
                <Skeleton className="h-9 w-20 rounded-md bg-primary/80" />
                <Skeleton className="h-9 w-20 rounded-md bg-primary/80" />
            </>
          ) : userProfile ? (
             <>
                {/* Display Username or Welcome Message */}
                 <span className="text-xs sm:text-sm px-2 sm:px-3 hidden md:inline-flex items-center gap-1">
                     <User size={16} />
                     {userProfile.username} {/* Show username */}
                 </span>
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
              {/* Show Register and Login only if not logged in */}
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
