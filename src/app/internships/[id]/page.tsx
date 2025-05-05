
'use client'; // Add 'use client' because we use useEffect for client-side logic

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { MapPin, Briefcase, GraduationCap, CalendarDays, Info, CheckSquare, Clock, DollarSign, Target, Ban, ArrowRight } from 'lucide-react'; // Added Target, Ban, ArrowRight
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import React, { useState, useEffect } from 'react'; // Import useState, useEffect
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'; // Import Tooltip
import { useToast } from '@/hooks/use-toast'; // Import useToast


// --- Mock Data (Keep or replace with actual fetching) ---
interface InternshipDetailData {
    id: string;
    title: string;
    company: string;
    companyId: string; // Need companyId for link
    location: string;
    area: string;
    career: string; // Use ID like 'sistemas'
    requiredYear?: number;
    description: string;
    postedDate: Date;
    imageUrl: string;
    aiHint: string;
    requirements: {
        text?: string[]; // Original text requirements
        technicalSkills?: { [key: string]: string };
        softSkills?: { [key: string]: string };
        languages?: { [key: string]: string };
    };
    duration: string;
    compensation: string;
}

const allInternships: InternshipDetailData[] = [
    {
        id: '1',
        title: 'Desarrollador Frontend Jr.',
        company: 'Tech Solutions Inc.',
        companyId: 'tech-solutions-inc', // Added companyId
        location: 'Remoto',
        area: 'Desarrollo Web',
        career: 'sistemas', // Use career ID
        requiredYear: 3,
        description: 'Buscamos un estudiante avanzado para unirse a nuestro equipo de desarrollo frontend. Trabajarás en proyectos desafiantes utilizando tecnologías modernas como React, TypeScript y Next.js. Colaborarás con diseñadores y desarrolladores backend para crear interfaces de usuario intuitivas y eficientes.',
        postedDate: new Date(2024, 6, 15),
        imageUrl: 'https://picsum.photos/seed/tech1/800/400',
        aiHint: 'technology modern office team',
        requirements: {
            text: [ // Keep original text for display
                'Estudiante avanzado de Ing. en Sistemas o carreras afines.',
                'Conocimientos sólidos de HTML, CSS y JavaScript.',
                'Experiencia (académica o profesional) con React.',
                'Manejo de Git.',
                'Proactividad y ganas de aprender.',
                'Buen nivel de comunicación.'
            ],
            technicalSkills: { javascript: 'Intermedio', react: 'Básico', git: 'Básico' },
            softSkills: { teamwork: 'Desarrollado', communication: 'Desarrollado' },
            languages: { english: 'Básico (A1/A2)' },
        },
        duration: '6 meses (con posibilidad de extensión)',
        compensation: 'Remunerada (a convenir según perfil)',
    },
    {
        id: '2',
        title: 'Analista de Procesos Químicos',
        company: 'ChemCorp',
        companyId: 'chemcorp',
        location: 'Resistencia, Chaco',
        area: 'Procesos Industriales',
        career: 'quimica', // Use career ID
        requiredYear: 3,
        description: 'Oportunidad para estudiantes de Ing. Química para analizar y optimizar procesos en planta. Realizarás análisis de datos, propondrás mejoras y colaborarás en la implementación de nuevas metodologías.',
        postedDate: new Date(2024, 6, 10),
        imageUrl: 'https://picsum.photos/seed/chem1/800/400',
        aiHint: 'chemical plant industry',
        requirements: {
            text: [
                'Estudiante de Ingeniería Química (50% de la carrera aprobada).',
                'Conocimientos de balance de materia y energía.',
                'Manejo de Excel avanzado.',
                'Capacidad analítica.',
            ],
            technicalSkills: { excel: 'Avanzado' },
            softSkills: { problem_solving: 'Fuerte', critical_thinking: 'Desarrollado' },
            languages: {},
        },
        duration: '4 meses',
        compensation: 'Remunerada',
    },
    {
        id: '3',
        title: 'Pasantía en Mantenimiento Mecánico',
        company: 'Metalúrgica Industrial SRL',
        companyId: 'metalurgica-industrial-srl',
        location: 'Barranqueras, Chaco',
        area: 'Mantenimiento',
        career: 'mecanica',
        requiredYear: 2,
        description: 'Colaborar en el plan de mantenimiento preventivo y correctivo de maquinaria industrial. Aprenderás sobre diagnóstico de fallas, gestión de repuestos y procedimientos de seguridad.',
        postedDate: new Date(2024, 6, 20),
        imageUrl: 'https://picsum.photos/seed/mech1/800/400',
        aiHint: 'industrial machinery factory',
        requirements: {
             text: [
                'Estudiante de Ingeniería Mecánica.',
                'Conocimientos básicos de hidráulica y neumática.',
                'Interpretación de planos.',
                'Disponibilidad part-time.',
            ],
            technicalSkills: { autocad: 'Básico' },
            softSkills: { proactivity: 'Desarrollado' },
            languages: {},
        },
        duration: '6 meses',
        compensation: 'Asignación estímulo',
      },
       {
        id: '4',
        title: 'Desarrollador Backend (Node.js)',
        company: 'Startup Innovadora',
        companyId: 'startup-innovadora',
        location: 'Remoto',
        area: 'Desarrollo Software',
        career: 'sistemas',
        requiredYear: 4,
        description: 'Participa en el desarrollo de nuestra API REST utilizando Node.js, Express y MongoDB. Serás parte de un equipo ágil y dinámico, contribuyendo al core de nuestra plataforma.',
        postedDate: new Date(2024, 6, 18),
        imageUrl: 'https://picsum.photos/seed/tech2/800/400',
        aiHint: 'server room data center',
        requirements: {
             text: [
                'Estudiante de Ing. en Sistemas o afines.',
                'Conocimientos de Node.js y JavaScript (ES6+).',
                'Experiencia con bases de datos NoSQL (MongoDB deseable).',
                'Familiaridad con APIs REST.',
                'Inglés técnico (lectura).',
            ],
            technicalSkills: { nodejs: 'Intermedio', nosql: 'Básico', git: 'Intermedio' },
            softSkills: { adaptability: 'Desarrollado', learning: 'Fuerte' },
            languages: { english: 'Intermedio (B1/B2)' },
        },
        duration: 'A convenir',
        compensation: 'Remunerada',
      },
       {
        id: '5',
        title: 'Asistente de Ingeniería Civil',
        company: 'Constructora Norte',
        companyId: 'constructora-norte',
        location: 'Resistencia, Chaco',
        area: 'Construcción',
        career: 'civil',
        requiredYear: 3,
        description: 'Apoyo en la supervisión de obras, cómputos y mediciones. Colaborarás directamente con el jefe de obra en el seguimiento diario de los proyectos.',
        postedDate: new Date(2024, 6, 5),
        imageUrl: 'https://picsum.photos/seed/civil1/800/400',
        aiHint: 'building blueprint construction plan',
        requirements: {
            text: [
                'Estudiante de Ingeniería Civil.',
                'Manejo de AutoCAD.',
                'Conocimientos básicos de materiales de construcción.',
                'Carnet de conducir (deseable).',
            ],
            technicalSkills: { autocad: 'Intermedio' },
            softSkills: { communication: 'Desarrollado' },
            languages: {},
        },
         duration: '6 meses',
         compensation: '$180.000 ARS mensuales',
      },
  ];


const getInternshipData = (id: string): InternshipDetailData | undefined => {
  return allInternships.find(internship => internship.id === id);
};

// --- Student Profile and Match Score Calculation (Client-Side) ---
// Function to safely interact with localStorage (runs only on client)
const safeLocalStorageGet = (key: string) => {
    if (typeof window === 'undefined') { return null; }
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error(`Error reading localStorage key “${key}”:`, error);
        return null;
    }
};

interface StudentProfile {
    username: string;
    career: string;
    currentYear: number;
    profile?: {
        technicalSkills?: { [key: string]: string };
        softSkills?: { [key: string]: string };
        languages?: { [key: string]: string };
    }
}

const calculateMatchScore = (student: StudentProfile | null, internship: InternshipDetailData | undefined): number => {
    if (!student || !internship) return 0;

    let score = 0;
    let totalRequirements = 0;

    const studentTech = student.profile?.technicalSkills || {};
    const studentSoft = student.profile?.softSkills || {};
    const studentLang = student.profile?.languages || {};

    const reqTech = internship.requirements?.technicalSkills || {};
    const reqSoft = internship.requirements?.softSkills || {};
    const reqLang = internship.requirements?.languages || {};

    // Compare Technical Skills
    Object.keys(reqTech).forEach(skillId => {
        totalRequirements++;
        if (studentTech[skillId]) score++; // Simplified: existence check
    });

    // Compare Soft Skills
    Object.keys(reqSoft).forEach(skillId => {
        totalRequirements++;
        if (studentSoft[skillId]) score++; // Simplified: existence check
    });

    // Compare Languages
    Object.keys(reqLang).forEach(skillId => {
        totalRequirements++;
        if (studentLang[skillId]) score++; // Simplified: existence check
    });

    // Compare Career and Year
    if (internship.career) {
        totalRequirements++;
        if (student.career === internship.career) score++;
    }
    if (internship.requiredYear) {
        totalRequirements++;
        if (student.currentYear >= internship.requiredYear) score++;
    }

    return totalRequirements > 0 ? Math.round((score / totalRequirements) * 100) : 0;
};


// --- Component ---
interface InternshipDetailPageProps {
  params: { id: string };
}

export default function InternshipDetailPage({ params }: InternshipDetailPageProps) {
  const internship = getInternshipData(params.id);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [matchScore, setMatchScore] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast(); // Initialize toast

  useEffect(() => {
    // Fetch student profile from localStorage on client side
    const profileData = safeLocalStorageGet('userProfile');
    if (profileData && profileData.userType === 'student') {
         // Map stored data to StudentProfile structure if needed, or assume it matches
         const mappedProfile: StudentProfile = {
             username: profileData.username,
             career: profileData.career, // Assuming career ID is stored directly
             currentYear: profileData.currentYear || 0, // Or fetch from profile if available
             profile: profileData.profile || {}, // Get nested profile data
         };
        setStudentProfile(mappedProfile);
        const score = calculateMatchScore(mappedProfile, internship);
        setMatchScore(score);
    } else {
        setStudentProfile(null);
        setMatchScore(0); // No profile, no match
    }
    setIsLoading(false);
  }, [params.id, internship]); // Re-run if ID or internship data changes


  if (isLoading) {
      // Optional: Show loading state
      return <p className="text-center text-muted-foreground">Cargando detalles...</p>;
  }

  if (!internship) {
    return <p className="text-center text-destructive">Pasantía no encontrada.</p>;
  }

   const formattedDate = internship.postedDate.toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long', // Use 'long' for full month name
    year: 'numeric',
  });

   const canApply = matchScore >= 50; // Determine eligibility based on score

  // Helper to determine badge color based on score
  const getMatchScoreVariant = (score: number): "default" | "secondary" | "destructive" | "outline" => {
      if (score < 50) return "destructive"; // Low match
      if (score < 90) return "secondary"; // Medium match
      return "default"; // High/Perfect match (using primary color)
  }
  const scoreVariant = getMatchScoreVariant(matchScore);
  const scoreTooltip =
        scoreVariant === "destructive" ? "Coincidencia Baja (<50%)" :
        scoreVariant === "secondary" ? "Coincidencia Media (50-89%)" :
        "Coincidencia Alta (90-100%)";

  const handleApplyClick = () => {
    if (!studentProfile) {
         toast({
            title: "Inicio de Sesión Requerido",
            description: "Debes iniciar sesión como estudiante para postularte.",
            variant: "destructive",
        });
        return;
    }
    // Mock application success
     toast({
        title: '¡Postulación Exitosa!',
        description: `Te has postulado a la pasantía "${internship.title}" en ${internship.company}.`,
        variant: 'success',
    });
    // In a real app, you would make an API call here
    // console.log(`Applying to internship ${internship.id} as ${studentProfile.username}`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="overflow-hidden">
         <div className="relative"> {/* Added relative container for badge positioning */}
             <Image
                data-ai-hint={internship.aiHint}
                src={internship.imageUrl}
                alt={`Imagen de ${internship.company} - ${internship.title}`}
                width={800}
                height={300} // Reduced height
                className="w-full h-60 object-cover" // Reduced height
             />
             {/* Match Score Badge (Only if student profile loaded) */}
             {studentProfile && (
                  <TooltipProvider>
                     <Tooltip>
                         <TooltipTrigger asChild>
                            <Badge variant={scoreVariant} className="absolute top-2 right-2 flex items-center gap-1 cursor-default text-base px-3 py-1">
                                <Target size={16} /> {matchScore}%
                            </Badge>
                         </TooltipTrigger>
                         <TooltipContent>
                             <p>{scoreTooltip}</p>
                         </TooltipContent>
                     </Tooltip>
                 </TooltipProvider>
             )}
         </div>
         <CardHeader className="pt-6 pb-4">
             <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-4"> {/* Changed to items-start */}
                <div className="flex-grow">
                    <CardTitle className="text-3xl font-bold mb-1">{internship.title}</CardTitle>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground">
                         <span className="flex items-center gap-1"><Briefcase size={16} />
                            <Link href={`/companies/${internship.companyId}`} className="text-primary hover:underline">
                                {internship.company}
                            </Link>
                         </span>
                         <span className="flex items-center gap-1"><MapPin size={16} /> {internship.location}</span>
                         <span className="flex items-center gap-1"><CalendarDays size={16} /> Publicado: {formattedDate}</span>
                    </div>
                 </div>
                 {/* Apply Button Section */}
                 <div className="w-full md:w-auto flex-shrink-0">
                     <TooltipProvider>
                         <Tooltip delayDuration={canApply ? 500 : 100}>
                             <TooltipTrigger asChild>
                                <div className={!canApply ? 'cursor-not-allowed' : ''}>
                                     <Button
                                        size="lg"
                                        className={`w-full md:w-auto ${!canApply ? 'pointer-events-none opacity-60' : ''}`} // Disable visually and functionally
                                        disabled={!canApply || !studentProfile} // Disable if cannot apply or no student profile
                                        onClick={handleApplyClick} // Use the new handler
                                    >
                                        {canApply ? (
                                            <>Postularse Ahora <ArrowRight className="ml-1 size-4" /></>
                                        ) : (
                                            <>Postularse Ahora <Ban className="ml-1 size-4" /></>
                                        )}
                                    </Button>
                                 </div>
                             </TooltipTrigger>
                             <TooltipContent side="top">
                                 {!studentProfile
                                    ? <p>Inicia sesión como estudiante para postularte.</p>
                                    : canApply
                                        ? <p>Postularse a esta pasantía.</p>
                                        : <p>Tu perfil no cumple los requisitos mínimos (coincidencia {'<'} 50%).</p>
                                 }
                             </TooltipContent>
                         </Tooltip>
                     </TooltipProvider>
                 </div>
             </div>
             <div className="flex flex-wrap gap-2 pt-2">
                 <Badge variant="secondary" className="text-sm px-3 py-1">{internship.area}</Badge>
                 <Badge variant="outline" className="text-sm px-3 py-1">
                     <GraduationCap size={16} className="mr-1" /> {internship.career} {/* Display career name or ID */}
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
                {/* Display text requirements if available */}
                {internship.requirements?.text && internship.requirements.text.length > 0 && (
                <div>
                    <h3 className="text-xl font-semibold mb-3 flex items-center gap-2"><CheckSquare size={20} /> Requisitos</h3>
                    <ul className="list-none space-y-2 pl-0">
                    {internship.requirements.text.map((req, index) => (
                        <li key={index} className="flex items-start gap-2 text-muted-foreground">
                            <CheckSquare size={16} className="text-primary mt-1 flex-shrink-0"/>
                            <span>{req}</span>
                        </li>
                    ))}
                    </ul>
                 </div>
                 )}
                 {/* TODO: Optionally display structured requirements (skills, languages) */}
            </div>
            <aside className="md:col-span-1 space-y-4">
                 <Card className="bg-secondary">
                     <CardHeader className="pb-2">
                         <CardTitle className="text-lg">Sobre la Empresa</CardTitle>
                     </CardHeader>
                     <CardContent>
                         <p className="text-sm text-muted-foreground mb-3">Más información sobre {internship.company}.</p>
                         {/* Link to company profile using companyId */}
                         <Link href={`/companies/${internship.companyId}`} passHref>
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
