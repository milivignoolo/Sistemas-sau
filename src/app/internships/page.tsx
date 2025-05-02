

'use client';

import * as React from 'react';
import { InternshipCard, InternshipWithMatch } from '@/components/internships/internship-card'; // Import updated card and type
import { InternshipFilters, FiltersState, MatchScoreLevel } from '@/components/internships/internship-filters'; // Import updated filters and types
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import Alert
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

// --- Mock Authentication & User Profile ---
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

// Mock Student Profile structure (align with registration form)
interface StudentProfile {
    username: string; // Legajo
    career: string; // Career ID like 'sistemas'
    currentYear: number;
    technicalSkills?: { [key: string]: string }; // { 'react': 'Intermedio', ... }
    softSkills?: { [key: string]: string };
    languages?: { [key: string]: string };
}

// Mock data for internships including requirements - replace with actual data fetching
const allInternships = [
  {
    id: '1',
    title: 'Desarrollador Frontend Jr.',
    company: 'Tech Solutions Inc.',
    location: 'Remoto',
    area: 'dev-web', // Match area ID
    career: 'sistemas', // Match career ID
    requiredYear: 3,
    description: 'Buscamos un estudiante avanzado para unirse a nuestro equipo de desarrollo frontend. Tecnologías: React, TypeScript.',
    postedDate: new Date(2024, 6, 15),
    imageUrl: 'https://picsum.photos/seed/tech1/300/200',
    aiHint: 'technology office',
    requirements: {
      technicalSkills: { javascript: 'Intermedio', react: 'Básico', git: 'Básico' },
      softSkills: { teamwork: 'Desarrollado', communication: 'Desarrollado' },
      languages: { english: 'Básico (A1/A2)' },
    },
    duration: '6 meses', // Example duration
  },
   {
    id: '2',
    title: 'Analista de Procesos Químicos',
    company: 'ChemCorp',
    location: 'Resistencia, Chaco',
    area: 'procesos', // Match area ID
    career: 'quimica', // Match career ID
    requiredYear: 3,
    description: 'Oportunidad para estudiantes de Ing. Química para analizar y optimizar procesos en planta.',
    postedDate: new Date(2024, 6, 10),
    imageUrl: 'https://picsum.photos/seed/chem1/300/200',
    aiHint: 'chemistry laboratory',
     requirements: {
        technicalSkills: { excel: 'Avanzado' }, // Assuming excel is a skill
        softSkills: { problem_solving: 'Fuerte', critical_thinking: 'Desarrollado' },
        languages: {}, // No specific language requirement
     },
     duration: '4 meses',
  },
   {
    id: '3',
    title: 'Pasantía en Mantenimiento Mecánico',
    company: 'Metalúrgica Industrial SRL',
    location: 'Barranqueras, Chaco',
    area: 'mantenimiento', // Match area ID
    career: 'mecanica', // Match career ID
    requiredYear: 2,
    description: 'Colaborar en el plan de mantenimiento preventivo y correctivo de maquinaria industrial.',
    postedDate: new Date(2024, 6, 20),
    imageUrl: 'https://picsum.photos/seed/mech1/300/200',
    aiHint: 'mechanic workshop',
     requirements: {
        technicalSkills: { autocad: 'Básico' }, // Assuming autocad is a skill
        softSkills: { proactivity: 'Desarrollado' },
        languages: {},
     },
     duration: '6 meses',
  },
   {
    id: '4',
    title: 'Desarrollador Backend (Node.js)',
    company: 'Startup Innovadora',
    location: 'Remoto',
    area: 'dev-soft', // Match area ID
    career: 'sistemas', // Match career ID
    requiredYear: 4,
    description: 'Participa en el desarrollo de nuestra API REST utilizando Node.js, Express y MongoDB.',
    postedDate: new Date(2024, 6, 18),
    imageUrl: 'https://picsum.photos/seed/tech2/300/200',
    aiHint: 'code software',
     requirements: {
        technicalSkills: { nodejs: 'Intermedio', nosql: 'Básico', git: 'Intermedio' },
        softSkills: { adaptability: 'Desarrollado', learning: 'Fuerte' },
        languages: { english: 'Intermedio (B1/B2)' },
     },
     duration: '6+ meses',
  },
   {
    id: '5',
    title: 'Asistente de Ingeniería Civil',
    company: 'Constructora Norte',
    location: 'Resistencia, Chaco',
    area: 'construccion', // Match area ID
    career: 'civil', // Match career ID
    requiredYear: 3,
    description: 'Apoyo en la supervisión de obras, cómputos y mediciones.',
    postedDate: new Date(2024, 6, 5),
    imageUrl: 'https://picsum.photos/seed/civil1/300/200',
    aiHint: 'construction site building',
     requirements: {
        technicalSkills: { autocad: 'Intermedio' }, // Assuming autocad is a skill
        softSkills: { communication: 'Desarrollado' },
        languages: {},
     },
     duration: '6 meses',
  },
];

// Mock list of careers and areas for filters (make sure IDs match internship data)
const careers = [
  { id: 'sistemas', name: 'Ingeniería en Sistemas de Información' },
  { id: 'quimica', name: 'Ingeniería Química' },
  { id: 'mecanica', name: 'Ingeniería Mecánica' },
  { id: 'electrica', name: 'Ingeniería Eléctrica' },
  { id: 'civil', name: 'Ingeniería Civil' },
  { id: 'industrial', name: 'Ingeniería Industrial' },
];
const areas = [
    {id: 'dev-web', name: 'Desarrollo Web'},
    {id: 'dev-soft', name: 'Desarrollo Software'},
    {id: 'procesos', name: 'Procesos Industriales'},
    {id: 'mantenimiento', name: 'Mantenimiento'},
    {id: 'construccion', name: 'Construcción'},
    {id: 'qa', name: 'Calidad / QA'},
    {id: 'admin', name: 'Administración / Gestión'},
    {id: 'data', name: 'Datos / BI'},
    {id: 'infra', name: 'Infraestructura / Redes'},
    {id: 'otro', name: 'Otro'},
];

// --- Match Score Calculation ---
const calculateMatchScore = (student: StudentProfile | null, internship: typeof allInternships[0]): number => {
    if (!student) return 0; // No student logged in

    let score = 0;
    let totalRequirements = 0;

    const studentTech = student.technicalSkills || {};
    const studentSoft = student.softSkills || {};
    const studentLang = student.languages || {};

    const reqTech = internship.requirements?.technicalSkills || {};
    const reqSoft = internship.requirements?.softSkills || {};
    const reqLang = internship.requirements?.languages || {};

    // Compare Technical Skills
    Object.keys(reqTech).forEach(skillId => {
        totalRequirements++;
        if (studentTech[skillId]) {
            // TODO: Implement level comparison logic (e.g., student level >= required level)
            // For simplicity, just checking existence for now
            score++;
        }
    });

    // Compare Soft Skills
    Object.keys(reqSoft).forEach(skillId => {
        totalRequirements++;
        if (studentSoft[skillId]) {
             // TODO: Implement level comparison if needed
             score++;
        }
    });

    // Compare Languages
    Object.keys(reqLang).forEach(skillId => {
        totalRequirements++;
        if (studentLang[skillId]) {
            // TODO: Implement level comparison if needed
             score++;
        }
    });

    // Compare Career and Year (Basic Check)
    if (internship.career) {
        totalRequirements++;
        if (student.career === internship.career) {
            score++;
        }
    }
    if (internship.requiredYear) {
        totalRequirements++;
        if (student.currentYear >= internship.requiredYear) {
            score++;
        }
    }


    return totalRequirements > 0 ? Math.round((score / totalRequirements) * 100) : 0;
};

// Map score to level
const getMatchScoreLevel = (score: number): MatchScoreLevel => {
    if (score < 50) return 'low';
    if (score < 90) return 'medium';
    if (score < 100) return 'high';
    return 'perfect';
}


export default function InternshipsPage() {
  const [studentProfile, setStudentProfile] = React.useState<StudentProfile | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = React.useState(true);
   const [filters, setFilters] = React.useState<FiltersState>({
    searchTerm: '',
    selectedCareer: 'all', // Default to 'all'
    selectedArea: 'all', // Default to 'all'
    isRemote: false,
    selectedYear: 'any',
    selectedDuration: 'any',
    selectedLanguage: 'any',
    matchScoreLevel: 'all',
  });
  const [currentPage, setCurrentPage] = React.useState(1); // Basic pagination state
  const itemsPerPage = 6; // Adjust as needed


   React.useEffect(() => {
    // Simulate fetching user profile after component mounts
    const profileData = safeLocalStorageGet('userProfile');
     if (profileData && profileData.userType === 'student') {
        // Map stored data to StudentProfile structure
         const mappedProfile: StudentProfile = {
             username: profileData.username,
             career: profileData.career, // Assuming career ID is stored directly
             currentYear: profileData.currentYear || 0, // Or fetch from profile if available
             technicalSkills: profileData.profile?.technicalSkills || {},
             softSkills: profileData.profile?.softSkills || {},
             languages: profileData.profile?.languages || {},
         };
        setStudentProfile(mappedProfile);
        console.log("Student profile loaded:", mappedProfile);
     } else {
         console.log("No student profile found or user is not a student.");
     }
    setIsLoadingAuth(false);
  }, []);

   const handleFiltersChange = (newFilters: FiltersState) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // --- Filtering Logic ---
  const filteredInternships = React.useMemo(() => {
     if (!studentProfile) {
        return []; // Don't show internships if not logged in as student
     }

    return allInternships
      .map(internship => ({
        ...internship,
        matchScore: calculateMatchScore(studentProfile, internship),
      }))
      .filter(internship => {
        const scoreLevel = getMatchScoreLevel(internship.matchScore);

        // Match Score Filter
         if (filters.matchScoreLevel !== 'all' && scoreLevel !== filters.matchScoreLevel) {
             return false;
         }

        // Search Term Filter (Title or Company)
        if (filters.searchTerm &&
            !internship.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
            !internship.company.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
          return false;
        }

        // Career Filter - Use 'all' instead of ''
         if (filters.selectedCareer !== 'all' && internship.career !== filters.selectedCareer) {
          return false;
        }

        // Area Filter - Use 'all' instead of ''
        if (filters.selectedArea !== 'all' && internship.area !== filters.selectedArea) {
          return false;
        }

        // Remote Filter
        if (filters.isRemote && internship.location.toLowerCase() !== 'remoto') {
          return false;
        }

        // Year Filter
        if (filters.selectedYear !== 'any' && internship.requiredYear) {
            // Handle "Graduado Reciente" - assuming it means year > 5 or a specific flag
            if (filters.selectedYear === 'Graduado Reciente') {
                // Example: Assuming grads are marked with year 6 or higher, or a specific flag
                // This logic depends on how your internship data represents this
                if (internship.requiredYear < 6) return false; // Adapt as needed
            } else {
                 const requiredYearNum = parseInt(filters.selectedYear, 10);
                 // Show internships requiring this year or less
                 if (internship.requiredYear > requiredYearNum) {
                     return false;
                 }
            }
        }


         // Duration Filter (Simplified check)
         if (filters.selectedDuration !== 'any') {
             const dur = internship.duration?.toLowerCase() || '';
             const filterDur = filters.selectedDuration;
             let match = false;
             if (filterDur === '1-3 meses' && (dur.includes('1 mes') || dur.includes('2 mes') || dur.includes('3 mes'))) match = true;
             if (filterDur === '4-6 meses' && (dur.includes('4 mes') || dur.includes('5 mes') || dur.includes('6 mes'))) match = true;
             if (filterDur === '6+ meses' && !dur.includes('1 mes') && !dur.includes('2 mes') && !dur.includes('3 mes') && !dur.includes('4 mes') && !dur.includes('5 mes')) match = true; // Basic check
             if (filterDur === 'Indefinido' && dur.includes('indefinido')) match = true;
             if (!match) return false;
         }

         // Language Filter
         if (filters.selectedLanguage !== 'any') {
             const requiredLangs = Object.keys(internship.requirements?.languages || {});
             if (!requiredLangs.includes(filters.selectedLanguage)) {
                 return false;
             }
         }


        return true;
      });
  }, [filters, studentProfile]);


  // --- Pagination Logic ---
  const totalPages = Math.ceil(filteredInternships.length / itemsPerPage);
  const paginatedInternships = filteredInternships.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };


  // --- Render Logic ---
   if (isLoadingAuth) {
    // Optional: Show a loading skeleton or spinner while checking auth
    return <p className="text-center text-muted-foreground">Cargando...</p>;
  }

  if (!studentProfile) {
     return (
        <div className="flex flex-col items-center justify-center h-full mt-10 text-center">
             <Card className="w-full max-w-md p-8">
                 <CardHeader className="items-center">
                    <Lock size={48} className="text-destructive mb-4" />
                    <CardTitle className="text-2xl">Acceso Restringido</CardTitle>
                    <CardDescription>
                        Debes iniciar sesión como estudiante para ver y postularte a las pasantías.
                    </CardDescription>
                 </CardHeader>
                <CardContent>
                     <Link href="/login" passHref>
                         <Button className="w-full">
                             Ir a Iniciar Sesión
                        </Button>
                     </Link>
                    <Link href="/register?type=student" passHref>
                         <Button variant="link" className="w-full mt-2">
                             O regístrate como estudiante
                        </Button>
                    </Link>
                 </CardContent>
            </Card>
             {/* Removed the English text */}
        </div>
    );
  }


  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Filters Sidebar */}
      <aside className="w-full md:w-1/4 lg:w-1/5">
        <InternshipFilters
            careers={careers}
            areas={areas}
            onFiltersChange={handleFiltersChange}
            initialFilters={filters}
         />
      </aside>

      {/* Internship List */}
      <main className="w-full md:w-3/4 lg:w-4/5">
        <h1 className="text-3xl font-bold mb-2">Pasantías Disponibles</h1>
         <p className="text-muted-foreground mb-6">
             Explora las oportunidades y postúlate a las que mejor coincidan con tu perfil.
             {/* Showing {paginatedInternships.length} of {filteredInternships.length} internships. */}
         </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedInternships.map((internship) => (
            <InternshipCard
                key={internship.id}
                internship={internship as InternshipWithMatch} // Cast to include matchScore
                // Pass application eligibility based on score
                 canApply={internship.matchScore >= 50} // Apply if score is medium, high or perfect
            />
          ))}
          {/* Add loading state or no results message */}
          {filteredInternships.length === 0 && (
             <p className="col-span-full text-center text-muted-foreground py-10 bg-secondary rounded-md">
                No se encontraron pasantías que coincidan con los filtros seleccionados.
            </p>
          )}
        </div>

         {/* Pagination - Only show if more than one page */}
         {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
                 <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => { e.preventDefault(); handlePageChange(Math.max(1, currentPage - 1)); }}
                        aria-disabled={currentPage === 1}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                       />
                    </PaginationItem>
                     {/* Basic number rendering - improve for more pages */}
                     {[...Array(totalPages).keys()].map(num => (
                        <PaginationItem key={num + 1}>
                            <PaginationLink
                                href="#"
                                onClick={(e) => { e.preventDefault(); handlePageChange(num + 1); }}
                                isActive={currentPage === num + 1}
                            >
                                {num + 1}
                            </PaginationLink>
                        </PaginationItem>
                     ))}
                    {/* Add Ellipsis logic if needed */}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                         onClick={(e) => { e.preventDefault(); handlePageChange(Math.min(totalPages, currentPage + 1)); }}
                        aria-disabled={currentPage === totalPages}
                         className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                       />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
            </div>
         )}
      </main>
    </div>
  );
}
