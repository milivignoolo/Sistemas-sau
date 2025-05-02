
'use client';

import * as React from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker'; // Import DatePicker
import { useToast } from '@/hooks/use-toast';
import { Briefcase, Clock, Hash, CalendarDays, ListChecks, UserCheck, AlertTriangle, CheckSquare, Brain, Languages } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { SkillCheckboxGroup } from '@/components/auth/skill-checkbox-group'; // Import the reusable component


// --- Predefined Lists (Similar to student registration) ---
const PREDEFINED_TECHNICAL_SKILLS = [
    { id: 'javascript', name: 'JavaScript' },
    { id: 'typescript', name: 'TypeScript' },
    { id: 'react', name: 'React' },
    { id: 'nextjs', name: 'Next.js' },
    { id: 'nodejs', name: 'Node.js' },
    { id: 'python', name: 'Python' },
    { id: 'java', name: 'Java' },
    { id: 'csharp', name: 'C#' },
    { id: 'sql', name: 'SQL' },
    { id: 'nosql', name: 'NoSQL (MongoDB, etc.)' },
    { id: 'git', name: 'Git' },
    { id: 'docker', name: 'Docker' },
    { id: 'cloud', name: 'Cloud (AWS/GCP/Azure)' },
    { id: 'html_css', name: 'HTML/CSS' },
    // Add more relevant skills
];

const PREDEFINED_SOFT_SKILLS = [
    { id: 'teamwork', name: 'Trabajo en Equipo' },
    { id: 'communication', name: 'Comunicación Efectiva' },
    { id: 'problem_solving', name: 'Resolución de Problemas' },
    { id: 'adaptability', name: 'Adaptabilidad' },
    { id: 'proactivity', name: 'Proactividad' },
    { id: 'learning', name: 'Ganas de Aprender' },
    { id: 'leadership', name: 'Liderazgo' },
    { id: 'critical_thinking', name: 'Pensamiento Crítico' },
];

const PREDEFINED_LANGUAGES = [
    { id: 'english', name: 'Inglés' },
    { id: 'portuguese', name: 'Portugués' },
    { id: 'french', name: 'Francés' },
    { id: 'german', name: 'Alemán' },
    { id: 'italian', name: 'Italiano' },
];

const PROFICIENCY_LEVELS = ['Básico', 'Intermedio', 'Avanzado'];
const SOFT_SKILL_LEVELS = ['En Desarrollo', 'Desarrollado', 'Fuerte']; // Or ['Deseable', 'Requerido'] ? Let's use levels for now
const LANGUAGE_LEVELS = ['Básico (A1/A2)', 'Intermedio (B1/B2)', 'Avanzado (C1/C2)', 'Nativo'];


// Define Zod schema with all fields
const skillLevelSchema = z.record(z.string()).optional().default({}); // { skillId: level }

const formSchema = z.object({
  // Internship Details
  title: z.string().min(5, { message: 'El título debe tener al menos 5 caracteres.' }),
  description: z.string().min(20, { message: 'La descripción debe tener al menos 20 caracteres.' }),
  area: z.string().min(1, { message: 'Debes seleccionar un área.' }),
  numberOfVacancies: z.string().regex(/^\d+$/, { message: "Debe ser un número positivo."}).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  compensation: z.string().optional(), // e.g., "Remunerada", "No remunerada", "$XXXX ARS"
  isRemote: z.boolean().default(false),
  location: z.string().min(3, { message: 'La ubicación es requerida.' }),
  duration: z.string().optional(), // e.g., "3 meses", "6 meses"
  weeklyHours: z.string().regex(/^\d+$/, { message: "Debe ser un número positivo."}).optional(),
  estimatedSchedule: z.string().optional(), // e.g., "Lunes a Viernes 9-13hs"
  tasks: z.string().min(10, { message: 'Describe las tareas principales (al menos 10 caracteres).' }),

  // Requirements
  career: z.string().min(1, { message: 'Debes seleccionar una carrera objetivo.' }),
  requiredYear: z.string().optional(), // Using string for Select value
  technicalSkillsRequired: skillLevelSchema,
  softSkillsRequired: skillLevelSchema,
  languagesRequired: skillLevelSchema,
  // Removed old 'requirements' text area in favor of structured skills

  // Urgency & Status
  urgencyLevel: z.enum(['1', '2', '3'], { required_error: 'Debes seleccionar un nivel de urgencia.' }),
  // status: z.enum(['pending', 'approved', 'rejected']).default('pending') // Status managed by backend
}).refine(data => {
    // Optional: Validate end date is after start date if both are provided
    if (data.startDate && data.endDate) {
        return data.endDate >= data.startDate;
    }
    return true;
 }, {
    message: "La fecha de fin no puede ser anterior a la fecha de inicio.",
    path: ["endDate"],
 });


// Mock data - replace with actual data fetching if needed
const careers = [
  { id: 'sistemas', name: 'Ingeniería en Sistemas de Información' },
  { id: 'quimica', name: 'Ingeniería Química' },
  { id: 'mecanica', name: 'Ingeniería Mecánica' },
  { id: 'electrica', name: 'Ingeniería Eléctrica' },
  { id: 'civil', name: 'Ingeniería Civil' },
  { id: 'industrial', name: 'Ingeniería Industrial' },
  { id: 'todas', name: 'Varias / Todas' }, // Option for multiple careers
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
const yearOptions = ['1', '2', '3', '4', '5', 'Graduado Reciente'];


export default function PostInternshipPage() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // Internship Details
      title: '',
      description: '',
      area: '',
      numberOfVacancies: '',
      startDate: undefined,
      endDate: undefined,
      compensation: '',
      isRemote: false,
      location: '',
      duration: '',
      weeklyHours: '',
      estimatedSchedule: '',
      tasks: '',
      // Requirements
      career: '',
      requiredYear: '',
      technicalSkillsRequired: {},
      softSkillsRequired: {},
      languagesRequired: {},
      // Urgency
      urgencyLevel: undefined,
    },
    mode: 'onBlur', // Validate on blur
  });

   // Define submit handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // TODO: Implement actual internship posting logic (e.g., API call)
    // Assume authentication context provides company ID
    console.log('New Internship Data (Pending Verification):', values);

    // Simulate API call to backend to save data with 'pending' status
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

    toast({
      title: 'Pasantía Enviada para Verificación',
      description: 'La oferta de pasantía ha sido enviada y está pendiente de revisión por la SAU. Recibirás una notificación cuando sea aprobada.',
      variant: 'info' // Use info variant for pending status
    });

    // Optionally reset the form or redirect
    form.reset();
    // router.push('/company/dashboard'); // Example redirect
  }

  return (
    <div className="max-w-4xl mx-auto">
       <Card>
        <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
                <Briefcase /> Publicar Nueva Pasantía
            </CardTitle>
            <CardDescription>
                Completa los detalles de la oferta de pasantía. Será revisada por la SAU antes de publicarse.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                 {/* Internship Details Section */}
                <section className="space-y-6">
                    <h3 className="text-xl font-semibold border-b pb-2 mb-4 flex items-center gap-2">
                        <Briefcase size={20}/> Detalles de la Pasantía
                    </h3>
                    <FormField control={form.control} name="title" render={({ field }) => ( <FormItem> <FormLabel>Título de la Pasantía *</FormLabel> <FormControl><Input placeholder="Ej: Pasantía en Desarrollo Frontend" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="description" render={({ field }) => ( <FormItem> <FormLabel>Descripción Detallada *</FormLabel> <FormControl><Textarea placeholder="Describe las responsabilidades generales, el equipo, la cultura de la empresa, etc." rows={4} {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="tasks" render={({ field }) => ( <FormItem> <FormLabel>Tareas Principales *</FormLabel> <FormControl><Textarea placeholder="Enumera las tareas específicas que realizará el pasante." rows={4} {...field} /></FormControl><FormDescription>Listar las tareas ayuda a los estudiantes a entender mejor el rol.</FormDescription> <FormMessage /> </FormItem> )}/>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <FormField control={form.control} name="area" render={({ field }) => ( <FormItem> <FormLabel>Área de la Pasantía *</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl><SelectTrigger><SelectValue placeholder="Selecciona el área" /></SelectTrigger></FormControl> <SelectContent> {areas.map((area) => (<SelectItem key={area.id} value={area.id}>{area.name}</SelectItem>))} </SelectContent> </Select> <FormMessage /> </FormItem> )}/>
                         <FormField control={form.control} name="numberOfVacancies" render={({ field }) => ( <FormItem> <FormLabel>Cantidad de Vacantes</FormLabel> <FormControl><Input type="number" placeholder="Ej: 2" {...field} min="1" /></FormControl> <FormMessage /> </FormItem> )}/>
                     </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <FormField control={form.control} name="startDate" render={({ field }) => ( <FormItem className="flex flex-col"> <FormLabel>Fecha de Inicio (Opcional)</FormLabel> <DatePicker value={field.value} onSelect={field.onChange} placeholder="Inicio estimado"/> <FormMessage /> </FormItem> )}/>
                         <FormField control={form.control} name="endDate" render={({ field }) => ( <FormItem className="flex flex-col"> <FormLabel>Fecha de Fin (Opcional)</FormLabel> <DatePicker value={field.value} onSelect={field.onChange} placeholder="Fin estimado" disabled={(date) => form.getValues("startDate") ? date < form.getValues("startDate")! : false}/> <FormMessage /> </FormItem> )}/>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <FormField control={form.control} name="compensation" render={({ field }) => ( <FormItem> <FormLabel>Compensación</FormLabel> <FormControl><Input placeholder="Ej: Remunerada, $150.000 ARS, No Remunerada" {...field} /></FormControl><FormDescription>Indica si es remunerada y el monto/tipo.</FormDescription> <FormMessage /> </FormItem> )}/>
                        <FormField control={form.control} name="duration" render={({ field }) => ( <FormItem> <FormLabel>Duración</FormLabel> <FormControl><Input placeholder="Ej: 3 meses, 6 meses" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                    </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <FormField control={form.control} name="weeklyHours" render={({ field }) => ( <FormItem> <FormLabel>Horas Semanales</FormLabel> <FormControl><Input type="number" placeholder="Ej: 20" {...field} min="1" /></FormControl> <FormMessage /> </FormItem> )}/>
                         <FormField control={form.control} name="estimatedSchedule" render={({ field }) => ( <FormItem> <FormLabel>Horarios Estimados</FormLabel> <FormControl><Input placeholder="Ej: L-V 9 a 13hs / Flexible" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                        <FormField control={form.control} name="location" render={({ field }) => ( <FormItem> <FormLabel>Ubicación *</FormLabel> <FormControl><Input placeholder="Ej: Resistencia, Chaco / Híbrido (Oficina/Remoto)" {...field} disabled={form.watch('isRemote')} /></FormControl> <FormMessage /> </FormItem> )}/>
                        <FormField control={form.control} name="isRemote" render={({ field }) => ( <FormItem className="flex flex-row items-end space-x-3 space-y-0 pb-2"> <FormControl> <Checkbox checked={field.value} onCheckedChange={(checked) => { field.onChange(checked); if (checked) { form.setValue('location', 'Remoto'); } }}/> </FormControl> <div className="space-y-1 leading-none"><FormLabel>Es 100% Remota</FormLabel></div> </FormItem> )}/>
                    </div>
                </section>

                <Separator />

                {/* Requirements Section */}
                <section className="space-y-6">
                     <h3 className="text-xl font-semibold border-b pb-2 mb-4 flex items-center gap-2">
                        <ListChecks size={20} /> Requisitos para Postulantes
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <FormField control={form.control} name="career" render={({ field }) => ( <FormItem> <FormLabel>Carrera Objetivo *</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl><SelectTrigger><SelectValue placeholder="Selecciona la carrera" /></SelectTrigger></FormControl> <SelectContent> {careers.map((career) => (<SelectItem key={career.id} value={career.id}>{career.name}</SelectItem>))} </SelectContent> </Select> <FormMessage /> </FormItem> )}/>
                         <FormField control={form.control} name="requiredYear" render={({ field }) => ( <FormItem> <FormLabel>Año de Cursado (Mínimo)</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl><SelectTrigger><SelectValue placeholder="Cualquier año" /></SelectTrigger></FormControl> <SelectContent> <SelectItem value="">Cualquier año</SelectItem> {yearOptions.map((year) => (<SelectItem key={year} value={year}>{year}° Año</SelectItem>))} </SelectContent> </Select> <FormMessage /> </FormItem> )}/>
                    </div>

                    {/* Technical Skills Checkboxes */}
                    <SkillCheckboxGroup
                        control={form.control}
                        name="technicalSkillsRequired"
                        label="Habilidades Técnicas Requeridas"
                        skills={PREDEFINED_TECHNICAL_SKILLS}
                        levels={PROFICIENCY_LEVELS}
                        icon={<CheckSquare size={20} />}
                        description="Selecciona las habilidades técnicas y el nivel mínimo deseado."
                    />

                    {/* Soft Skills Checkboxes */}
                    <SkillCheckboxGroup
                        control={form.control}
                        name="softSkillsRequired"
                        label="Habilidades Blandas Requeridas"
                        skills={PREDEFINED_SOFT_SKILLS}
                        levels={SOFT_SKILL_LEVELS}
                        icon={<Brain size={20} />}
                         description="Selecciona las habilidades blandas deseadas o requeridas."
                    />

                    {/* Languages Checkboxes */}
                    <SkillCheckboxGroup
                        control={form.control}
                        name="languagesRequired"
                        label="Idiomas Requeridos"
                        skills={PREDEFINED_LANGUAGES}
                        levels={LANGUAGE_LEVELS}
                        icon={<Languages size={20} />}
                         description="Selecciona los idiomas y el nivel mínimo requerido."
                    />
                    {/* TODO: Add 'mandatory' checkbox per skill category or per skill? For now, level implies requirement */}
                </section>

                <Separator />

                 {/* Urgency Level Section */}
                <section className="space-y-4">
                    <h3 className="text-xl font-semibold border-b pb-2 mb-4 flex items-center gap-2">
                        <AlertTriangle size={20} /> Nivel de Urgencia *
                    </h3>
                     <FormField
                        control={form.control}
                        name="urgencyLevel"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                            <FormLabel>¿Con qué urgencia necesitas cubrir esta pasantía?</FormLabel>
                            <FormControl>
                                <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6"
                                >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                    <RadioGroupItem value="1" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                    Baja (Revisión en ~15 días hábiles)
                                    </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                    <RadioGroupItem value="2" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                    Media (Revisión en ~5 días hábiles)
                                    </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                    <RadioGroupItem value="3" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                     Alta (Revisión en ~2 días hábiles)
                                    </FormLabel>
                                </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                </section>

                <Separator />

                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Enviando...' : 'Enviar Pasantía para Verificación'}
                </Button>
              </form>
            </Form>
         </CardContent>
       </Card>
    </div>
  );
}
