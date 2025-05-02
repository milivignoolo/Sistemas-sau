
'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User, GraduationCap, Mail, CalendarCheck, Brain, CheckSquare, Languages, Save, Edit } from 'lucide-react';
import { SkillCheckboxGroup } from '@/components/auth/skill-checkbox-group';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import Alert components

// --- Predefined Lists (Ensure these match registration form) ---
const PREDEFINED_TECHNICAL_SKILLS = [
    { id: 'javascript', name: 'JavaScript' }, { id: 'typescript', name: 'TypeScript' },
    { id: 'react', name: 'React' }, { id: 'nextjs', name: 'Next.js' },
    { id: 'nodejs', name: 'Node.js' }, { id: 'python', name: 'Python' },
    { id: 'java', name: 'Java' }, { id: 'csharp', name: 'C#' },
    { id: 'sql', name: 'SQL' }, { id: 'nosql', name: 'NoSQL (MongoDB, etc.)' },
    { id: 'git', name: 'Git' }, { id: 'docker', name: 'Docker' },
    { id: 'cloud', name: 'Cloud (AWS/GCP/Azure)' }, { id: 'html_css', name: 'HTML/CSS' },
];
const PREDEFINED_SOFT_SKILLS = [
    { id: 'teamwork', name: 'Trabajo en Equipo' }, { id: 'communication', name: 'Comunicación Efectiva' },
    { id: 'problem_solving', name: 'Resolución de Problemas' }, { id: 'adaptability', name: 'Adaptabilidad' },
    { id: 'proactivity', name: 'Proactividad' }, { id: 'learning', name: 'Ganas de Aprender' },
    { id: 'leadership', name: 'Liderazgo' }, { id: 'critical_thinking', name: 'Pensamiento Crítico' },
];
const PREDEFINED_LANGUAGES = [
    { id: 'english', name: 'Inglés' }, { id: 'portuguese', name: 'Portugués' },
    { id: 'french', name: 'Francés' }, { id: 'german', name: 'Alemán' },
    { id: 'italian', name: 'Italiano' },
];
const PROFICIENCY_LEVELS = ['Básico', 'Intermedio', 'Avanzado'];
const LANGUAGE_LEVELS = ['Básico (A1/A2)', 'Intermedio (B1/B2)', 'Avanzado (C1/C2)', 'Nativo'];
const SOFT_SKILL_LEVELS = ['En Desarrollo', 'Desarrollado', 'Fuerte'];

// --- localStorage Interaction ---
const safeLocalStorageGet = (key: string) => {
    if (typeof window !== 'undefined') {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error(`Error reading localStorage key “${key}”:`, error);
            return null;
        }
    }
    return null;
};

const safeLocalStorageSet = (key: string, value: any) => {
    if (typeof window !== 'undefined') {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error setting localStorage key “${key}”:`, error);
        }
    }
};

// --- Zod Schema for Editable Profile Data ---
const skillLevelSchema = z.record(z.string()).optional().default({});

const profileFormSchema = z.object({
  // These fields come from the 'profile' part of the stored user data
  availability: z.string().optional(),
  technicalSkills: skillLevelSchema,
  softSkills: skillLevelSchema,
  previousExperience: z.string().optional(),
  languages: skillLevelSchema,
  // Add other fields that might be editable later (e.g., contact info if allowed)
  // For now, we focus on the fields added during registration step 3.
});

type ProfileFormData = z.infer<typeof profileFormSchema>;

interface UserProfile {
  userType: 'student';
  fullName: string;
  dni: string;
  universityId: string;
  career: string;
  currentYear: number;
  gpa: number;
  email: string;
  profile: ProfileFormData; // Nested profile data
  // Potentially other Sysacad data if needed for display
  approvedSubjects?: string[];
  regularizedSubjects?: string[];
}

export default function StudentProfilePage() {
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start loading initially
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      availability: '',
      technicalSkills: {},
      softSkills: {},
      previousExperience: '',
      languages: {},
    },
    mode: 'onBlur',
  });

  // --- Load Profile Data ---
  useEffect(() => {
    const loadProfile = () => {
        setIsLoading(true);
        const storedProfile = safeLocalStorageGet('userProfile');
        console.log("Loaded profile from localStorage:", storedProfile); // Debug log
        if (storedProfile && storedProfile.userType === 'student') {
            setUserProfile(storedProfile as UserProfile);
            // Populate form with loaded profile data
            form.reset(storedProfile.profile || {}); // Reset form with the 'profile' part
        } else {
            // Handle case where profile is not found or not a student
            console.warn("No student profile found in localStorage or userType mismatch.");
            // Optionally redirect to login or show an error message
        }
        setIsLoading(false);
    };
    loadProfile();
  }, [form]); // Rerun effect if form instance changes (shouldn't often)

  // --- Handle Form Submission (Save Changes) ---
  async function onSubmit(values: ProfileFormData) {
    if (!userProfile) return;
    setIsLoading(true);
    setErrorMessage(null);
    console.log('Saving profile updates:', values);

    // Simulate saving to backend/localStorage
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
        const updatedProfile: UserProfile = {
          ...userProfile,
          profile: values, // Update the nested profile object
        };

        safeLocalStorageSet('userProfile', updatedProfile);
        setUserProfile(updatedProfile); // Update local state to reflect changes

        toast({
          title: 'Perfil Actualizado',
          description: 'Tus cambios han sido guardados.',
          variant: 'success',
        });
        setIsEditing(false); // Exit editing mode
    } catch (error: any) {
         console.error("Profile update error:", error);
         setErrorMessage(error.message || 'No se pudo guardar el perfil.');
         toast({
             title: 'Error',
             description: 'No se pudieron guardar los cambios.',
             variant: 'destructive',
         });
    } finally {
         setIsLoading(false);
    }
  }

  // --- Render Logic ---
  if (isLoading && !userProfile) { // Show loader only if profile hasn't loaded yet
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex justify-center items-start pt-10">
         <Card className="w-full max-w-lg">
            <CardHeader>
                <CardTitle className="text-center">Perfil no encontrado</CardTitle>
                <CardDescription className="text-center">
                    No pudimos cargar tu perfil. Por favor, intenta iniciar sesión de nuevo.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
                 <Button onClick={() => window.location.href = '/login'}>Ir a Iniciar Sesión</Button>
            </CardContent>
         </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <User /> Mi Perfil de Estudiante
            </CardTitle>
            <CardDescription>
              Visualiza y edita tu información personal y profesional.
            </CardDescription>
          </div>
          {!isEditing && (
            <Button variant="outline" onClick={() => setIsEditing(true)} disabled={isLoading}>
              <Edit className="mr-2" /> Editar Perfil
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-6">

          {/* Display Static Sysacad Data */}
          <section className="space-y-4">
            <h3 className="text-xl font-semibold border-b pb-2 flex items-center gap-2">
              <GraduationCap size={20} /> Datos Académicos (Sysacad)
            </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-muted/50 p-4 rounded-md border">
                <p><strong>Nombre:</strong> {userProfile.fullName}</p>
                <p><strong>Legajo:</strong> {userProfile.universityId}</p>
                <p><strong>DNI:</strong> {userProfile.dni}</p>
                 <p><strong>Carrera:</strong> {userProfile.career}</p>
                 <p><strong>Año:</strong> {userProfile.currentYear}°</p>
                 <p><strong>Promedio:</strong> {userProfile.gpa}</p>
                 <p className="flex items-center gap-1"><Mail size={14}/> {userProfile.email}</p>
                 {/* Optionally display subjects */}
                 {/* <p><strong>Materias Aprobadas:</strong> {userProfile.approvedSubjects?.join(', ') || 'N/A'}</p> */}
             </div>
          </section>

          <Separator />

          {/* Editable Profile Section */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <section className="space-y-6">
                <h3 className="text-xl font-semibold border-b pb-2 flex items-center gap-2">
                  <CalendarCheck size={20} /> Información Adicional
                </h3>

                <FormField
                  control={form.control}
                  name="availability"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Disponibilidad Horaria</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ej: Lunes a Viernes, 4hs diarias por la tarde"
                          {...field}
                          disabled={!isEditing || isLoading}
                          className={!isEditing ? "bg-muted/30 border-dashed" : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="previousExperience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experiencia Previa (Opcional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Proyectos personales, trabajos anteriores, voluntariados..."
                          {...field}
                          disabled={!isEditing || isLoading}
                          className={!isEditing ? "bg-muted/30 border-dashed resize-none" : "resize-none"}
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </section>

              <Separator />

              {/* Skills Sections */}
              <SkillCheckboxGroup
                control={form.control} name="technicalSkills" label="Habilidades Técnicas"
                skills={PREDEFINED_TECHNICAL_SKILLS} levels={PROFICIENCY_LEVELS}
                icon={<CheckSquare size={20} />}
                disabled={!isEditing || isLoading} // Pass disabled state
              />
              <SkillCheckboxGroup
                 control={form.control} name="softSkills" label="Habilidades Blandas"
                 skills={PREDEFINED_SOFT_SKILLS} levels={SOFT_SKILL_LEVELS}
                 icon={<Brain size={20} />}
                 disabled={!isEditing || isLoading} // Pass disabled state
              />
               <SkillCheckboxGroup
                 control={form.control} name="languages" label="Idiomas"
                 skills={PREDEFINED_LANGUAGES} levels={LANGUAGE_LEVELS}
                 icon={<Languages size={20} />}
                 disabled={!isEditing || isLoading} // Pass disabled state
              />


              {/* Action Buttons */}
              {isEditing && (
                <div className="flex justify-end gap-4 pt-6">
                  <Button type="button" variant="outline" onClick={() => {
                      setIsEditing(false);
                      form.reset(userProfile.profile); // Reset form to original profile data
                      setErrorMessage(null); // Clear any previous errors shown during edit
                  }} disabled={isLoading}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 animate-spin" /> : <Save className="mr-2" />}
                    Guardar Cambios
                  </Button>
                </div>
              )}
               {/* Display error message if save fails */}
                {errorMessage && (
                    <Alert variant="destructive" className="mt-4">
                        <AlertTitle>Error al guardar</AlertTitle>
                        <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
