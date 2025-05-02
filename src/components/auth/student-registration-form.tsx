
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, MailCheck, Info, UserCheck, KeyRound } from 'lucide-react';

// Mock Sysacad Data Fetching - Replace with actual API call
async function fetchSysacadData(universityId: string, dni: string) {
  console.log(`Fetching data for Legajo: ${universityId}, DNI: ${dni}`);
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Simulate finding user data
  // In a real scenario, you'd hit an endpoint:
  // const response = await fetch(`/api/sysacad?legajo=${universityId}&dni=${dni}`);
  // const data = await response.json();
  // if (!response.ok) throw new Error(data.message || 'Failed to fetch data');
  // return data;

  // Mock data
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
      email: 'juan.perez.mock@utn.edu.ar', // Use a mock email for testing
    };
  } else {
    throw new Error('Estudiante no encontrado en Sysacad.');
  }
}

// Mock Email Verification - Replace with actual API calls
async function sendVerificationEmail(email: string) {
  console.log(`Sending verification email to: ${email}`);
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  // In a real scenario, the backend generates and sends the code
  console.log(`Mock verification code sent (simulated): 123456`);
  return true; // Indicate success
}

async function verifyCode(email: string, code: string) {
  console.log(`Verifying code ${code} for email: ${email}`);
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  // In a real scenario, the backend verifies the code
  if (code === '123456') { // Use the mock code
    return true;
  } else {
    throw new Error('Código de verificación incorrecto.');
  }
}

// Mock Account Creation - Replace with actual API call
async function createStudentAccount(data: any) {
    console.log('Creating student account with data:', data);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    // In a real scenario, save the user to your database
    return { success: true, userId: 'mockUserId123' };
}

// Define Zod schemas for each step
const stepOneSchema = z.object({
  universityId: z.string().regex(/^\d+$/, { message: 'El legajo debe contener solo números.' }).min(5, { message: 'El legajo debe tener al menos 5 dígitos.' }),
  dni: z.string().regex(/^\d+$/, { message: 'El DNI debe contener solo números.' }).min(7, { message: 'El DNI debe tener al menos 7 dígitos.' }),
});

const stepTwoSchema = z.object({
  verificationCode: z.string().length(6, { message: 'El código debe tener 6 dígitos.' }),
});

const stepThreeSchema = z.object({
  availability: z.string().optional(),
  technicalSkills: z.string().optional(),
  softSkills: z.string().optional(),
  previousExperience: z.string().optional(),
  languages: z.string().optional(),
});

const stepFourSchema = z.object({
  password: z.string().min(8, { message: 'La contraseña debe tener al menos 8 caracteres.' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden.',
  path: ['confirmPassword'],
});

// Combine schemas for conditional validation (optional, can handle step by step)
// const combinedSchema = stepOneSchema.merge(stepTwoSchema).merge(stepThreeSchema).merge(stepFourSchema);

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


export function StudentRegistrationForm() {
  const { toast } = useToast();
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
      default: return z.object({}); // Empty schema for other steps
    }
  };

  const form = useForm<any>({ // Use 'any' for multi-step, or a combined type
    resolver: zodResolver(getCurrentSchema()),
    defaultValues: {
      universityId: '',
      dni: '',
      verificationCode: '',
      availability: '',
      technicalSkills: '',
      softSkills: '',
      previousExperience: '',
      languages: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange', // Validate on change for better UX
  });

   // Define submit handlers for each step
  const handleStepOneSubmit = async (values: z.infer<typeof stepOneSchema>) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await fetchSysacadData(values.universityId, values.dni);
      setStudentData(data);
      await sendVerificationEmail(data.email);
      toast({ title: 'Verifica tu Correo', description: `Se envió un código de verificación a ${data.email}.` });
      setStep('verify');
    } catch (error: any) {
      setErrorMessage(error.message || 'Ocurrió un error.');
      // Optionally: setStep('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStepTwoSubmit = async (values: z.infer<typeof stepTwoSchema>) => {
     if (!studentData) return; // Should not happen
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
    // Simply store the profile data and move to the next step
    setProfileData(values);
    setStep('password');
  };

  const handleStepFourSubmit = async (values: z.infer<typeof stepFourSchema>) => {
     if (!studentData || !profileData) return; // Should not happen
     setIsLoading(true);
     setErrorMessage(null);
     try {
        const finalUserData = {
            ...studentData,
            ...profileData,
            password: values.password, // Store the password (in real app, hash it on backend)
            username: studentData.universityId, // Username is the legajo
        };
        await createStudentAccount(finalUserData);
        toast({ title: '¡Registro Completo!', description: `Bienvenido/a, ${studentData.fullName}. Ya puedes iniciar sesión.` });
        setStep('complete');
        // Optionally redirect to login or dashboard
        // router.push('/login');
     } catch (error: any) {
        setErrorMessage(error.message || 'No se pudo crear la cuenta.');
     } finally {
        setIsLoading(false);
     }
  };

  // Main submit handler routes to the correct step handler
  const onSubmit = async (values: any) => {
    // Re-validate with the current schema before submitting the step
    const currentSchema = getCurrentSchema();
    const validationResult = currentSchema.safeParse(values);

    if (!validationResult.success) {
        console.error("Validation failed:", validationResult.error.flatten().fieldErrors);
        // Errors should be displayed by FormMessage components
        return;
    }

    const validatedValues = validationResult.data;

    switch (step) {
      case 'initial':
        await handleStepOneSubmit(validatedValues as z.infer<typeof stepOneSchema>);
        break;
      case 'verify':
        await handleStepTwoSubmit(validatedValues as z.infer<typeof stepTwoSchema>);
        break;
      case 'profile':
        await handleStepThreeSubmit(validatedValues as z.infer<typeof stepThreeSchema>);
        break;
      case 'password':
        await handleStepFourSubmit(validatedValues as z.infer<typeof stepFourSchema>);
        break;
      default:
        console.log('Unhandled step:', step);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        {errorMessage && (
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
                Se ha enviado un código de verificación a tu correo electrónico institucional: <strong>{studentData.email}</strong>. Por favor, ingrésalo a continuación.
              </AlertDescription>
            </Alert>
            <FormField
              control={form.control}
              name="verificationCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código de Verificación</FormLabel>
                  <FormControl>
                    <Input placeholder="123456" {...field} disabled={isLoading} maxLength={6} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MailCheck className="mr-2 h-4 w-4"/>}
              Verificar Código
            </Button>
             <Button variant="link" size="sm" onClick={() => setStep('initial')} disabled={isLoading} className="w-full mt-2 text-muted-foreground">
                Volver e ingresar Legajo/DNI
            </Button>
          </>
        )}

        {/* Step 3: Profile Details */}
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
            <FormField
              control={form.control}
              name="technicalSkills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Habilidades Técnicas</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Ej: React, Node.js, Python, SQL, Git, Docker..." {...field} />
                  </FormControl>
                  <FormDescription>Separa las habilidades con comas.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="softSkills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Habilidades Blandas</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Ej: Trabajo en equipo, Comunicación, Resolución de problemas..." {...field} />
                  </FormControl>
                   <FormDescription>Separa las habilidades con comas.</FormDescription>
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
                    <Textarea placeholder="Describe brevemente proyectos personales, trabajos anteriores o voluntariados relevantes." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="languages"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Idiomas (Opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Inglés B2, Portugués A1" {...field} />
                  </FormControl>
                   <FormDescription>Indica el idioma y tu nivel.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Continuar a Crear Contraseña
            </Button>
             <Button variant="link" size="sm" onClick={() => setStep('verify')} className="w-full mt-2 text-muted-foreground">
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
            <Button type="submit" className="w-full" disabled={isLoading}>
               {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Completar Registro
            </Button>
            <Button variant="link" size="sm" onClick={() => setStep('profile')} disabled={isLoading} className="w-full mt-2 text-muted-foreground">
                Volver a Editar Perfil
            </Button>
          </>
        )}

         {/* Step 5: Complete */}
         {step === 'complete' && studentData && (
            <Alert variant="default" className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
                 <MailCheck className="h-4 w-4 text-green-700 dark:text-green-300"/>
                <AlertTitle className="text-green-800 dark:text-green-200">¡Registro Exitoso!</AlertTitle>
                <AlertDescription className="text-green-700 dark:text-green-300">
                    Tu cuenta ha sido creada. Tu nombre de usuario es <strong>{studentData.universityId}</strong>.
                     Ya puedes <Button variant="link" className="p-0 h-auto text-green-700 dark:text-green-300" onClick={() => {/* TODO: Implement login redirect */}}>iniciar sesión</Button>.
                 </AlertDescription>
            </Alert>
         )}
      </form>
    </Form>
  );
}
