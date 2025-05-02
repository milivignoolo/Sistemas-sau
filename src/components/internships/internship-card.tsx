
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Briefcase, GraduationCap, CalendarDays, ArrowRight, Target, Ban } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge'; // Import Badge
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'; // Import Tooltip


// Update the type for the internship prop to include matchScore
export interface InternshipWithMatch {
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
  matchScore: number; // Added match score
  // Add requirements if needed for display, though detailed view is better
}

interface InternshipCardProps {
  internship: InternshipWithMatch;
  canApply: boolean; // Added prop to control application button state
}

// Helper to determine badge color based on score
const getMatchScoreVariant = (score: number): "default" | "secondary" | "destructive" | "outline" => {
    if (score < 50) return "destructive"; // Low match
    if (score < 90) return "secondary"; // Medium match
    return "default"; // High/Perfect match (using primary color)
}

export function InternshipCard({ internship, canApply }: InternshipCardProps) {
   const formattedDate = internship.postedDate.toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

   const scoreVariant = getMatchScoreVariant(internship.matchScore);
   const scoreTooltip =
        scoreVariant === "destructive" ? "Coincidencia Baja (<50%)" :
        scoreVariant === "secondary" ? "Coincidencia Media (50-89%)" :
        "Coincidencia Alta (90-100%)";


  return (
    <Card className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow duration-200 border-2 border-transparent hover:border-primary/20">
       {/* Optional: Add a subtle border based on match score */}
       {/* <Card className={`flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow duration-200 border-2 ${
           scoreVariant === 'destructive' ? 'border-destructive/30' : scoreVariant === 'secondary' ? 'border-secondary' : 'border-primary/30'
       }`}> */}

      <div className="relative">
         <Image
            data-ai-hint={internship.aiHint}
            src={internship.imageUrl}
            alt={`Logo o imagen de ${internship.company}`}
            width={300}
            height={180} // Adjusted height for better proportion
            className="w-full h-40 object-cover" // Adjusted height
         />
         {/* Match Score Badge - Absolutely Positioned */}
         <TooltipProvider>
             <Tooltip>
                 <TooltipTrigger asChild>
                    <Badge variant={scoreVariant} className="absolute top-2 right-2 flex items-center gap-1 cursor-default">
                        <Target size={14} /> {internship.matchScore}%
                    </Badge>
                 </TooltipTrigger>
                 <TooltipContent>
                     <p>{scoreTooltip}</p>
                 </TooltipContent>
             </Tooltip>
         </TooltipProvider>
      </div>

      <CardHeader className="pb-2 pt-4"> {/* Adjusted padding */}
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
      <CardFooter className="flex justify-between items-center pt-3 pb-4 border-t"> {/* Adjusted padding */}
         <span className="text-xs text-muted-foreground flex items-center gap-1">
           <CalendarDays size={14}/> {formattedDate}
         </span>
         <div className="flex gap-2">
            {/* Link to the detailed internship page */}
            <Link href={`/internships/${internship.id}`} passHref>
               <Button size="sm" variant="outline">
                 Ver Detalles
               </Button>
            </Link>
            {/* Conditional Apply Button */}
             <TooltipProvider>
                 <Tooltip delayDuration={canApply ? 500 : 100}>
                     <TooltipTrigger asChild>
                        {/* Wrap the button in a div when disabled for Tooltip to work correctly */}
                        <div className={!canApply ? 'cursor-not-allowed' : ''}>
                            <Button
                                size="sm"
                                variant="default"
                                disabled={!canApply}
                                // className={!canApply ? 'pointer-events-none' : ''} // Prevent clicks if disabled
                                onClick={() => console.log(`Applying to internship ${internship.id}`)} // Add actual apply logic
                            >
                                {canApply ? (
                                     <>Aplicar <ArrowRight className="ml-1 size-4" /></>
                                ) : (
                                     <>Aplicar <Ban className="ml-1 size-4" /></>
                                )}
                            </Button>
                        </div>
                     </TooltipTrigger>
                     <TooltipContent side="top">
                         {canApply
                            ? <p>Postularse a esta pasantía.</p>
                            : <p>Tu perfil no cumple los requisitos mínimos (coincidencia {'<'} 50%).</p>}
                     </TooltipContent>
                 </Tooltip>
             </TooltipProvider>
         </div>
      </CardFooter>
    </Card>
  );
}
