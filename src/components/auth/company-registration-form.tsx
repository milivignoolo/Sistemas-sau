
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
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, MailCheck, Info, Building, KeyRound, Fingerprint, Link as LinkIcon, Briefcase, User, Home, Globe, Share2, CheckSquare } from 'lucide-react'; // Added CheckSquare
import { Separator } from '@/components/ui/separator'; // Import Separator


// --- Mock Verification Functions ---
async function verifyArcaApi(cuit: string) {
  console.log(`Verifying CUIT ${cuit} with mock ARCA API...`);
  await new Promise(resolve => setTimeout(resolve, 1500));
  // Simulate success for a specific CUIT, failure otherwise
  if (cuit === '30-12345678-9') {
    console.log('ARCA Verification Successful for CUIT:', cuit);
    return { success: true, companyNameFromApi: 'Tecno Soluciones S.A. (Verified)' };
  } else {
    console.error('ARCA Verification Failed for CUIT:', cuit);
    throw new Error('CUIT no encontrado o inválido según ARCA (simulado).');
  }
}

async function sendCompanyVerificationEmail(email: string) {
  console.log(`Sending verification email to company contact: ${email}`);
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log(`Mock verification code sent (simulated): 654321`); // Different code for company
  return true;
}

async function verifyCompanyCode(email: string, code: string) {
  console.log(`Verifying company code ${code} for email: ${email}`);
  await new Promise(resolve => setTimeout(resolve, 1000));
  if (code === '654321') { // Different code for company
    return true;
  } else {
    throw new Error('Código de verificación incorrecto.');
  }
}

async function createCompanyAccount(data: any) {
    console.log('Creating company account with data:', data);
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Simulate success
    return { success: true, companyId: 'mockCompanyId456' };
}


// --- Zod Schemas ---

// Schema for Step 1: Initial Company Details
const stepOneSchema = z.object({
  companyName: z.string().min(2, { message: 'La razón social debe tener al menos 2 caracteres.' }),
  cuit: z.string().regex(/^\d{2}-\d{8}-\d{1}$/, { message: 'Formato de CUIT inválido (XX-XXXXXXXX-X).' }),
  industry: z.string().min(3, { message: 'El rubro es requerido.' }),
  address: z.string().min(5, { message: 'El domicilio legal es requerido.' }),
  workLocation: z.string().min(5, { message: 'La ubicación de trabajo es requerida.' }),
  website: z.string().url({ message: 'Debe ser una URL válida (ej: https://...)' }).optional().or(z.literal('')),
  socialMedia: z.string().optional(),
  description: z.string().optional(),
  contactName: z.string().min(2, { message: 'El nombre de contacto debe tener al menos 2 caracteres.' }),
  contactRole: z.string().min(2, { message: 'El cargo del contacto es requerido.' }),
  contactEmail: z.string().email({ message: 'Debe ser un correo electrónico válido.' }),
  contactPhone: z.string().optional(),
});

// Schema for Step 2: ARCA Verification (only CUIT needed, but form holds all values)
// No separate schema needed as verification happens after step 1 submission

// Schema for Step 3: Email Verification Code
const stepThreeSchema = z.object({
  verificationCode: z.string().length(6, { message: 'El código debe tener 6 dígitos.' }),
});

// Schema for Step 4: Password Creation
const stepFourSchema = z.object({
  password: z.string().min(8, { message: 'La contraseña debe tener al menos 8 caracteres.' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden.',
  path: ['confirmPassword'],
});


// --- Component Logic ---
type Step = 'initial' | 'verifyArca' | 'verifyEmail' | 'password' | 'complete' | 'error';

// Combine all possible fields for the form's type, using partial for intermediate steps
type CompanyFormData = z.infer<typeof stepOneSchema> &
                       Partial<z.infer<typeof stepThreeSchema>> &
                       Partial<z.infer<typeof stepFourSchema>>;

export function CompanyRegistrationForm() {
  const { toast } = useToast();
  const [step, setStep] = useState<Step>('initial');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [companyInitialData, setCompanyInitialData] = useState<z.infer<typeof stepOneSchema> | null>(null);

   // Determine the current schema based on the step
   const getCurrentSchema = () => {
    switch (step) {
      case 'initial':
      case 'verifyArca': // Use stepOneSchema for initial submission and ARCA verification trigger
         return stepOneSchema;
      case 'verifyEmail':
        return stepThreeSchema;
      case 'password':
        return stepFourSchema;
      default:
        return z.object({}); // Empty schema for other steps
    }
  };

   // Use Form with combined type and current step's schema for resolver
   const form = useForm<CompanyFormData>({
    resolver: zodResolver(getCurrentSchema()),
    defaultValues: {
      companyName: '',
      cuit: '',
      industry: '',
      address: '',
      workLocation: '',
      website: '',
      socialMedia: '',
      description: '',
      contactName: '',
      contactRole: '',
      contactEmail: '',
      contactPhone: '',
      verificationCode: '',
      password: '',
      confirmPassword: '',
    },
     mode: 'onChange', // Validate on change for better UX
     reValidateMode: 'onChange',
  });

  // --- Submit Handlers for Each Step ---
  const handleInitialSubmit = async (values: z.infer<typeof stepOneSchema>) => {
    setIsLoading(true);
    setErrorMessage(null);
    setCompanyInitialData(values); // Store initial data
    setStep('verifyArca'); // Move to ARCA verification state

    try {
      // Trigger ARCA verification
      const arcaResult = await verifyArcaApi(values.cuit);
      if (arcaResult.success) {
         toast({ title: 'Verificación ARCA Exitosa', description: `Empresa "${arcaResult.companyNameFromApi}" encontrada.` });
        // Now trigger email verification
        await sendCompanyVerificationEmail(values.contactEmail);
        toast({ title: 'Verifica tu Correo', description: `Se envió un código de verificación a ${values.contactEmail}.` });
        setStep('verifyEmail');
      } else {
         // This case might not be reached if verifyArcaApi throws error on failure
         setErrorMessage('La verificación ARCA falló (simulado).');
         setStep('error');
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'Error en la verificación ARCA.');
      form.setError("cuit", { type: "manual", message: error.message || 'Verificación ARCA fallida.' });
      setStep('initial'); // Go back to initial step on ARCA error
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailVerifySubmit = async (values: z.infer<typeof stepThreeSchema>) => {
    if (!companyInitialData) return; // Should not happen
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await verifyCompanyCode(companyInitialData.contactEmail, values.verificationCode);
      toast({ title: 'Correo Verificado', description: 'El correo de contacto ha sido verificado.' });
      setStep('password'); // Move to password creation
    } catch (error: any) {
       setErrorMessage(error.message || 'Error en la verificación del código.');
       form.setError("verificationCode", { type: "manual", message: error.message || 'Código incorrecto.' });
       // Stay on verifyEmail step
    } finally {
      setIsLoading(false);
    }
  };

   const handlePasswordSubmit = async (values: z.infer<typeof stepFourSchema>) => {
    if (!companyInitialData) return; // Should not happen
    setIsLoading(true);
    setErrorMessage(null);

    const finalCompanyData = {
        ...companyInitialData,
        password: values.password, // Add password
        username: companyInitialData.cuit, // Set username as CUIT
    };

    try {
        await createCompanyAccount(finalCompanyData);
        toast({ title: '¡Registro de Empresa Completo!', description: `La cuenta para ${companyInitialData.companyName} ha sido creada.` });
        setStep('complete');
    } catch (error: any) {
        setErrorMessage(error.message || 'No se pudo crear la cuenta de la empresa.');
        setStep('error'); // Go to error state
    } finally {
        setIsLoading(false);
    }
  };


  // --- Main Submit Handler ---
  const onSubmit = async (values: CompanyFormData) => {
     // Update resolver dynamically based on the current step before submitting
     form.trigger().then(isValid => {
         if (isValid) {
             switch (step) {
                case 'initial':
                    handleInitialSubmit(values as z.infer<typeof stepOneSchema>);
                    break;
                case 'verifyEmail':
                    handleEmailVerifySubmit(values as z.infer<typeof stepThreeSchema>);
                    break;
                case 'password':
                    handlePasswordSubmit(values as z.infer<typeof stepFourSchema>);
                    break;
                default:
                    console.log('Unhandled step or state:', step);
            }
         } else {
             console.log("Form validation failed for step:", step, form.formState.errors);
              toast({
                    title: 'Error de Validación',
                    description: 'Por favor, corrige los errores en el formulario.',
                    variant: 'destructive',
                });
         }
     });


  };

  // --- Re-render form when step changes to apply new resolver ---
   React.useEffect(() => {
        form.reset(form.getValues()); // Keep current values, but re-apply resolver
    }, [step, form]);


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

         {errorMessage && step !== 'error' && ( // Show error inline unless in final error step
            <Alert variant="destructive">
                <Info className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
            )}

        {/* Step 1: Initial Details */}
        {step === 'initial' && (
          <>
            <h3 className="text-lg font-semibold border-b pb-2 mb-4 flex items-center gap-2"><Building size={20} /> Datos de la Empresa</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField control={form.control} name="companyName" render={({ field }) => ( <FormItem> <FormLabel>Razón Social</FormLabel> <FormControl><Input placeholder="Tecno Soluciones S.A." {...field} disabled={isLoading} /></FormControl> <FormMessage /> </FormItem> )}/>
                 <FormField control={form.control} name="cuit" render={({ field }) => ( <FormItem> <FormLabel>CUIT</FormLabel> <FormControl><Input placeholder="30-12345678-9" {...field} disabled={isLoading} /></FormControl> <FormMessage /> </FormItem> )}/>
             </div>
             <FormField control={form.control} name="industry" render={({ field }) => ( <FormItem> <FormLabel>Rubro / Actividad Principal</FormLabel> <FormControl><Input placeholder="Ej: Desarrollo de Software, Consultoría IT" {...field} disabled={isLoading}/></FormControl> <FormMessage /> </FormItem> )}/>
             <FormField control={form.control} name="address" render={({ field }) => ( <FormItem> <FormLabel>Domicilio Legal</FormLabel> <FormControl><Input placeholder="Av. Siempre Viva 742, Springfield" {...field} disabled={isLoading}/></FormControl> <FormMessage /> </FormItem> )}/>
             <FormField control={form.control} name="workLocation" render={({ field }) => ( <FormItem> <FormLabel>Ubicación del Lugar de Trabajo</FormLabel> <FormControl><Input placeholder="Ej: Resistencia, Chaco / Remoto / Híbrido" {...field} disabled={isLoading}/></FormControl> <FormMessage /> </FormItem> )}/>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="website" render={({ field }) => ( <FormItem> <FormLabel><LinkIcon size={14} className="inline mr-1"/> Sitio Web (Opcional)</FormLabel> <FormControl><Input type="url" placeholder="https://www.empresa.com" {...field} disabled={isLoading}/></FormControl> <FormMessage /> </FormItem> )}/>
                <FormField control={form.control} name="socialMedia" render={({ field }) => ( <FormItem> <FormLabel><Share2 size={14} className="inline mr-1"/> Redes Sociales (Opcional)</FormLabel> <FormControl><Input placeholder="LinkedIn, Instagram, etc." {...field} disabled={isLoading}/></FormControl> <FormMessage /> </FormItem> )}/>
             </div>

            <FormField control={form.control} name="description" render={({ field }) => ( <FormItem> <FormLabel>Descripción de la Empresa (Opcional)</FormLabel> <FormControl><Textarea placeholder="Breve descripción de la empresa, su rubro, cultura, etc." className="resize-none" {...field} disabled={isLoading}/></FormControl> <FormDescription>Esta descripción ayudará a los estudiantes a conocer mejor tu empresa.</FormDescription> <FormMessage /> </FormItem> )}/>

             <Separator className="my-6" />
             <h3 className="text-lg font-semibold border-b pb-2 mb-4 flex items-center gap-2"><User size={20}/> Datos de Contacto (RRHH)</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="contactName" render={({ field }) => ( <FormItem> <FormLabel>Nombre del Contacto</FormLabel> <FormControl><Input placeholder="María García" {...field} disabled={isLoading}/></FormControl> <FormMessage /> </FormItem> )}/>
                <FormField control={form.control} name="contactRole" render={({ field }) => ( <FormItem> <FormLabel>Cargo del Contacto</FormLabel> <FormControl><Input placeholder="Responsable de RRHH" {...field} disabled={isLoading}/></FormControl> <FormMessage /> </FormItem> )}/>
            </div>
             <FormField control={form.control} name="contactEmail" render={({ field }) => ( <FormItem> <FormLabel>Correo Electrónico de Contacto</FormLabel> <FormControl><Input type="email" placeholder="rrhh@empresa.com" {...field} disabled={isLoading}/></FormControl> <FormMessage /> </FormItem> )}/>
             <FormField control={form.control} name="contactPhone" render={({ field }) => ( <FormItem> <FormLabel>Teléfono de Contacto (Opcional)</FormLabel> <FormControl><Input type="tel" placeholder="+54 9 11 1234-5678" {...field} disabled={isLoading}/></FormControl> <FormMessage /> </FormItem> )}/>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Fingerprint className="mr-2 h-4 w-4" />}
              Verificar Empresa y Contacto
            </Button>
          </>
        )}

         {/* Step 2: ARCA Verification Loader (Intermediate Step) */}
        {step === 'verifyArca' && (
             <div className="flex flex-col items-center justify-center space-y-4 p-8">
                 <Loader2 className="h-12 w-12 animate-spin text-primary" />
                 <p className="text-muted-foreground">Verificando CUIT con ARCA...</p>
                 <p className="text-sm text-center max-w-xs">Esto puede tardar unos segundos. Por favor, espera.</p>
             </div>
        )}


        {/* Step 3: Email Verification */}
        {step === 'verifyEmail' && companyInitialData && (
          <>
             <h3 className="text-lg font-semibold border-b pb-2 mb-4 flex items-center gap-2"><MailCheck size={20} /> Verificar Correo Electrónico</h3>
            <Alert variant="info">
              <Info className="h-4 w-4" />
              <AlertTitle>Verificación de Contacto Requerida</AlertTitle>
              <AlertDescription>
                Se ha enviado un código de 6 dígitos a <strong>{companyInitialData.contactEmail}</strong>. Ingrésalo a continuación para verificar la dirección de correo electrónico de contacto.
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
             <Button variant="link" size="sm" onClick={() => { setStep('initial'); setErrorMessage(null); }} disabled={isLoading} className="w-full mt-2 text-muted-foreground">
                Volver y corregir datos iniciales
            </Button>
             {/* TODO: Add resend code functionality */}
             {/* <Button variant="link" size="sm" disabled={isLoading} className="w-full mt-1 text-primary">
                Reenviar Código
             </Button> */}
          </>
        )}

        {/* Step 4: Create Password */}
        {step === 'password' && companyInitialData && (
          <>
            <h3 className="text-lg font-semibold border-b pb-2 mb-4 flex items-center gap-2"><KeyRound size={20} /> Crear Contraseña</h3>
            <Alert variant="default">
              <KeyRound className="h-4 w-4" />
              <AlertTitle>Último Paso</AlertTitle>
              <AlertDescription>
                Crea una contraseña segura para la cuenta de la empresa. El nombre de usuario será el CUIT: <strong>{companyInitialData.cuit}</strong>.
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
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Building className="mr-2 h-4 w-4"/>}
              Completar Registro de Empresa
            </Button>
             <Button variant="link" size="sm" onClick={() => setStep('verifyEmail')} disabled={isLoading} className="w-full mt-2 text-muted-foreground">
                Volver a ingresar código de verificación
            </Button>
          </>
        )}

         {/* Step 5: Complete */}
         {step === 'complete' && companyInitialData && (
             <Alert variant="success">
                 <CheckSquare className="h-4 w-4"/>
                <AlertTitle>¡Registro de Empresa Exitoso!</AlertTitle>
                <AlertDescription>
                    La cuenta para <strong>{companyInitialData.companyName}</strong> ha sido creada. El nombre de usuario es el CUIT: <strong>{companyInitialData.cuit}</strong>.
                     Ya puedes <Button variant="link" className="p-0 h-auto text-green-700 dark:text-green-300" onClick={() => {/* TODO: Implement login redirect */}}>iniciar sesión</Button> y publicar pasantías.
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
                  <Button variant="outline" size="sm" onClick={() => { setStep('initial'); setErrorMessage(null); }} className="mt-4">
                    Volver al Inicio del Registro
                 </Button>
             </Alert>
         )}

      </form>
    </Form>
  );
}
