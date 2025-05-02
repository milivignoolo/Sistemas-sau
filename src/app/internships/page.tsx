import { InternshipCard } from '@/components/internships/internship-card';
import { InternshipFilters } from '@/components/internships/internship-filters';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

// Mock data for internships - replace with actual data fetching
const internships = [
  {
    id: '1',
    title: 'Desarrollador Frontend Jr.',
    company: 'Tech Solutions Inc.',
    location: 'Remoto',
    area: 'Desarrollo Web',
    career: 'Ingeniería en Sistemas de Información',
    description: 'Buscamos un estudiante avanzado para unirse a nuestro equipo de desarrollo frontend. Tecnologías: React, TypeScript.',
    postedDate: new Date(2024, 6, 15),
    imageUrl: 'https://picsum.photos/seed/tech1/300/200',
    aiHint: 'technology office',
  },
   {
    id: '2',
    title: 'Analista de Procesos Químicos',
    company: 'ChemCorp',
    location: 'Resistencia, Chaco',
    area: 'Procesos Industriales',
    career: 'Ingeniería Química',
    description: 'Oportunidad para estudiantes de Ing. Química para analizar y optimizar procesos en planta.',
    postedDate: new Date(2024, 6, 10),
    imageUrl: 'https://picsum.photos/seed/chem1/300/200',
    aiHint: 'chemistry laboratory',
  },
   {
    id: '3',
    title: 'Pasantía en Mantenimiento Mecánico',
    company: 'Metalúrgica Industrial SRL',
    location: 'Barranqueras, Chaco',
    area: 'Mantenimiento',
    career: 'Ingeniería Mecánica',
    description: 'Colaborar en el plan de mantenimiento preventivo y correctivo de maquinaria industrial.',
    postedDate: new Date(2024, 6, 20),
    imageUrl: 'https://picsum.photos/seed/mech1/300/200',
    aiHint: 'mechanic workshop',
  },
   {
    id: '4',
    title: 'Desarrollador Backend (Node.js)',
    company: 'Startup Innovadora',
    location: 'Remoto',
    area: 'Desarrollo Software',
    career: 'Ingeniería en Sistemas de Información',
    description: 'Participa en el desarrollo de nuestra API REST utilizando Node.js, Express y MongoDB.',
    postedDate: new Date(2024, 6, 18),
    imageUrl: 'https://picsum.photos/seed/tech2/300/200',
    aiHint: 'code software',
  },
   {
    id: '5',
    title: 'Asistente de Ingeniería Civil',
    company: 'Constructora Norte',
    location: 'Resistencia, Chaco',
    area: 'Construcción',
    career: 'Ingeniería Civil',
    description: 'Apoyo en la supervisión de obras, cómputos y mediciones.',
    postedDate: new Date(2024, 6, 5),
    imageUrl: 'https://picsum.photos/seed/civil1/300/200',
    aiHint: 'construction site building',
  },
];

// Mock list of careers and areas for filters
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
];

export default function InternshipsPage() {
  // TODO: Implement state management for filters and pagination
  // TODO: Fetch actual data based on filters and pagination

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Filters Sidebar */}
      <aside className="w-full md:w-1/4 lg:w-1/5">
        <InternshipFilters careers={careers} areas={areas} />
      </aside>

      {/* Internship List */}
      <main className="w-full md:w-3/4 lg:w-4/5">
        <h1 className="text-3xl font-bold mb-6">Pasantías Disponibles</h1>
        <p className="text-muted-foreground mb-4">You are a student, you can see the internships and apply here.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {internships.map((internship) => (
            <InternshipCard key={internship.id} internship={internship} />
          ))}
          {/* Add loading state or no results message */}
          {internships.length === 0 && (
             <p className="col-span-full text-center text-muted-foreground">No se encontraron pasantías con los filtros seleccionados.</p>
          )}
        </div>

         {/* Pagination */}
        <div className="mt-8 flex justify-center">
             <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">1</PaginationLink>
                </PaginationItem>
                 <PaginationItem>
                  <PaginationLink href="#" isActive>
                    2
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
        </div>
      </main>
    </div>
  );
}
