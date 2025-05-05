
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Briefcase, GraduationCap, CalendarDays, ArrowRight, Target, Ban, CheckSquare } from 'lucide-react'; // Added CheckSquare
import Link from 'next/link';
import { Badge } from '@/components/ui/badge'; // Import Badge
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'; // Import Tooltip
import { useToast } from '@/hooks/use-toast'; // Import useToast
import React, { useState, useEffect } from 'react'; // Import useState, useEffect
import { safeLocalStorageGet, safeLocalStorageSet } from '@/lib/local-storage'; // Import safe localStorage functions

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

interface StudentProfile { // Simplified profile needed for apply logic
    username: string;
    appliedInternships?: string[];
}

interface InternshipCardProps {
  internship: InternshipWithMatch;
  canApply: boolean; // Added prop to control application eligibility
}

// Helper to determine badge color based on score
const getMatchScoreVariant = (score: number): "default" | "secondary" | "destructive" | "outline" => {
    if (score < 50) return "destructive"; // Low match
    if (score < 90) return "secondary"; // Medium match
    return "default"; // High/Perfect match (using primary color)
}

// --- Mock Email Sending Function ---
async function sendConfirmationEmail(email: string, internshipTitle: string, companyName: string) {
    // In a real app, this would call an API endpoint to send the email
    console.log(`Simulating sending confirmation email to ${email} for applying to "${internshipTitle}" at ${companyName}`);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    return { success: true };
}


export function InternshipCard({ internship, canApply }: InternshipCardProps) {
   const { toast } = useToast(); // Initialize toast
   const [hasApplied, setHasApplied] = useState(false);
   const [isLoadingProfile, setIsLoadingProfile] = useState(true); // Loading state for profile check

    useEffect(() => {
        // Check application status on mount and when internship changes
        const profileData = safeLocalStorageGet('userProfile');
        if (profileData && profileData.userType === 'student') {
            setHasApplied(profileData.appliedInternships?.includes(internship.id) || false);
        } else {
            setHasApplied(false); // Not logged in or not a student
        }
        setIsLoadingProfile(false);
    }, [internship.id]); // Dependency on internship.id

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

    const handleApplyClick = async () => {
        if (isLoadingProfile) return; // Prevent action while checking profile

        const profileData: StudentProfile | null = safeLocalStorageGet('userProfile');

        if (!profileData || profileData.userType !== 'student') {
            toast({
                title: "Acción no permitida",
                description: "Debes iniciar sesión como estudiante para postularte.",
                variant: "destructive",
            });
            return;
        }

        if (hasApplied) {
            toast({
                title: "Ya Postulado",
                description: "Ya te has postulado a esta pasantía.",
                variant: "info",
            });
            return;
        }

        if (!canApply) {
            toast({
                title: "Requisitos no Cumplidos",
                description: "Tu perfil no cumple los requisitos mínimos (coincidencia < 50%).",
                variant: "warning", // Changed to warning
            });
            return;
        }

        // --- Apply Logic ---
         try {
             // 1. Update Student Profile in localStorage
             const updatedProfile = {
                 ...profileData,
                 appliedInternships: [...(profileData.appliedInternships || []), internship.id],
             };
             safeLocalStorageSet('userProfile', updatedProfile);
             setHasApplied(true); // Update application status state

             // 2. Send Confirmation Email (Mock)
             const studentEmail = `${profileData.username}@utn.edu.ar`; // Mock email
             await sendConfirmationEmail(studentEmail, internship.title, internship.company);

             // 3. Show Success Toast
             toast({
                title: '¡Postulación Exitosa!',
                description: `Te has postulado a "${internship.title}". Se envió una confirmación a tu correo.`,
                variant: 'success',
             });

             // 4. In a real app, make API call here to record application in backend
             console.log(`Applying to internship ${internship.id} as ${profileData.username}`);

         } catch (error) {
             console.error("Error during application process:", error);
             toast({
                title: "Error al Postularse",
                description: "Ocurrió un error al procesar tu postulación.",
                variant: "destructive",
             });
              // Optional: Revert state if needed
              // setHasApplied(false);
              // Remove internship.id from localStorage profile
         }
    };

  // Determine button text, icon, and tooltip based on application status and eligibility
   const buttonText = hasApplied ? 'Aplicado' : 'Aplicar';
   const buttonIcon = hasApplied ? <CheckSquare className="ml-1 size-4" /> : (canApply ? <ArrowRight className="ml-1 size-4" /> : <Ban className="ml-1 size-4" />);
   const tooltipText =
        hasApplied ? "Ya te has postulado a esta pasantía." :
        canApply ? "Postularse a esta pasantía." :
        "Tu perfil no cumple los requisitos mínimos (coincidencia < 50%).";
    const isDisabled = !canApply || hasApplied || isLoadingProfile;


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
                 <Tooltip delayDuration={100}>
                     <TooltipTrigger asChild>
                        {/* Wrap the button in a div when disabled for Tooltip to work correctly */}
                        <div className={isDisabled && !hasApplied ? 'cursor-not-allowed' : ''}>
                            <Button
                                size="sm"
                                variant={hasApplied ? "success" : "default"} // Use success variant if applied
                                disabled={isDisabled}
                                className={`${isDisabled && !hasApplied ? 'pointer-events-none opacity-60' : ''} ${hasApplied ? 'bg-green-600 hover:bg-green-700 pointer-events-none' : ''}`} // Added applied styles
                                onClick={handleApplyClick}
                            >
                                {buttonText} {buttonIcon}
                            </Button>
                        </div>
                     </TooltipTrigger>
                     <TooltipContent side="top">
                         <p>{tooltipText}</p>
                     </TooltipContent>
                 </Tooltip>
             </TooltipProvider>
         </div>
      </CardFooter>
    </Card>
  );
}
