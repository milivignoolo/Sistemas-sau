
'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox'; // Import Checkbox
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// Removed useRouter import as navigation is handled by the parent via onRegisterSuccess
import { Loader2, MailCheck, Info, UserCheck, KeyRound, CheckSquare, Languages, Brain } from 'lucide-react';
import { SkillCheckboxGroup } from './skill-checkbox-group'; // Corrected import path


// --- Predefined Lists ---
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
const LANGUAGE_LEVELS = ['Básico (A1/A2)', 'Intermedio (B1/B2)', 'Avanzado (C1/C2)', 'Nativo'];
const SOFT_SKILL_LEVELS = ['En Desarrollo', 'Desarrollado', 'Fuerte'];

// --- Mock Data Fetching & Verification --- (Keep existing mock functions)
async function fetchSysacadData(universityId: string, dni: string) {
  console.log(`Fetching data for Legajo: ${universityId}, DNI: ${dni}`);
  await new Promise(resolve => setTimeout(resolve, 1500));
  if (universityId === '12345' && dni === '30123456') {
    return {
      fullName: 'Juan Alberto Pérez',
      dni: '30123456',
      universityId: '12345',
      career: 'Ingeniería en Sistemas de Información',
      currentYear: 4,
      gpa: 8.5,
      approvedSubjects: ['Álgebra', 'Análisis I', 'Física I', 'Programación I', 'Química General'],
      regularizedSubjects: ['Análisis II', 'Física II', 'Programación II'],
      email: 'juan.perez.mock@utn.edu.ar',
    };
  } else {
    throw new Error('Estudiante no encontrado en Sysacad.');
  }
}

async function sendVerificationEmail(email: string) {
  console.log(`Sending verification email to: ${email}`);
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log(`Mock verification code sent (simulated): 123456`);
  return true;
}

async function verifyCode(email: string, code: string) {
  console.log(`Verifying code ${code} for email: ${email}`);
  await new Promise(resolve => setTimeout(resolve, 1000));
  if (code === '123456') {
    return true;
  } else {
    throw new Error('Código de verificación incorrecto.');
  }
}

async function createStudentAccount(data: any) {
    console.log('Creating student account with data:', data);
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { success: true, userId: 'mockUserId123' };
}

// --- Zod Schemas ---
const stepOneSchema = z.object({
  universityId: z.string().regex(/^\d+$/, { message: 'El legajo debe contener solo números.' }).min(5, { message: 'El legajo debe tener al menos 5 dígitos.' }),
  dni: z.string().regex(/^\d+$/, { message: 'El DNI debe contener solo números.' }).min(7, { message: 'El DNI debe tener al menos 7 dígitos.' }),
});

const stepTwoSchema = z.object({
  verificationCode: z.string().length(6, { message: 'El código debe tener 6 dígitos.' }),
});

// Updated Step Three Schema
const skillLevelSchema = z.record(z.string()).optional().default({}); // { skillId: level }

const stepThreeSchema = z.object({
  availability: z.string().optional(),
  technicalSkills: skillLevelSchema,
  softSkills: skillLevelSchema,
  previousExperience: z.string().optional(),
  languages: skillLevelSchema,
});

const stepFourSchema = z.object({
  password: z.string().min(8, { message: 'La contraseña debe tener al menos 8 caracteres.' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden.',
  path: ['confirmPassword'],
});

// --- Component Logic ---
type Step = 'initial' | 'verify' | 'profile' | 'password' | 'complete' | 'error';

interface SysacadStudentData {
    fullName: string;
    dni: string;
    universityId: string;
    career: string;
    currentYear: number;
    gpa: number;
    approvedSubjects: string[];
    regularizedSubjects: string[];
    email: string;
}

// Define props for the component, including the callback
interface StudentRegistrationFormProps {
  onRegisterSuccess: () => void;
}

export function StudentRegistrationForm({ onRegisterSuccess }: StudentRegistrationFormProps) {
  const { toast } = useToast();
  // Removed router instance
  const [step, setStep] = useState<Step>('initial');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [studentData, setStudentData] = useState<SysacadStudentData | null>(null);
  const [profileData, setProfileData] = useState<z.infer<typeof stepThreeSchema> | null>(null);


  // Determine the current schema based on the step
  const getCurrentSchema = () => {
    switch (step) {
      case 'initial': return stepOneSchema;
      case 'verify': return stepTwoSchema;
      case 'profile': return stepThreeSchema;
      case 'password': return stepFourSchema;
      default: return z.object({}); // Return empty schema for steps without a form schema
    }
  };

  const form = useForm<any>({
    resolver: zodResolver(getCurrentSchema()), // Initialize with the first step's schema
    defaultValues: {
      universityId: '',
      dni: '',
      verificationCode: '',
      availability: '',
      technicalSkills: {}, // Initialize as empty object
      softSkills: {},     // Initialize as empty object
      previousExperience: '',
      languages: {},      // Initialize as empty object
      password: '',
      confirmPassword: '',
    },
    mode: 'onBlur', // Changed mode to onBlur for potentially better performance
    reValidateMode: 'onChange',
  });

   // Define submit handlers for each step (Keep existing handlers)
  const handleStepOneSubmit = async (values: z.infer<typeof stepOneSchema>) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await fetchSysacadData(values.universityId, values.dni);
      setStudentData(data);
      await sendVerificationEmail(data.email);
      toast({ title: 'Verifica tu Correo', description: `Se envió un código de verificación a ${data.email}. (Mock: 123456)` });
      setStep('verify');
    } catch (error: any) {
      setErrorMessage(error.message || 'Ocurrió un error.');
      // Set error on relevant fields if possible
       if (error.message.includes('Sysacad')) {
           form.setError("universityId", { type: "manual", message: error.message });
           form.setError("dni", { type: "manual", message: error.message });
        }
    } finally {
      setIsLoading(false);
    }
  };

  const handleStepTwoSubmit = async (values: z.infer<typeof stepTwoSchema>) => {
     if (!studentData) return;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await verifyCode(studentData.email, values.verificationCode);
      toast({ title: 'Correo Verificado', description: 'Tu identidad ha sido verificada.', variant: 'default' });
      setStep('profile');
    } catch (error: any) {
      setErrorMessage(error.message || 'Ocurrió un error.');
       form.setError("verificationCode", { type: "manual", message: error.message || 'Código incorrecto.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStepThreeSubmit = async (values: z.infer<typeof stepThreeSchema>) => {
    setProfileData(values);
    setStep('password');
  };

  const handleStepFourSubmit = async (values: z.infer<typeof stepFourSchema>) => {
     if (!studentData || !profileData) return;
     setIsLoading(true);
     setErrorMessage(null);
     try {
        const finalUserData = {
            ...studentData,
            profile: profileData, // Nest profile data
            password: values.password,
            username: studentData.universityId,
        };
        await createStudentAccount(finalUserData);
        toast({ title: '¡Registro Completo!', description: `Bienvenido/a, ${studentData.fullName}. Ya puedes iniciar sesión.` });
        setStep('complete'); // Move to complete state
        onRegisterSuccess(); // Call the success callback
     } catch (error: any) {
        setErrorMessage(error.message || 'No se pudo crear la cuenta.');
        setStep('error')
     } finally {
        setIsLoading(false);
     }
  };

  // Main submit handler
 const onSubmit = async (values: any) => {
    // Prevent submission if already completed or in error state
    if (step === 'complete' || step === 'error') {
        console.log('Submission blocked, current step:', step);
        return;
    }

    const currentSchema = getCurrentSchema();
    if (!currentSchema || typeof currentSchema.shape !== 'object' || currentSchema.shape === null) {
        console.error('Invalid schema for current step:', step);
        toast({
            title: 'Error Interno',
            description: 'No se pudo determinar la validación para este paso.',
            variant: 'destructive',
        });
        return;
    }

    // Use trigger to manually validate based on current schema's fields
    const fieldsToValidate = Object.keys(currentSchema.shape) as (keyof typeof values)[];
    const isValid = await form.trigger(fieldsToValidate);


    if (!isValid) {
        console.error("Validation failed:", form.formState.errors);
         // Find the first error message to display
         const errors = form.formState.errors;
         const firstErrorField = fieldsToValidate?.find(field => errors[field]);
         const firstErrorMessage = firstErrorField ? errors[firstErrorField]?.message : 'Por favor, corrige los errores marcados.';

         toast({
             title: 'Error de Validación',
             description: typeof firstErrorMessage === 'string' ? firstErrorMessage : 'Por favor, revisa el formulario.',
             variant: 'destructive',
         });
        return;
    }

    // Parse validated values using the current schema
    // Use getValues() to ensure we have the latest form state after trigger
    const validationResult = currentSchema.safeParse(form.getValues());
     if (!validationResult.success) {
        // This should theoretically not happen if trigger passed, but good safety check
        console.error("Schema parsing failed after trigger passed:", validationResult.error.flatten().fieldErrors);
        toast({
             title: 'Error de Datos',
             description: 'Hubo un problema con los datos ingresados.',
             variant: 'destructive',
         });
        return;
    }

    const validatedValues = validationResult.data;


    switch (step) {
      case 'initial': await handleStepOneSubmit(validatedValues as z.infer<typeof stepOneSchema>); break;
      case 'verify': await handleStepTwoSubmit(validatedValues as z.infer<typeof stepTwoSchema>); break;
      case 'profile': await handleStepThreeSubmit(validatedValues as z.infer<typeof stepThreeSchema>); break;
      case 'password': await handleStepFourSubmit(validatedValues as z.infer<typeof stepFourSchema>); break;
      default: console.log('Unhandled step:', step);
    }
  };

   // Update resolver when step changes
   React.useEffect(() => {
    const currentSchema = getCurrentSchema();
    // @ts-ignore - Dynamically updating resolver
    form.resolver = zodResolver(currentSchema);
    // Trigger validation after a short delay to ensure state is updated
    // Only trigger validation if there's a schema for the current step
    if (currentSchema && currentSchema.shape) { // Check if shape exists
        setTimeout(() => form.trigger(), 50);
    }
  }, [step, form]);


  return (
    <Form {...form}>
      {/* Pass the onSubmit handler directly */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        {errorMessage && step !== 'error' && ( // Show error inline unless in final error step
          <Alert variant="destructive">
             <Info className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {/* Step 1: Initial Input */}
        {step === 'initial' && (
          <>
             <FormField
              control={form.control}
              name="universityId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Legajo Universitario</FormLabel>
                  <FormControl>
                    <Input placeholder="12345" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="dni"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de DNI</FormLabel>
                  <FormControl>
                    <Input placeholder="30123456" {...field} disabled={isLoading} />
                  </FormControl>
                   <FormDescription>Ingresa tu DNI sin puntos.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
             <Button type="submit" className="w-full" disabled={isLoading}>
               {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserCheck className="mr-2 h-4 w-4" />}
               Verificar Datos en Sysacad
            </Button>
          </>
        )}

        {/* Step 2: Verify Email */}
        {step === 'verify' && studentData && (
          <>
            <Alert variant="default" className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
              <Info className="h-4 w-4 text-blue-700 dark:text-blue-300" />
              <AlertTitle className="text-blue-800 dark:text-blue-200">Verificación Requerida</AlertTitle>
              <AlertDescription className="text-blue-700 dark:text-blue-300">
                Se ha enviado un código de verificación a tu correo electrónico institucional: <strong>{studentData.email}</strong>. Por favor, ingrésalo a continuación. (Mock: Usa 123456)
              </AlertDescription>
            </Alert>
            <FormField
              control={form.control}
              name="verificationCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código de Verificación</FormLabel>
                  <FormControl>
                    <Input placeholder="******" {...field} disabled={isLoading} maxLength={6} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Use type="submit" for the button within the form */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MailCheck className="mr-2 h-4 w-4"/>}
              Verificar Código
            </Button>
             <Button type="button" variant="link" size="sm" onClick={() => setStep('initial')} disabled={isLoading} className="w-full mt-2 text-muted-foreground">
                Volver e ingresar Legajo/DNI
            </Button>
             {/* TODO: Add resend code functionality */}
             {/* <Button variant="link" size="sm" disabled={isLoading} className="w-full mt-1 text-primary">
                Reenviar Código
             </Button> */}
          </>
        )}

        {/* Step 3: Profile Details - Updated */}
        {step === 'profile' && studentData && (
          <>
            <h3 className="text-lg font-semibold border-b pb-2 mb-4">Completa tu Perfil</h3>
             <Alert variant="default" className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800 mb-4">
                 <UserCheck className="h-4 w-4 text-green-700 dark:text-green-300" />
                <AlertTitle className="text-green-800 dark:text-green-200">Datos de Sysacad</AlertTitle>
                <AlertDescription className="text-green-700 dark:text-green-300 text-xs space-y-1">
                   <p><strong>Nombre:</strong> {studentData.fullName}</p>
                   <p><strong>Carrera:</strong> {studentData.career} ({studentData.currentYear}° año)</p>
                   <p><strong>Promedio:</strong> {studentData.gpa}</p>
                   <p><strong>Email:</strong> {studentData.email}</p>
                 </AlertDescription>
            </Alert>

            <FormField
              control={form.control}
              name="availability"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Disponibilidad Horaria</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Lunes a Viernes, 4hs diarias por la tarde" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Technical Skills Checkboxes */}
            <SkillCheckboxGroup
                control={form.control}
                name="technicalSkills"
                label="Habilidades Técnicas"
                skills={PREDEFINED_TECHNICAL_SKILLS}
                levels={PROFICIENCY_LEVELS}
                icon={<CheckSquare size={20} />}
            />

            {/* Soft Skills Checkboxes */}
             <SkillCheckboxGroup
                control={form.control}
                name="softSkills"
                label="Habilidades Blandas"
                skills={PREDEFINED_SOFT_SKILLS}
                levels={SOFT_SKILL_LEVELS}
                icon={<Brain size={20} />}
            />

             {/* Languages Checkboxes */}
             <SkillCheckboxGroup
                control={form.control}
                name="languages"
                label="Idiomas"
                skills={PREDEFINED_LANGUAGES}
                levels={LANGUAGE_LEVELS}
                icon={<Languages size={20} />}
            />


            <FormField
              control={form.control}
              name="previousExperience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experiencia Previa (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe brevemente proyectos personales, trabajos anteriores o voluntariados relevantes." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Use type="submit" for the button within the form */}
            <Button type="submit" className="w-full">
              Continuar a Crear Contraseña
            </Button>
             <Button type="button" variant="link" size="sm" onClick={() => setStep('verify')} className="w-full mt-2 text-muted-foreground">
                Volver a Verificar Correo
            </Button>
          </>
        )}

        {/* Step 4: Set Password */}
        {step === 'password' && studentData && (
          <>
            <h3 className="text-lg font-semibold border-b pb-2 mb-4">Crear Contraseña</h3>
             <Alert variant="default" className="mb-4">
              <KeyRound className="h-4 w-4" />
              <AlertTitle>Último Paso</AlertTitle>
              <AlertDescription>
                Crea una contraseña segura para tu cuenta. Tu nombre de usuario será tu número de legajo: <strong>{studentData.universityId}</strong>.
              </AlertDescription>
            </Alert>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Use type="submit" for the button within the form */}
            <Button type="submit" className="w-full" disabled={isLoading}>
               {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserCheck className="mr-2 h-4 w-4" />}
              Completar Registro
            </Button>
            <Button type="button" variant="link" size="sm" onClick={() => setStep('profile')} disabled={isLoading} className="w-full mt-2 text-muted-foreground">
                Volver a Editar Perfil
            </Button>
          </>
        )}

         {/* Step 5: Complete */}
         {step === 'complete' && studentData && (
             <Alert variant="success">
                 <CheckSquare className="h-4 w-4"/>
                <AlertTitle>¡Registro Exitoso!</AlertTitle>
                <AlertDescription>
                    La cuenta para <strong>{studentData.fullName}</strong> ha sido creada. El nombre de usuario es tu legajo: <strong>{studentData.universityId}</strong>.
                     Ahora serás redirigido/a a tu perfil.
                 </AlertDescription>
             </Alert>
         )}

         {/* Final Error State */}
         {step === 'error' && errorMessage && (
              <Alert variant="destructive">
                 <Info className="h-4 w-4" />
                 <AlertTitle>Error en el Registro</AlertTitle>
                 <AlertDescription>
                     {errorMessage}
                     <br />
                     Por favor, revisa los datos e inténtalo de nuevo.
                 </AlertDescription>
                  <Button type="button" variant="outline" size="sm" onClick={() => { setStep('initial'); setErrorMessage(null); form.reset(); }} className="mt-4">
                    Volver al Inicio del Registro
                 </Button>
             </Alert>
         )}

      </form>
    </Form>
  );
}
