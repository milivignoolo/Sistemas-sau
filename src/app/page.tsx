import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ArrowRight, Briefcase, Building } from 'lucide-react';
import Image from 'next/image';


export default function Home() {
  return (
    <div className="space-y-12">
      <section className="text-center py-12 bg-secondary rounded-lg shadow">
         <Image
            data-ai-hint="university campus graduation"
            src="https://picsum.photos/1200/400" // Placeholder image
            alt="Campus Universitario UTN"
            width={1200}
            height={400}
            className="w-full h-64 object-cover rounded-t-lg mb-6"
          />
        <h1 className="text-4xl font-bold mb-4 text-primary">Bienvenido a Pasantías UTN</h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Conectamos a estudiantes talentosos de la Universidad Tecnológica Nacional con oportunidades de pasantías en empresas líderes.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/internships" passHref>
            <Button size="lg">
              Buscar Pasantías <ArrowRight className="ml-2" />
            </Button>
          </Link>
          <Link href="/register?type=company" passHref>
            <Button size="lg" variant="outline">
              Publicar Pasantía <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="text-primary" />
              Para Estudiantes
            </CardTitle>
            <CardDescription>Encuentra la pasantía ideal para impulsar tu carrera.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Explora ofertas de pasantías adaptadas a tu perfil académico y profesional. Filtra por carrera, área de interés y más.</p>
            <Link href="/register?type=student" passHref>
              <Button variant="link" className="px-0 text-primary">
                Regístrate como Estudiante <ArrowRight className="ml-1 size-4" />
              </Button>
            </Link>
             <Link href="/internships" passHref>
                <Button className="w-full">
                  Ver Ofertas Disponibles
                </Button>
             </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="text-primary" />
              Para Empresas
            </CardTitle>
            <CardDescription>Publica tus ofertas y encuentra el talento que necesitas.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Accede a un grupo de estudiantes calificados de la UTN. Publica tus vacantes de pasantías de forma rápida y sencilla.</p>
             <Link href="/register?type=company" passHref>
               <Button variant="link" className="px-0 text-primary">
                 Regístrate como Empresa <ArrowRight className="ml-1 size-4" />
               </Button>
            </Link>
            {/* Link to company dashboard (once created) */}
             <Link href="/post-internship" passHref>
                <Button className="w-full">
                 Publicar Nueva Pasantía
                </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

       <section className="py-12">
          <h2 className="text-3xl font-bold text-center mb-8">¿Por qué elegir Pasantías UTN?</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6 border rounded-lg shadow-sm bg-card">
              <h3 className="text-xl font-semibold mb-2">Conexión Directa</h3>
              <p className="text-muted-foreground">Facilitamos el contacto entre empresas y estudiantes sin intermediarios.</p>
            </div>
            <div className="p-6 border rounded-lg shadow-sm bg-card">
              <h3 className="text-xl font-semibold mb-2">Talento Calificado</h3>
              <p className="text-muted-foreground">Accede a estudiantes de ingeniería y tecnología de primer nivel.</p>
            </div>
             <div className="p-6 border rounded-lg shadow-sm bg-card">
              <h3 className="text-xl font-semibold mb-2">Proceso Simplificado</h3>
              <p className="text-muted-foreground">Una plataforma intuitiva para buscar y publicar pasantías fácilmente.</p>
            </div>
          </div>
       </section>
    </div>
  );
}
