
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
import { useState, useEffect } from 'react'; // Import useEffect
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, MailCheck, Info, Building, KeyRound, Fingerprint, Link as LinkIcon, Briefcase, User, Home, Globe, Share2, CheckSquare } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

// Removed useRouter import as navigation is handled by the parent via onRegisterSuccess

// --- Utility Functions for localStorage ---
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

// --- Mock Verification Functions ---
async function verifyArcaApi(cuit: string) {
  console.log(`Verifying CUIT ${cuit} with mock ARCA API...`);
  await new Promise(resolve => setTimeout(resolve, 1500));
    const normalizedCuit = cuit.replace(/-/g, '');
    if (normalizedCuit === '30123456789') {
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
  const mockCode = '654321';
  console.log(`Mock verification code sent (simulated): ${mockCode}`);
  safeLocalStorageSet('companyVerificationCode', mockCode); // Store code for verification step
  return true;
}

async function verifyCompanyCode(email: string, code: string) {
  console.log(`Verifying company code ${code} for email: ${email}`);
  const storedCode = safeLocalStorageGet('companyVerificationCode');
  await new Promise(resolve => setTimeout(resolve, 1000));
    if (code === storedCode && storedCode !== null) {
    console.log(`Company code ${code} verified successfully for ${email} (Mock)`);
    safeLocalStorageRemove('companyVerificationCode'); // Remove code after successful verification
    return true;
  } else {
    console.error(`Incorrect or invalid company code ${code} for ${email}`);
    throw new Error('Código de verificación inválido.');
  }
}

async function createCompanyAccount(data: any) {
    console.log('Simulating saving company account with data:', data);
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Simulate saving the final combined profile to localStorage
    safeLocalStorageSet('userProfile', { ...data, userType: 'company' });
    // Clear temporary registration data
    safeLocalStorageRemove('companyRegData');
    return { success: true, companyId: data.cuit.replace(/-/g, '') }; // Use CUIT as mock companyId
}


// --- Zod Schemas ---

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

const stepThreeSchema = z.object({
  verificationCode: z.string().length(6, { message: 'El código debe tener 6 dígitos.' }),
});

const stepFourSchema = z.object({
  password: z.string().min(8, { message: 'La contraseña debe tener al menos 8 caracteres.' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden.',
  path: ['confirmPassword'],
});


// --- Component Logic ---
type Step = 'initial' | 'verifyArca' | 'verifyEmail' | 'password' | 'complete' | 'error';

// Combine all possible fields for the form's type
type CompanyFormData = z.infer<typeof stepOneSchema> &
                       Partial<z.infer<typeof stepThreeSchema>> &
                       Partial<z.infer<typeof stepFourSchema>>;

// Define props for the component, including the callback
interface CompanyRegistrationFormProps {
  onRegisterSuccess: () => void;
}

export function CompanyRegistrationForm({ onRegisterSuccess }: CompanyRegistrationFormProps) {
  const { toast } = useToast();
  const [step, setStep] = useState<Step>('initial');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  // No longer need validatedInitialData state, use localStorage

   const getCurrentSchema = () => {
    switch (step) {
      case 'initial':
      case 'verifyArca': // Still validate step one schema before triggering ARCA
         return stepOneSchema;
      case 'verifyEmail':
        return stepThreeSchema;
      case 'password':
        return stepFourSchema;
      default:
        return z.object({}); // Return an empty schema for non-form steps
    }
  };

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
     mode: 'onSubmit', // Validate only on submit initially
     reValidateMode: 'onChange', // Re-validate on change after the first submit attempt
  });

   // --- Submit Handlers for Each Step ---
  const handleInitialSubmit = async (values: z.infer<typeof stepOneSchema>) => {
    setIsLoading(true);
    setErrorMessage(null);
    safeLocalStorageSet('companyRegData', values); // Store validated initial data
    setStep('verifyArca');

    try {
      const arcaResult = await verifyArcaApi(values.cuit);
      if (arcaResult.success) {
         toast({ title: 'Verificación ARCA Exitosa', description: `Empresa "${arcaResult.companyNameFromApi}" encontrada.` });
        await sendCompanyVerificationEmail(values.contactEmail);
        toast({ title: 'Verifica tu Correo', description: `Se envió un código de verificación a ${values.contactEmail}. (Mock: Usa 654321)` });
        setStep('verifyEmail');
        setHasAttemptedSubmit(false); // Reset submit attempt flag for the next step
      }
    } catch (error: any) {
      console.error("ARCA or Email Send verification error:", error);
      setErrorMessage(error.message || 'Error en la verificación inicial.');
      if (error.message.includes('ARCA')) {
          form.setError("cuit", { type: "manual", message: error.message });
      } else {
          setErrorMessage("Error al verificar la empresa o enviar el correo.");
      }
      setStep('initial'); // Revert to initial step on error
      safeLocalStorageRemove('companyRegData'); // Clear partial data on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailVerifySubmit = async (values: { verificationCode: string }) => {
    const companyRegData = safeLocalStorageGet('companyRegData');
    if (!companyRegData) {
        console.error("Email verification step reached without initial data.");
        setErrorMessage("Error interno: Faltan datos iniciales. Por favor, reinicia el registro.");
        setStep('error');
        return;
    }
    setIsLoading(true);
    setErrorMessage(null);
    try {
      console.log(`Attempting to verify code '${values.verificationCode}' for email '${companyRegData.contactEmail}'`);
      await verifyCompanyCode(companyRegData.contactEmail, values.verificationCode);
      toast({ title: 'Correo Verificado', description: 'El correo de contacto ha sido verificado.' });
      setStep('password');
      setHasAttemptedSubmit(false); // Reset submit attempt flag
    } catch (error: any) {
       console.error("Email verification code error:", error);
       setErrorMessage(error.message || 'Error en la verificación del código.');
       form.setError("verificationCode", { type: "manual", message: error.message || 'Código incorrecto.' });
    } finally {
      setIsLoading(false);
    }
  };

   const handlePasswordSubmit = async (values: z.infer<typeof stepFourSchema>) => {
    const companyRegData = safeLocalStorageGet('companyRegData');
    if (!companyRegData) {
        console.error("Password step reached without initial data.");
        setErrorMessage("Error interno: Faltan datos iniciales. Por favor, reinicia el registro.");
        setStep('error');
        return;
    }
    setIsLoading(true);
    setErrorMessage(null);

    const usernameCuit = companyRegData.cuit.replace(/-/g, '');

    const finalCompanyData = {
        ...companyRegData,
        password: values.password, // HASH THIS SERVER-SIDE IN REAL APP
        username: usernameCuit,
    };

    try {
        await createCompanyAccount(finalCompanyData);
        toast({ title: '¡Registro de Empresa Completo!', description: `La cuenta para ${companyRegData.companyName} ha sido creada.` });
        setStep('complete');
        onRegisterSuccess();
     } catch (error: any) {
        console.error("Account creation error:", error);
        setErrorMessage(error.message || 'No se pudo crear la cuenta de la empresa.');
        setStep('error');
    } finally {
        setIsLoading(false);
    }
  };


  // --- Main Submit Handler ---
  const onSubmit = async (values: CompanyFormData) => {
     // Prevent submission during intermediate/final steps or loading
     if (step === 'complete' || step === 'error' || step === 'verifyArca' || isLoading) return;

     setHasAttemptedSubmit(true); // Mark that a submit attempt has been made

     let handler: ((data: any) => Promise<void>) | undefined = undefined;
     let schemaForValidation: z.ZodSchema<any> = z.object({});

     switch (step) {
        case 'initial':
            schemaForValidation = stepOneSchema;
            handler = handleInitialSubmit;
            break;
        case 'verifyEmail':
             schemaForValidation = stepThreeSchema;
             handler = handleEmailVerifySubmit;
             break;
        case 'password':
             schemaForValidation = stepFourSchema;
             handler = handlePasswordSubmit;
             break;
        default:
            console.log('Submit called on unhandled step:', step);
            return;
     }

     // Validate using the resolver (which respects mode: 'onSubmit')
     const isValid = await form.trigger(Object.keys(schemaForValidation.shape) as (keyof CompanyFormData)[]);

     if (isValid && handler) {
         try {
             // Get potentially updated values and parse against the specific step schema
             const currentValues = form.getValues();
             const stepSpecificValues = schemaForValidation.parse(currentValues);
             await handler(stepSpecificValues);
         } catch (validationError) {
             console.error("Schema parsing failed after trigger passed:", validationError);
             toast({
                 title: 'Error de Datos',
                 description: 'Hubo un problema con los datos ingresados. Por favor, revisa el formulario.',
                 variant: 'destructive',
             });
         }
     } else if (!isValid) {
         console.log("Form validation failed for step:", step, form.formState.errors);
         // Errors will be shown by FormMessage components
         const errors = form.formState.errors;
         const firstErrorField = Object.keys(schemaForValidation.shape).find(field => errors[field as keyof CompanyFormData]);
         const firstErrorMessage = firstErrorField ? errors[firstErrorField as keyof CompanyFormData]?.message : 'Por favor, corrige los errores marcados.';
         toast({
             title: 'Error de Validación',
             description: typeof firstErrorMessage === 'string' ? firstErrorMessage : 'Por favor, revisa el formulario.',
             variant: 'destructive',
         });
     }
 };

  // Effect to update resolver and load data from localStorage when step changes
  useEffect(() => {
    const currentSchema = getCurrentSchema();
    // @ts-ignore
    form.resolver = zodResolver(currentSchema);

    // Load data from localStorage for the current step if available
    const companyRegData = safeLocalStorageGet('companyRegData');

    // Reset form with loaded data or default values
    form.reset({
        // Step 1 data (if available)
        companyName: companyRegData?.companyName || '',
        cuit: companyRegData?.cuit || '',
        industry: companyRegData?.industry || '',
        address: companyRegData?.address || '',
        workLocation: companyRegData?.workLocation || '',
        website: companyRegData?.website || '',
        socialMedia: companyRegData?.socialMedia || '',
        description: companyRegData?.description || '',
        contactName: companyRegData?.contactName || '',
        contactRole: companyRegData?.contactRole || '',
        contactEmail: companyRegData?.contactEmail || '',
        contactPhone: companyRegData?.contactPhone || '',
        // Step 3 default
        verificationCode: '',
        // Step 4 defaults
        password: '',
        confirmPassword: '',
    });

    setHasAttemptedSubmit(false); // Reset submit attempt flag when step changes
    setErrorMessage(null); // Clear global error message when step changes


    // Trigger validation *only if* a submit attempt was made for this step previously (useful for re-renders)
    // However, with mode: 'onSubmit', initial validation happens on submit, so triggering here might be redundant
    // if (hasAttemptedSubmit && currentSchema && Object.keys(currentSchema.shape || {}).length > 0) {
    //    setTimeout(() => form.trigger(), 50);
    // }
  }, [step, form]); // Dependencies: step and form instance

  const companyDataForDisplay = safeLocalStorageGet('companyRegData');


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

         {/* Show global error message only if it exists */}
         {errorMessage && (
            <Alert variant="destructive">
                <Info className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
                {/* Add reset button only in the final error state */}
                {step === 'error' && (
                    <Button type="button" variant="outline" size="sm" onClick={() => {
                      // Clear all company registration localStorage data on full reset
                      safeLocalStorageRemove('companyRegData');
                      safeLocalStorageRemove('companyVerificationCode');
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

         {/* Step 2: ARCA Verification Loader */}
        {step === 'verifyArca' && (
             <div className="flex flex-col items-center justify-center space-y-4 p-8">
                 <Loader2 className="h-12 w-12 animate-spin text-primary" />
                 <p className="text-muted-foreground">Verificando CUIT con ARCA...</p>
                 <p className="text-sm text-center max-w-xs">Esto puede tardar unos segundos. Por favor, espera.</p>
             </div>
        )}


        {/* Step 3: Email Verification */}
        {step === 'verifyEmail' && companyDataForDisplay && ( // Use display data
          <>
             <h3 className="text-lg font-semibold border-b pb-2 mb-4 flex items-center gap-2"><MailCheck size={20} /> Verificar Correo Electrónico</h3>
            <Alert variant="info">
              <Info className="h-4 w-4" />
              <AlertTitle>Verificación de Contacto Requerida</AlertTitle>
              <AlertDescription>
                Se ha enviado un código de 6 dígitos a <strong>{companyDataForDisplay.contactEmail}</strong>. Ingrésalo a continuación para verificar la dirección de correo electrónico de contacto. (Mock: Usa 654321).
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
                  {/* FormMessage will only show after submit attempt */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MailCheck className="mr-2 h-4 w-4"/>}
              Verificar Código
            </Button>
             <Button type="button" variant="link" size="sm" onClick={() => { setStep('initial'); setErrorMessage(null); setHasAttemptedSubmit(false); }} disabled={isLoading} className="w-full mt-2 text-muted-foreground">
                Volver y corregir datos iniciales
            </Button>
          </>
        )}

        {/* Step 4: Create Password */}
        {step === 'password' && companyDataForDisplay && ( // Use display data
          <>
            <h3 className="text-lg font-semibold border-b pb-2 mb-4 flex items-center gap-2"><KeyRound size={20} /> Crear Contraseña</h3>
            <Alert variant="default">
              <KeyRound className="h-4 w-4" />
              <AlertTitle>Último Paso</AlertTitle>
              <AlertDescription>
                Crea una contraseña segura para la cuenta de la empresa. El nombre de usuario será el CUIT: <strong>{companyDataForDisplay.cuit.replace(/-/g, '')}</strong>.
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
                  {/* FormMessage will only show after submit attempt */}
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
                   {/* FormMessage will only show after submit attempt */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Building className="mr-2 h-4 w-4"/>}
              Completar Registro de Empresa
            </Button>
             <Button type="button" variant="link" size="sm" onClick={() => setStep('verifyEmail')} disabled={isLoading} className="w-full mt-2 text-muted-foreground">
                Volver a ingresar código de verificación
            </Button>
          </>
        )}

         {/* Step 5: Complete */}
         {step === 'complete' && companyDataForDisplay && ( // Use display data
             <Alert variant="success">
                 <CheckSquare className="h-4 w-4"/>
                <AlertTitle>¡Registro de Empresa Exitoso!</AlertTitle>
                <AlertDescription>
                    La cuenta para <strong>{companyDataForDisplay.companyName}</strong> ha sido creada. El nombre de usuario es el CUIT: <strong>{companyDataForDisplay.cuit.replace(/-/g, '')}</strong>.
                     Ahora serás redirigido/a.
                 </AlertDescription>
             </Alert>
         )}

         {/* Final Error State - Handled by the global error message logic at the top */}

      </form>
    </Form>
  );
}
