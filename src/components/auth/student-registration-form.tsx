
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
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react'; // Import useEffect
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// Removed useRouter import as navigation is handled by the parent via onRegisterSuccess
import { Loader2, MailCheck, Info, UserCheck, KeyRound, CheckSquare, Languages, Brain } from 'lucide-react';
import { SkillCheckboxGroup } from './skill-checkbox-group';
import { cn } from '@/lib/utils';


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

// --- Mock Data Fetching & Verification ---
// Function to safely interact with localStorage
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

const safeLocalStorageRemove = (key: string) => {
    if (typeof window !== 'undefined') {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`Error removing localStorage key “${key}”:`, error);
        }
    }
};

async function fetchSysacadData(universityId: string, dni: string): Promise<SysacadStudentData> {
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
  // Store the mock code for verification step
  safeLocalStorageSet('studentVerificationCode', '123456');
  return true;
}

async function verifyCode(email: string, code: string) {
  console.log(`Verifying code ${code} for email: ${email}`);
  const storedCode = safeLocalStorageGet('studentVerificationCode');
  await new Promise(resolve => setTimeout(resolve, 1000));
  if (code === storedCode && storedCode !== null) { // Ensure storedCode is not null
    safeLocalStorageRemove('studentVerificationCode'); // Remove code after successful verification
    return true;
  } else {
    throw new Error('Código de verificación incorrecto.');
  }
}

async function createStudentAccount(data: any) {
    console.log('Simulating saving student account with data:', data);
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Simulate saving the final combined profile to localStorage
    safeLocalStorageSet('userProfile', { ...data, userType: 'student' });
    // Clear temporary registration data
    safeLocalStorageRemove('studentRegData');
    safeLocalStorageRemove('studentProfileData');
    return { success: true, userId: data.universityId }; // Use universityId as mock userId
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

// Combine all possible form data types
type StudentFormData = z.infer<typeof stepOneSchema> &
                       Partial<z.infer<typeof stepTwoSchema>> &
                       Partial<z.infer<typeof stepThreeSchema>> &
                       Partial<z.infer<typeof stepFourSchema>>;


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
  const [step, setStep] = useState<Step>('initial');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  // Store sysacad data temporarily in component state instead of localStorage for pre-filling verify step
  const [tempStudentData, setTempStudentData] = useState<SysacadStudentData | null>(null);
  // Store profile data temporarily in component state
  const [tempProfileData, setTempProfileData] = useState<z.infer<typeof stepThreeSchema> | null>(null);


  // Determine the current schema based on the step
  const getCurrentSchema = () => {
    switch (step) {
      case 'initial': return stepOneSchema;
      case 'verify': return stepTwoSchema;
      case 'profile': return stepThreeSchema;
      case 'password': return stepFourSchema;
      default: return z.object({}); // Empty schema for non-form steps
    }
  };

   // Define submit handlers for each step
  const handleStepOneSubmit = async (values: z.infer<typeof stepOneSchema>) => {
    setIsLoading(true);
    setErrorMessage(null);
    // setHasAttemptedSubmit(true); // Set attempt flag on handler start
    try {
      const data = await fetchSysacadData(values.universityId, values.dni);
      // Store data temporarily in component state
      setTempStudentData(data);
      await sendVerificationEmail(data.email);
      toast({ title: 'Verifica tu Correo', description: `Se envió un código de verificación a ${data.email}. (Mock: 123456)` });
      setStep('verify');
      setHasAttemptedSubmit(false); // Reset submit attempt flag for the next step
    } catch (error: any) {
      setErrorMessage(error.message || 'Ocurrió un error.');
       setHasAttemptedSubmit(true); // Set attempt flag on error
       if (error.message.includes('Sysacad')) {
           form.setError("universityId", { type: "manual", message: error.message });
           form.setError("dni", { type: "manual", message: error.message });
        }
    } finally {
      setIsLoading(false);
    }
  };

  const handleStepTwoSubmit = async (values: z.infer<typeof stepTwoSchema>) => {
     // const studentData = safeLocalStorageGet('studentRegData'); // Use temp state instead
     if (!tempStudentData) {
        console.error("Verification step reached without initial data.");
        setErrorMessage("Error interno: Faltan datos de Sysacad. Por favor, reinicia el registro.");
        setStep('error');
        return;
     }
    setIsLoading(true);
    setErrorMessage(null);
    // setHasAttemptedSubmit(true); // Set attempt flag on handler start
    try {
      await verifyCode(tempStudentData.email, values.verificationCode);
      toast({ title: 'Correo Verificado', description: 'Tu identidad ha sido verificada.', variant: 'default' });
      setStep('profile');
      setHasAttemptedSubmit(false); // Reset submit attempt flag
    } catch (error: any) {
      setErrorMessage(error.message || 'Ocurrió un error.');
       setHasAttemptedSubmit(true); // Set attempt flag on error
       form.setError("verificationCode", { type: "manual", message: error.message || 'Código incorrecto.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStepThreeSubmit = async (values: z.infer<typeof stepThreeSchema>) => {
    // Store profile data temporarily
    setTempProfileData(values);
    setStep('password');
    setHasAttemptedSubmit(false); // Reset submit attempt flag
  };

  const handleStepFourSubmit = async (values: z.infer<typeof stepFourSchema>) => {
     // const studentData = safeLocalStorageGet('studentRegData'); // Use temp state
     // const profileData = safeLocalStorageGet('studentProfileData'); // Use temp state

     if (!tempStudentData || !tempProfileData) {
        console.error("Password step reached without initial or profile data.");
        setErrorMessage("Error interno: Faltan datos para crear la cuenta. Por favor, reinicia el registro.");
        setStep('error');
        return;
     }
     setIsLoading(true);
     setErrorMessage(null);
     // setHasAttemptedSubmit(true); // Set attempt flag on handler start
     try {
        const finalUserData = {
            ...tempStudentData, // Data from Sysacad (step 1)
            profile: tempProfileData, // Data from profile form (step 3)
            password: values.password, // Password from current step (step 4) - HASH SERVER-SIDE
            username: tempStudentData.universityId, // Username is the university ID
        };
        await createStudentAccount(finalUserData); // This saves to localStorage['userProfile']
        toast({ title: '¡Registro Completo!', description: `Bienvenido/a, ${tempStudentData.fullName}. Ya puedes iniciar sesión.` });
        setStep('complete');
        onRegisterSuccess(); // Callback to parent to handle redirect
     } catch (error: any) {
        setErrorMessage(error.message || 'No se pudo crear la cuenta.');
         setHasAttemptedSubmit(true); // Set attempt flag on error
        setStep('error');
     } finally {
        setIsLoading(false);
     }
  };

  // Main submit handler - uses react-hook-form's handleSubmit
  const onSubmit = async (values: StudentFormData) => {
     // Prevent submission if already completed or in error state
     if (step === 'complete' || step === 'error' || isLoading) {
         console.log('Submission blocked, current step:', step, 'isLoading:', isLoading);
         return;
     }

     // Reset error message for the current step attempt
     setErrorMessage(null);
     setHasAttemptedSubmit(true); // Mark attempt for UI feedback

     switch (step) {
        case 'initial': await handleStepOneSubmit(values as z.infer<typeof stepOneSchema>); break;
        case 'verify': await handleStepTwoSubmit(values as z.infer<typeof stepTwoSchema>); break;
        case 'profile': await handleStepThreeSubmit(values as z.infer<typeof stepThreeSchema>); break;
        case 'password': await handleStepFourSubmit(values as z.infer<typeof stepFourSchema>); break;
        default: console.log('Unhandled step in onSubmit:', step);
     }
   };

   // Error handler for react-hook-form's handleSubmit
   const onFormError = (errors: any) => {
       console.error("Form validation failed:", errors);
       setHasAttemptedSubmit(true); // Ensure error messages are shown

       // Find the first error message to display in toast
       const firstErrorField = Object.keys(errors)[0];
       const firstErrorMessage = firstErrorField ? errors[firstErrorField]?.message : 'Por favor, corrige los errores marcados.';

       toast({
           title: 'Error de Validación',
           description: typeof firstErrorMessage === 'string' ? firstErrorMessage : 'Error desconocido.',
           variant: 'destructive',
       });
   };


   // Update resolver when step changes
   useEffect(() => {
    const currentSchema = getCurrentSchema();
    // @ts-ignore - Dynamically updating resolver
    form.resolver = zodResolver(currentSchema);

    // Reset form fields relevant to the *next* step, keep others for potential back navigation?
    // NO - Always reset to default empty state when step changes
    form.reset({ // Reset to defaults matching StudentFormData structure
      universityId: '',
      dni: '',
      verificationCode: '',
      availability: '',
      technicalSkills: {},
      softSkills: {},
      previousExperience: '',
      languages: {},
      password: '',
      confirmPassword: '',
    }, { keepErrors: false, keepDirty: false, keepValues: false }); // Ensure full reset


    setHasAttemptedSubmit(false); // Reset submit attempt flag when step changes
    setErrorMessage(null); // Clear global error message when step changes

  }, [step, form]);


  // Helper to get student data for display
  const studentDataForDisplay = tempStudentData; // Use component state


  return (
    <Form {...form}>
      {/* Use react-hook-form's handleSubmit to handle validation */}
      <form onSubmit={form.handleSubmit(onSubmit, onFormError)} className="space-y-6">

        {/* Show global error message only if it exists AND an attempt was made */}
        {/* Let individual field errors handle validation, use this for API errors */}
        {errorMessage && ( // Simplified: Show if there's a backend/API error message
          <Alert variant="destructive">
             <Info className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
             {/* Add reset button only in the final error state */}
             {step === 'error' && (
                  <Button type="button" variant="outline" size="sm" onClick={() => {
                     // Clear temporary state on full reset
                     setTempStudentData(null);
                     setTempProfileData(null);
                     safeLocalStorageRemove('studentVerificationCode'); // Clear any lingering code
                     setStep('initial');
                     setErrorMessage(null);
                     form.reset();
                     setHasAttemptedSubmit(false);
                   }} className="mt-4">
                    Volver al Inicio del Registro
                 </Button>
             )}
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
                  {/* FormMessage handles validation errors */}
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
                   {/* FormMessage handles validation errors */}
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
        {step === 'verify' && studentDataForDisplay && (
          <>
            <Alert variant="default" className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
              <Info className="h-4 w-4 text-blue-700 dark:text-blue-300" />
              <AlertTitle className="text-blue-800 dark:text-blue-200">Verificación Requerida</AlertTitle>
              <AlertDescription className="text-blue-700 dark:text-blue-300">
                Se ha enviado un código de verificación a tu correo electrónico institucional: <strong>{studentDataForDisplay.email}</strong>. Por favor, ingrésalo a continuación. (Mock: Usa 123456)
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
                  {/* FormMessage handles validation errors */}
                   <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MailCheck className="mr-2 h-4 w-4"/>}
              Verificar Código
            </Button>
             <Button type="button" variant="link" size="sm" onClick={() => setStep('initial')} disabled={isLoading} className="w-full mt-2 text-muted-foreground">
                Volver e ingresar Legajo/DNI
            </Button>
          </>
        )}

        {/* Step 3: Profile Details - Updated */}
        {step === 'profile' && studentDataForDisplay && (
          <>
            <h3 className="text-lg font-semibold border-b pb-2 mb-4">Completa tu Perfil</h3>
             <Alert variant="default" className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800 mb-4">
                 <UserCheck className="h-4 w-4 text-green-700 dark:text-green-300" />
                <AlertTitle className="text-green-800 dark:text-green-200">Datos de Sysacad</AlertTitle>
                <AlertDescription className="text-green-700 dark:text-green-300 text-xs space-y-1">
                   <p><strong>Nombre:</strong> {studentDataForDisplay.fullName}</p>
                   <p><strong>Carrera:</strong> {studentDataForDisplay.career} ({studentDataForDisplay.currentYear}° año)</p>
                   <p><strong>Promedio:</strong> {studentDataForDisplay.gpa}</p>
                   <p><strong>Email:</strong> {studentDataForDisplay.email}</p>
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
                   {/* No message needed for optional field unless it has specific validation */}
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
                   {/* No message needed for optional field */}
                    <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Continuar a Crear Contraseña
            </Button>
             <Button type="button" variant="link" size="sm" onClick={() => setStep('verify')} className="w-full mt-2 text-muted-foreground">
                Volver a Verificar Correo
            </Button>
          </>
        )}

        {/* Step 4: Set Password */}
        {step === 'password' && studentDataForDisplay && ( // Use temp state
          <>
            <h3 className="text-lg font-semibold border-b pb-2 mb-4">Crear Contraseña</h3>
             <Alert variant="default" className="mb-4">
              <KeyRound className="h-4 w-4" />
              <AlertTitle>Último Paso</AlertTitle>
              <AlertDescription>
                Crea una contraseña segura para tu cuenta. Tu nombre de usuario será tu número de legajo: <strong>{studentDataForDisplay.universityId}</strong>.
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
                   {/* FormMessage handles validation errors */}
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
                   {/* FormMessage handles validation errors */}
                  <FormMessage />
                </FormItem>
              )}
            />
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
         {step === 'complete' && studentDataForDisplay && ( // Use temp state
             <Alert variant="success">
                 <CheckSquare className="h-4 w-4"/>
                <AlertTitle>¡Registro Exitoso!</AlertTitle>
                <AlertDescription>
                    La cuenta para <strong>{studentDataForDisplay.fullName}</strong> ha sido creada. El nombre de usuario es tu legajo: <strong>{studentDataForDisplay.universityId}</strong>.
                     Ahora serás redirigido/a.
                 </AlertDescription>
             </Alert>
         )}

         {/* Final Error State - Handled by the global error message logic at the top */}

      </form>
    </Form>
  );
}
