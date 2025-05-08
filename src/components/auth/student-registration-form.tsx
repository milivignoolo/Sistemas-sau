'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form, // This is FormProvider
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
import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, MailCheck, Info, UserCheck, KeyRound, CheckSquare, Languages, Brain } from 'lucide-react';
import { SkillCheckboxGroup } from './skill-checkbox-group';
import { cn } from '@/lib/utils';
import { safeLocalStorageGet, safeLocalStorageSet, safeLocalStorageRemove } from '@/lib/local-storage';


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

async function fetchSysacadData(universityId: string, dni: string): Promise<SysacadStudentData> {
  console.log(`Fetching data for Legajo: ${universityId}, DNI: ${dni}`);
  await new Promise(resolve => setTimeout(resolve, 1500));
  if (universityId === '12345' && dni === '30123456') {
    return {
      fullName: 'Juan Alberto Pérez',
      dni: '30123456',
      universityId: '12345',
      career: 'sistemas', // Using ID for career
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
  safeLocalStorageSet('studentVerificationCode', '123456');
  return true;
}

async function verifyCode(email: string, code: string) {
  console.log(`Verifying code ${code} for email: ${email}`);
  const storedCode = safeLocalStorageGet('studentVerificationCode');
  await new Promise(resolve => setTimeout(resolve, 1000));
  if (code === storedCode && storedCode !== null) {
    safeLocalStorageRemove('studentVerificationCode');
    return true;
  } else {
    throw new Error('Código de verificación incorrecto.');
  }
}

async function createStudentAccount(data: any) {
    console.log('Simulating saving student account with data:', data);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const profileToSave = {
        username: data.universityId, // Legajo
        userType: 'student',
        password: data.password, // HASH THIS SERVER-SIDE IN A REAL APP
        fullName: data.fullName,
        dni: data.dni,
        career: data.career, // Career ID
        currentYear: data.currentYear,
        gpa: data.gpa,
        email: data.email,
        profile: data.profile, // Contains technicalSkills, softSkills, languages, availability, previousExperience
        // Ensure appliedInternships is initialized as an empty array
        appliedInternships: [],
    };
    safeLocalStorageSet('userProfile', profileToSave);
    safeLocalStorageRemove('studentRegData');
    safeLocalStorageRemove('studentProfileData');
    return { success: true, userId: data.universityId };
}

// --- Zod Schemas ---
const stepOneSchema = z.object({
  universityId: z.string().regex(/^\d+$/, { message: 'El legajo debe contener solo números.' }).min(5, { message: 'El legajo debe tener al menos 5 dígitos.' }),
  dni: z.string().regex(/^\d+$/, { message: 'El DNI debe contener solo números.' }).min(7, { message: 'El DNI debe tener al menos 7 dígitos.' }),
});

const stepTwoSchema = z.object({
  verificationCode: z.string().length(6, { message: 'El código debe tener 6 dígitos.' }),
});

const skillLevelSchema = z.record(z.string()).optional().default({});

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

type StudentFormData = z.infer<typeof stepOneSchema> &
                       Partial<z.infer<typeof stepTwoSchema>> &
                       Partial<z.infer<typeof stepThreeSchema>> &
                       Partial<z.infer<typeof stepFourSchema>>;

type Step = 'initial' | 'verify' | 'profile' | 'password' | 'complete' | 'error';

interface SysacadStudentData {
    fullName: string;
    dni: string;
    universityId: string;
    career: string; // Career ID
    currentYear: number;
    gpa: number;
    approvedSubjects: string[];
    regularizedSubjects: string[];
    email: string;
}

interface StudentRegistrationFormProps {
  onRegisterSuccess: () => void;
}

export function StudentRegistrationForm({ onRegisterSuccess }: StudentRegistrationFormProps) {
  const { toast } = useToast();
  const [step, setStep] = useState<Step>('initial');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [tempStudentData, setTempStudentData] = useState<SysacadStudentData | null>(null);
  const [tempProfileData, setTempProfileData] = useState<z.infer<typeof stepThreeSchema> | null>(null);

  const getCurrentSchema = () => {
    switch (step) {
      case 'initial': return stepOneSchema;
      case 'verify': return stepTwoSchema;
      case 'profile': return stepThreeSchema;
      case 'password': return stepFourSchema;
      default: return z.object({});
    }
  };

  const form = useForm<StudentFormData>({
    resolver: zodResolver(getCurrentSchema()),
    defaultValues: {
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
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const handleStepOneSubmit = async (values: z.infer<typeof stepOneSchema>) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await fetchSysacadData(values.universityId, values.dni);
      setTempStudentData(data);
      await sendVerificationEmail(data.email);
      toast({ title: 'Verifica tu Correo', description: `Se envió un código de verificación a ${data.email}. (Mock: 123456)` });
      setStep('verify');
      setHasAttemptedSubmit(false);
    } catch (error: any) {
      setErrorMessage(error.message || 'Ocurrió un error.');
      setHasAttemptedSubmit(true);
      if (error.message.includes('Sysacad')) {
           form.setError("universityId", { type: "manual", message: error.message });
           form.setError("dni", { type: "manual", message: error.message });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleStepTwoSubmit = async (values: z.infer<typeof stepTwoSchema>) => {
    if (!tempStudentData) {
      console.error("Verification step reached without initial data.");
      setErrorMessage("Error interno: Faltan datos de Sysacad. Por favor, reinicia el registro.");
      setStep('error');
      return;
    }
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await verifyCode(tempStudentData.email, values.verificationCode);
      toast({ title: 'Correo Verificado', description: 'Tu identidad ha sido verificada.', variant: 'default' });
      setStep('profile');
      setHasAttemptedSubmit(false);
    } catch (error: any) {
      setErrorMessage(error.message || 'Ocurrió un error.');
      setHasAttemptedSubmit(true);
      form.setError("verificationCode", { type: "manual", message: error.message || 'Código incorrecto.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStepThreeSubmit = async (values: z.infer<typeof stepThreeSchema>) => {
    setTempProfileData(values);
    setStep('password');
    setHasAttemptedSubmit(false);
  };

  const handleStepFourSubmit = async (values: z.infer<typeof stepFourSchema>) => {
    if (!tempStudentData || !tempProfileData) {
      console.error("Password step reached without initial or profile data.");
      setErrorMessage("Error interno: Faltan datos para crear la cuenta. Por favor, reinicia el registro.");
      setStep('error');
      return;
    }
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const finalUserData = {
        ...tempStudentData,
        profile: tempProfileData,
        password: values.password,
        username: tempStudentData.universityId,
      };
      await createStudentAccount(finalUserData);
      toast({ title: '¡Registro Completo!', description: `Bienvenido/a, ${tempStudentData.fullName}. Ya puedes iniciar sesión.` });
      setStep('complete');
      onRegisterSuccess();
    } catch (error: any) {
      setErrorMessage(error.message || 'No se pudo crear la cuenta.');
      setHasAttemptedSubmit(true);
      setStep('error');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: StudentFormData) => {
    if (step === 'complete' || step === 'error' || isLoading) {
      console.log('Submission blocked, current step:', step, 'isLoading:', isLoading);
      return;
    }
    setErrorMessage(null);
    setHasAttemptedSubmit(true);

    switch (step) {
      case 'initial': await handleStepOneSubmit(data as z.infer<typeof stepOneSchema>); break;
      case 'verify': await handleStepTwoSubmit(data as z.infer<typeof stepTwoSchema>); break;
      case 'profile': await handleStepThreeSubmit(data as z.infer<typeof stepThreeSchema>); break;
      case 'password': await handleStepFourSubmit(data as z.infer<typeof stepFourSchema>); break;
      default: console.log('Unhandled step in onSubmit:', step);
    }
  };

  const onFormError = (errors: any) => {
    console.error("Form validation failed:", errors);
    setHasAttemptedSubmit(true);
    const firstErrorField = Object.keys(errors)[0];
    const firstErrorMessage = firstErrorField ? errors[firstErrorField]?.message : 'Por favor, corrige los errores marcados.';
    toast({
      title: 'Error de Validación',
      description: typeof firstErrorMessage === 'string' ? firstErrorMessage : 'Error desconocido.',
      variant: 'destructive',
    });
  };

  useEffect(() => {
    const currentSchema = getCurrentSchema();
    // @ts-ignore
    form.resolver = zodResolver(currentSchema); // This way of updating resolver is not standard.
                                             // It's better to manage different forms or use a conditional resolver logic.
                                             // For now, keeping as is to focus on the handleSubmit error.

    form.reset({
      universityId: '', dni: '', verificationCode: '',
      availability: '', technicalSkills: {}, softSkills: {},
      previousExperience: '', languages: {},
      password: '', confirmPassword: '',
    }, { keepErrors: false, keepDirty: false, keepValues: false });
    setHasAttemptedSubmit(false);
    setErrorMessage(null);
  }, [step, form]);

  const studentDataForDisplay = tempStudentData;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onFormError)} className="space-y-6">
        {errorMessage && (
          <Alert variant="destructive">
            <Info className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
            {step === 'error' && (
              <Button type="button" variant="outline" size="sm" onClick={() => {
                setTempStudentData(null);
                setTempProfileData(null);
                safeLocalStorageRemove('studentVerificationCode');
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <SkillCheckboxGroup
              control={form.control}
              name="technicalSkills"
              label="Habilidades Técnicas"
              skills={PREDEFINED_TECHNICAL_SKILLS}
              levels={PROFICIENCY_LEVELS}
              icon={<CheckSquare size={20} />}
            />

            <SkillCheckboxGroup
              control={form.control}
              name="softSkills"
              label="Habilidades Blandas"
              skills={PREDEFINED_SOFT_SKILLS}
              levels={SOFT_SKILL_LEVELS}
              icon={<Brain size={20} />}
            />

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

            <Button type="submit" className="w-full">
              Continuar a Crear Contraseña
            </Button>
            <Button type="button" variant="link" size="sm" onClick={() => setStep('verify')} className="w-full mt-2 text-muted-foreground">
              Volver a Verificar Correo
            </Button>
          </>
        )}

        {step === 'password' && studentDataForDisplay && (
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
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserCheck className="mr-2 h-4 w-4" />}
              Completar Registro
            </Button>
            <Button type="button" variant="link" size="sm" onClick={() => setStep('profile')} disabled={isLoading} className="w-full mt-2 text-muted-foreground">
              Volver a Editar Perfil
            </Button>
          </>
        )}

        {step === 'complete' && studentDataForDisplay && (
          <Alert variant="success">
            <CheckSquare className="h-4 w-4"/>
            <AlertTitle>¡Registro Exitoso!</AlertTitle>
            <AlertDescription>
              La cuenta para <strong>{studentDataForDisplay.fullName}</strong> ha sido creada. El nombre de usuario es tu legajo: <strong>{studentDataForDisplay.universityId}</strong>.
              Ahora serás redirigido/a.
            </AlertDescription>
          </Alert>
        )}
      </form>
    </Form>
  );
}