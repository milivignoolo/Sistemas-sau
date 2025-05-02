import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Briefcase, GraduationCap, CalendarDays, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge'; // Import Badge

// Define the type for the internship prop
interface Internship {
  id: string;
  title: string;
  company: string;
  location: string;
  area: string;
  career: string;
  description: string;
  postedDate: Date;
  imageUrl: string;
  aiHint: string;
}

interface InternshipCardProps {
  internship: Internship;
}

export function InternshipCard({ internship }: InternshipCardProps) {
   const formattedDate = internship.postedDate.toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <Card className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <Image
        data-ai-hint={internship.aiHint}
        src={internship.imageUrl}
        alt={`Logo o imagen de ${internship.company}`}
        width={300}
        height={180} // Adjusted height for better proportion
        className="w-full h-40 object-cover" // Adjusted height
      />
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold mb-1">{internship.title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground flex items-center gap-1">
           <Briefcase size={14} /> {internship.company}
        </CardDescription>
         <CardDescription className="text-sm text-muted-foreground flex items-center gap-1">
           <MapPin size={14} /> {internship.location}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-3 pt-2 pb-4 text-sm">
         <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{internship.area}</Badge>
            {/* Truncate long career names if necessary */}
            <Badge variant="outline" className="truncate" title={internship.career}>
                <GraduationCap size={14} className="mr-1" />
                {internship.career.length > 30 ? internship.career.substring(0, 27) + '...' : internship.career}
             </Badge>
        </div>
        <p className="text-muted-foreground line-clamp-3">{internship.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-4 border-t">
         <span className="text-xs text-muted-foreground flex items-center gap-1">
           <CalendarDays size={14}/> Publicado: {formattedDate}
         </span>
        {/* Link to the detailed internship page */}
        <Link href={`/internships/${internship.id}`} passHref>
           <Button size="sm" variant="default">
             Ver Detalles <ArrowRight className="ml-1 size-4" />
           </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
