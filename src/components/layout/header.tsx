import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GraduationCap, Briefcase, Building, UserPlus, LogIn } from 'lucide-react'; // Added LogIn

export default function Header() {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <nav className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <GraduationCap size={28} />
          <span>Pasantías UTN</span>
        </Link>
        <div className="flex items-center gap-2 md:gap-4"> {/* Reduced gap for smaller screens */}
          <Link href="/internships" passHref>
            <Button variant="ghost" className="text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground text-xs sm:text-sm">
              <Briefcase className="mr-1 sm:mr-2" /> Pasantías
            </Button>
          </Link>
          <Link href="/companies" passHref>
             <Button variant="ghost" className="text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground text-xs sm:text-sm">
               <Building className="mr-1 sm:mr-2" /> Empresas
             </Button>
          </Link>
          <Link href="/register" passHref>
            <Button variant="secondary" className="bg-accent text-accent-foreground hover:bg-accent/90 text-xs sm:text-sm px-2 sm:px-3">
              <UserPlus className="mr-1 sm:mr-2" /> Registrarse
            </Button>
          </Link>
           <Link href="/login" passHref>
             <Button variant="outline" className="text-primary-foreground border-primary-foreground/50 hover:bg-primary/90 hover:text-primary-foreground text-xs sm:text-sm px-2 sm:px-3">
                <LogIn className="mr-1 sm:mr-2" /> Ingresar
             </Button>
           </Link>
        </div>
      </nav>
    </header>
  );
}
