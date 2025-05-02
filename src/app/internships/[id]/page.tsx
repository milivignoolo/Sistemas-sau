import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { MapPin, Briefcase, GraduationCap, CalendarDays, Info, CheckSquare, Clock, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

// Mock data for a single internship - replace with actual data fetching based on ID
const getInternshipData = (id: string) => {
  // In a real app, fetch this from your backend/database using the id
   const allInternships = [
      {
        id: '1',
        title: 'Desarrollador Frontend Jr.',
        company: 'Tech Solutions Inc.',
        location: 'Remoto',
        area: 'Desarrollo Web',
        career: 'Ingeniería en Sistemas de Información',
        description: 'Buscamos un estudiante avanzado para unirse a nuestro equipo de desarrollo frontend. Trabajarás en proyectos desafiantes utilizando tecnologías modernas como React, TypeScript y Next.js. Colaborarás con diseñadores y desarrolladores backend para crear interfaces de usuario intuitivas y eficientes.',
        postedDate: new Date(2024, 6, 15),
        imageUrl: 'https://picsum.photos/seed/tech1/800/400',
        aiHint: 'technology modern office team',
        requirements: [
            'Estudiante avanzado de Ing. en Sistemas o carreras afines.',
            'Conocimientos sólidos de HTML, CSS y JavaScript.',
            'Experiencia (académica o profesional) con React.',
            'Manejo de Git.',
            'Proactividad y ganas de aprender.',
            'Buen nivel de comunicación.'
        ],
        duration: '6 meses (con posibilidad de extensión)',
        compensation: 'Remunerada (a convenir según perfil)',
      },
      // Add other internships here if needed for testing, or fetch dynamically
       {
        id: '2',
        title: 'Analista de Procesos Químicos',
        company: 'ChemCorp',
        location: 'Resistencia, Chaco',
        area: 'Procesos Industriales',
        career: 'Ingeniería Química',
        description: 'Oportunidad para estudiantes de Ing. Química para analizar y optimizar procesos en planta. Realizarás análisis de datos, propondrás mejoras y colaborarás en la implementación de nuevas metodologías.',
        postedDate: new Date(2024, 6, 10),
        imageUrl: 'https://picsum.photos/seed/chem1/800/400',
        aiHint: 'chemical plant industry',
        requirements: [
            'Estudiante de Ingeniería Química (50% de la carrera aprobada).',
            'Conocimientos de balance de materia y energía.',
            'Manejo de Excel avanzado.',
            'Capacidad analítica.',
        ],
         duration: '4 meses',
         compensation: 'Remunerada',
      },
       {
        id: '3',
        title: 'Pasantía en Mantenimiento Mecánico',
        company: 'Metalúrgica Industrial SRL',
        location: 'Barranqueras, Chaco',
        area: 'Mantenimiento',
        career: 'Ingeniería Mecánica',
        description: 'Colaborar en el plan de mantenimiento preventivo y correctivo de maquinaria industrial. Aprenderás sobre diagnóstico de fallas, gestión de repuestos y procedimientos de seguridad.',
        postedDate: new Date(2024, 6, 20),
        imageUrl: 'https://picsum.photos/seed/mech1/800/400',
        aiHint: 'industrial machinery factory',
        requirements: [
            'Estudiante de Ingeniería Mecánica.',
            'Conocimientos básicos de hidráulica y neumática.',
            'Interpretación de planos.',
            'Disponibilidad part-time.',
        ],
        duration: '6 meses',
        compensation: 'Asignación estímulo',
      },
       {
        id: '4',
        title: 'Desarrollador Backend (Node.js)',
        company: 'Startup Innovadora',
        location: 'Remoto',
        area: 'Desarrollo Software',
        career: 'Ingeniería en Sistemas de Información',
        description: 'Participa en el desarrollo de nuestra API REST utilizando Node.js, Express y MongoDB. Serás parte de un equipo ágil y dinámico, contribuyendo al core de nuestra plataforma.',
        postedDate: new Date(2024, 6, 18),
        imageUrl: 'https://picsum.photos/seed/tech2/800/400',
        aiHint: 'server room data center',
        requirements: [
             'Estudiante de Ing. en Sistemas o afines.',
             'Conocimientos de Node.js y JavaScript (ES6+).',
             'Experiencia con bases de datos NoSQL (MongoDB deseable).',
             'Familiaridad con APIs REST.',
             'Inglés técnico (lectura).',
        ],
        duration: 'A convenir',
        compensation: 'Remunerada',
      },
       {
        id: '5',
        title: 'Asistente de Ingeniería Civil',
        company: 'Constructora Norte',
        location: 'Resistencia, Chaco',
        area: 'Construcción',
        career: 'Ingeniería Civil',
        description: 'Apoyo en la supervisión de obras, cómputos y mediciones. Colaborarás directamente con el jefe de obra en el seguimiento diario de los proyectos.',
        postedDate: new Date(2024, 6, 5),
        imageUrl: 'https://picsum.photos/seed/civil1/800/400',
        aiHint: 'building blueprint construction plan',
        requirements: [
            'Estudiante de Ingeniería Civil.',
            'Manejo de AutoCAD.',
            'Conocimientos básicos de materiales de construcción.',
            'Carnet de conducir (deseable).',
        ],
         duration: '6 meses',
         compensation: '$180.000 ARS mensuales',
      },
  ];
  return allInternships.find(internship => internship.id === id);
};

interface InternshipDetailPageProps {
  params: { id: string };
}

export default function InternshipDetailPage({ params }: InternshipDetailPageProps) {
  const internship = getInternshipData(params.id);

  if (!internship) {
    return <p className="text-center text-destructive">Pasantía no encontrada.</p>;
  }

   const formattedDate = internship.postedDate.toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long', // Use 'long' for full month name
    year: 'numeric',
  });

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="overflow-hidden">
         <Image
            data-ai-hint={internship.aiHint}
            src={internship.imageUrl}
            alt={`Imagen de ${internship.company} - ${internship.title}`}
            width={800}
            height={300} // Reduced height
            className="w-full h-60 object-cover" // Reduced height
         />
         <CardHeader className="pt-6 pb-4">
             <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                <div>
                    <CardTitle className="text-3xl font-bold mb-1">{internship.title}</CardTitle>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground">
                         <span className="flex items-center gap-1"><Briefcase size={16} /> {internship.company}</span>
                         <span className="flex items-center gap-1"><MapPin size={16} /> {internship.location}</span>
                         <span className="flex items-center gap-1"><CalendarDays size={16} /> Publicado: {formattedDate}</span>
                    </div>
                 </div>
                 <Button size="lg" className="w-full md:w-auto">
                    Postularse Ahora
                 </Button> {/* TODO: Add application logic */}
             </div>
             <div className="flex flex-wrap gap-2 pt-2">
                 <Badge variant="secondary" className="text-sm px-3 py-1">{internship.area}</Badge>
                 <Badge variant="outline" className="text-sm px-3 py-1">
                     <GraduationCap size={16} className="mr-1" /> {internship.career}
                 </Badge>
                 {internship.duration && (
                     <Badge variant="outline" className="text-sm px-3 py-1">
                         <Clock size={16} className="mr-1" /> {internship.duration}
                     </Badge>
                 )}
                  {internship.compensation && (
                     <Badge variant={internship.compensation.toLowerCase().includes('no remunerada') ? "destructive" : "default"} className="text-sm px-3 py-1 bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100 dark:border-green-700">
                         <DollarSign size={16} className="mr-1" /> {internship.compensation}
                     </Badge>
                 )}
            </div>
         </CardHeader>
         <Separator />
         <CardContent className="pt-6 grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
                 <div>
                    <h3 className="text-xl font-semibold mb-2 flex items-center gap-2"><Info size={20} /> Descripción</h3>
                    <p className="text-muted-foreground whitespace-pre-line">{internship.description}</p>
                 </div>
                {internship.requirements && internship.requirements.length > 0 && (
                <div>
                    <h3 className="text-xl font-semibold mb-3 flex items-center gap-2"><CheckSquare size={20} /> Requisitos</h3>
                    <ul className="list-none space-y-2 pl-0">
                    {internship.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2 text-muted-foreground">
                            <CheckSquare size={16} className="text-primary mt-1 flex-shrink-0"/>
                            <span>{req}</span>
                        </li>
                    ))}
                    </ul>
                 </div>
                 )}
            </div>
            <aside className="md:col-span-1 space-y-4">
                 <Card className="bg-secondary">
                     <CardHeader className="pb-2">
                         <CardTitle className="text-lg">Sobre la Empresa</CardTitle>
                     </CardHeader>
                     <CardContent>
                         <p className="text-sm text-muted-foreground mb-3">Información adicional sobre {internship.company}.</p>
                         {/* TODO: Fetch and display actual company info */}
                         <Link href={`/companies/${internship.company.toLowerCase().replace(/\s+/g, '-')}`} passHref>
                             <Button variant="outline" size="sm" className="w-full">
                                 Ver Perfil de la Empresa
                            </Button>
                         </Link>
                     </CardContent>
                 </Card>
                 {/* Potentially add related internships */}
            </aside>

         </CardContent>
      </Card>
       <div className="mt-8">
          <Link href="/internships" passHref>
            <Button variant="outline">
              &larr; Volver a Pasantías
            </Button>
          </Link>
        </div>
    </div>
  );
}

// Optional: Generate static paths if you have a known list of internships at build time
// export async function generateStaticParams() {
//   // Fetch all internship IDs
//   const internships = [{ id: '1' }, { id: '2' }, {id: '3'}, {id: '4'}, {id: '5'}]; // Replace with actual fetch
//   return internships.map((internship) => ({
//     id: internship.id,
//   }));
// }
