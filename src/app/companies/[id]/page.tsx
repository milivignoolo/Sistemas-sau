import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, MapPin, Mail, Phone, Link as LinkIcon, Briefcase } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { InternshipCard } from '@/components/internships/internship-card'; // Reuse internship card
import { Separator } from "@/components/ui/separator";

// Mock data fetching function - replace with actual API call
const getCompanyData = (id: string) => {
   // In a real app, fetch this from your backend/database using the id
   const allCompanies = [
    {
        id: 'tech-solutions-inc',
        name: 'Tech Solutions Inc.',
        description: 'Somos una empresa líder en el desarrollo de software a medida y soluciones tecnológicas innovadoras para diversos sectores. Nuestro equipo está compuesto por profesionales apasionados por la tecnología y comprometidos con la excelencia.',
        location: 'Av. Sarmiento 1111, Resistencia, Chaco',
        email: 'contacto@techsolutions.com',
        phone: '+54 362 412-3456',
        website: 'https://www.techsolutions-example.com',
        logoUrl: 'https://picsum.photos/seed/logo1/200/200',
        aiHint: 'modern office building',
        bannerUrl: 'https://picsum.photos/seed/banner1/1000/300',
        aiBannerHint: 'abstract technology background',
    },
    {
        id: 'chemcorp',
        name: 'ChemCorp',
        description: 'ChemCorp se dedica a la investigación, desarrollo y producción de productos químicos especializados para la industria. Buscamos constantemente la innovación y la sostenibilidad en nuestros procesos.',
        location: 'Parque Industrial, Resistencia, Chaco',
        email: 'rrhh@chemcorp.ind',
        phone: '+54 362 498-7654',
        website: 'https://www.chemcorp-example.ind',
        logoUrl: 'https://picsum.photos/seed/logo2/200/200',
        aiHint: 'chemical flask laboratory',
         bannerUrl: 'https://picsum.photos/seed/banner2/1000/300',
        aiBannerHint: 'industrial chemical plant pipes',
    },
     {
        id: 'metalurgica-industrial-srl',
        name: 'Metalúrgica Industrial SRL',
        description: 'Con más de 20 años de experiencia, nos especializamos en la fabricación de piezas y componentes metálicos de alta precisión para la agroindustria y el sector automotriz.',
        location: 'Ruta 11 Km 1008, Barranqueras, Chaco',
        email: 'info@metalurgicaindustrial.com.ar',
        phone: '+54 362 444-5566',
        website: 'https://www.metalurgicaindustrial-example.com.ar',
        logoUrl: 'https://picsum.photos/seed/logo3/200/200',
        aiHint: 'metal gear cogwheel',
         bannerUrl: 'https://picsum.photos/seed/banner3/1000/300',
        aiBannerHint: 'metalworking CNC machine sparks',
    },
     // Add more companies as needed
  ];
   return allCompanies.find(company => company.id === id);
}

// Mock data for internships offered by a company - replace with actual fetching
const getCompanyInternships = (companyId: string) => {
    const allInternships = [
         {
            id: '1',
            title: 'Desarrollador Frontend Jr.',
            company: 'Tech Solutions Inc.', // Matches company name
            companyId: 'tech-solutions-inc',
            location: 'Remoto',
            area: 'Desarrollo Web',
            career: 'Ingeniería en Sistemas de Información',
            description: 'Buscamos un estudiante avanzado para unirse a nuestro equipo de desarrollo frontend.',
            postedDate: new Date(2024, 6, 15),
            imageUrl: 'https://picsum.photos/seed/tech1/300/200',
             aiHint: 'code computer screen',
        },
         {
            id: '4',
            title: 'Desarrollador Backend (Node.js)',
            company: 'Startup Innovadora', // Example for a different company
            companyId: 'startup-innovadora',
             location: 'Remoto',
            area: 'Desarrollo Software',
            career: 'Ingeniería en Sistemas de Información',
            description: 'Participa en el desarrollo de nuestra API REST.',
            postedDate: new Date(2024, 6, 18),
             imageUrl: 'https://picsum.photos/seed/tech2/300/200',
             aiHint: 'network server rack',
        },
         {
            id: '2',
            title: 'Analista de Procesos Químicos',
            company: 'ChemCorp', // Matches company name
            companyId: 'chemcorp',
             location: 'Resistencia, Chaco',
            area: 'Procesos Industriales',
            career: 'Ingeniería Química',
            description: 'Oportunidad para estudiantes de Ing. Química para analizar y optimizar procesos.',
            postedDate: new Date(2024, 6, 10),
            imageUrl: 'https://picsum.photos/seed/chem1/300/200',
            aiHint: 'laboratory beaker science',
        },
          // Add more internships...
    ];
     // Filter internships by the company ID
    return allInternships.filter(internship => internship.companyId === companyId);
}


interface CompanyDetailPageProps {
  params: { id: string };
}

export default function CompanyDetailPage({ params }: CompanyDetailPageProps) {
  const company = getCompanyData(params.id);
  const internships = getCompanyInternships(params.id);


  if (!company) {
    return <p className="text-center text-destructive">Empresa no encontrada.</p>;
  }

  return (
    <div className="space-y-8">
       <Card className="overflow-hidden">
           {/* Banner Image */}
           <Image
                data-ai-hint={company.aiBannerHint}
                src={company.bannerUrl}
                alt={`Banner de ${company.name}`}
                width={1000}
                height={250} // Adjusted height for banner
                className="w-full h-48 md:h-64 object-cover"
           />
            <CardContent className="p-6 relative">
                 {/* Logo absolutely positioned */}
                <div className="absolute left-6 -top-12 md:-top-16 size-24 md:size-32 rounded-full border-4 border-background bg-background overflow-hidden shadow-lg">
                     <Image
                        data-ai-hint={company.aiHint}
                        src={company.logoUrl}
                        alt={`Logo de ${company.name}`}
                        width={128}
                        height={128}
                        className="object-contain w-full h-full"
                    />
                 </div>

                 {/* Company Name and Title - Pushed down */}
                 <div className="pt-16 md:pt-20 mb-6">
                     <CardTitle className="text-3xl font-bold flex items-center gap-3 mb-2">
                         <Building /> {company.name}
                     </CardTitle>
                     {/* Optional: Add a tagline or industry badge here */}
                 </div>

                 {/* Company Details Grid */}
                 <div className="grid md:grid-cols-3 gap-6 mb-6">
                     <div className="md:col-span-2 space-y-3">
                         <h3 className="text-lg font-semibold border-b pb-1">Acerca de Nosotros</h3>
                        <p className="text-muted-foreground text-sm">{company.description}</p>
                     </div>
                     <div className="space-y-3 text-sm">
                          <h3 className="text-lg font-semibold border-b pb-1">Contacto</h3>
                         <p className="flex items-center gap-2 text-muted-foreground"><MapPin size={16} /> {company.location}</p>
                         <p className="flex items-center gap-2 text-muted-foreground"><Mail size={16} /> <a href={`mailto:${company.email}`} className="text-primary hover:underline">{company.email}</a></p>
                         {company.phone && <p className="flex items-center gap-2 text-muted-foreground"><Phone size={16} /> {company.phone}</p>}
                         {company.website && <p className="flex items-center gap-2 text-muted-foreground"><LinkIcon size={16} /> <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{company.website}</a></p>}
                     </div>
                 </div>
             </CardContent>
       </Card>

        {/* Internships Section */}
        <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Briefcase /> Pasantías Ofrecidas
            </h2>
            {internships.length > 0 ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {internships.map((internship) => (
                    <InternshipCard key={internship.id} internship={internship} />
                ))}
                </div>
            ) : (
                <p className="text-muted-foreground text-center py-6 bg-secondary rounded-md">
                    Actualmente, {company.name} no tiene pasantías publicadas en nuestra plataforma.
                </p>
            )}
        </section>

        <div className="mt-8">
            <Link href="/companies" passHref>
                <Button variant="outline">
                &larr; Volver a Empresas
                </Button>
            </Link>
        </div>
    </div>
  );
}

// Optional: Generate static paths if you have a known list of companies at build time
// export async function generateStaticParams() {
//   // Fetch all company IDs
//   const companies = [{ id: 'tech-solutions-inc' }, { id: 'chemcorp' }, {id: 'metalurgica-industrial-srl'}]; // Replace with actual fetch
//   return companies.map((company) => ({
//     id: company.id,
//   }));
// }
