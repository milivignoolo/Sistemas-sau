import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Building } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Mock data for companies - replace with actual data fetching
const companies = [
  { id: 'tech-solutions-inc', name: 'Tech Solutions Inc.', description: 'Líder en soluciones de software empresarial.' },
  { id: 'chemcorp', name: 'ChemCorp', description: 'Innovación en la industria química.' },
  { id: 'metalurgica-industrial-srl', name: 'Metalúrgica Industrial SRL', description: 'Fabricación de componentes metálicos de alta precisión.' },
  { id: 'startup-innovadora', name: 'Startup Innovadora', description: 'Desarrollo de aplicaciones móviles disruptivas.' },
  { id: 'constructora-norte', name: 'Constructora Norte', description: 'Proyectos de infraestructura y edificación.' },
];

export default function CompaniesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Empresas Colaboradoras</h1>
      <p className="text-muted-foreground mb-8">
          Estas son algunas de las empresas que confían en el talento de los estudiantes de la UTN.
      </p>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {companies.map((company) => (
          <Card key={company.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                 <Building size={20} className="text-primary"/>
                 {company.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{company.description}</p>
               <Link href={`/companies/${company.id}`} passHref>
                 <Button variant="outline" size="sm" className="w-full">Ver Perfil y Pasantías</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
       {/* Placeholder for future features like search or filtering */}
    </div>
  );
}
