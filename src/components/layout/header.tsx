import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GraduationCap, Briefcase, Building, UserPlus } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <nav className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <GraduationCap size={28} />
          <span>Pasantías UTN</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/internships" passHref>
            <Button variant="ghost" className="text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground">
              <Briefcase className="mr-2" /> Ver Pasantías
            </Button>
          </Link>
          <Link href="/companies" passHref>
             <Button variant="ghost" className="text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground">
               <Building className="mr-2" /> Empresas
             </Button>
          </Link>
          <Link href="/register" passHref>
            <Button variant="secondary" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <UserPlus className="mr-2" /> Registrarse
            </Button>
          </Link>
           {/* We can add Login button later */}
        </div>
      </nav>
    </header>
  );
}
