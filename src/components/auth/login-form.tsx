
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
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, LogIn, Info } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { safeLocalStorageGet, safeLocalStorageSet } from '@/lib/local-storage'; // Import safe functions


// --- Mock Authentication Function ---
// Mock Student Profile structure (align with registration form for match score)
interface StudentProfile {
    username: string; // Legajo
    userType: 'student';
    password?: string; // Include password for the mock data itself
    career: string; // Career ID like 'sistemas'
    currentYear: number;
    profile?: { // Nested profile object similar to registration
        technicalSkills?: { [key: string]: string }; // { 'react': 'Intermedio', ... }
        softSkills?: { [key: string]: string };
        languages?: { [key: string]: string };
    };
    appliedInternships?: string[]; // Added: Array of applied internship IDs
}

interface CompanyProfile {
    username: string; // CUIT (no dashes)
    userType: 'company';
    password?: string; // Include password for the mock data itself
    companyName?: string; // Add company name for display/context if needed
    // Add other company-specific fields if necessary
}

// This function simulates backend authentication.
// In a real app, this would be an API call.
async function authenticateUser(username: string, password: string): Promise<{ success: boolean, userType: 'student' | 'company', username: string, profileData: StudentProfile | CompanyProfile }> {
  console.log(`Attempting to authenticate user: ${username} with password: ${password}`);
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

  let isAuthenticated = false;
  let userType: 'student' | 'company' | 'unknown' = 'unknown';
  let foundProfile: StudentProfile | CompanyProfile | null = null;

  // --- MOCK USER CHECK (Prioritized for Testing) ---
  // Ensure mock student has appliedInternships array
  const validStudent: StudentProfile = {
      username: '12345', // Legajo
      password: 'password123',
      userType: 'student',
      career: 'sistemas', // Match career ID used in internship data
      currentYear: 4,
      profile: {
          technicalSkills: { javascript: 'Intermedio', react: 'Básico', git: 'Intermedio', nodejs: 'Básico' },
          softSkills: { teamwork: 'Desarrollado', communication: 'Fuerte', learning: 'Fuerte' },
          languages: { english: 'Intermedio (B1/B2)' },
      },
      appliedInternships: [], // Initialize empty array
  };
   // Ensure mock company username matches the one used for testing in registration
  const validCompany: CompanyProfile = {
      username: '30123456789', // CUIT without dashes - MATCHES REGISTRATION MOCK
      password: 'password123',
      userType: 'company',
      companyName: 'Tecno Soluciones S.A. (Mock)' // Example name
  };

  console.log(`Comparing with MOCK Student: User='${validStudent.username}', Pass='${validStudent.password}'`);
  // Username from form is already normalized (no dashes for CUIT)
  if (username === validStudent.username && password === validStudent.password) {
    isAuthenticated = true;
    userType = 'student';
    foundProfile = validStudent; // Use detailed mock student data
    console.log("Matched MOCK student user.");
  } else {
      console.log(`Comparing with MOCK Company: User='${validCompany.username}', Pass='${validCompany.password}'`);
      if (username === validCompany.username && password === validCompany.password) {
        isAuthenticated = true;
        userType = 'company';
        foundProfile = validCompany; // Use mock company data
        console.log("Matched MOCK company user.");
      } else {
          console.log("Input does not match MOCK credentials.");
      }
  }

  // --- LOCALSTORAGE CHECK (If not matched by mock credentials) ---
  if (!isAuthenticated) {
      console.log("Checking credentials against localStorage profile...");
      const storedUserProfile = safeLocalStorageGet('userProfile');
      console.log("Stored profile:", storedUserProfile);

      if (storedUserProfile) {
          // Ensure username comparison accounts for CUIT (no dashes) vs Legajo
          const normalizedStoredUsername = storedUserProfile.username?.replace?.(/-/g, '') || storedUserProfile.username;
          // Username passed in is already normalized
          const normalizedInputUsername = username;

          console.log(`Comparing input: ${normalizedInputUsername} with stored: ${normalizedStoredUsername}`);
          console.log(`Comparing password input: ${password} with stored: ${storedUserProfile.password}`);

          if (normalizedStoredUsername === normalizedInputUsername && storedUserProfile.password === password) {
              isAuthenticated = true;
              userType = storedUserProfile.userType as 'student' | 'company';
              // Make sure appliedInternships is initialized if missing from stored profile
              if (userType === 'student' && !storedUserProfile.appliedInternships) {
                  storedUserProfile.appliedInternships = [];
              }
              foundProfile = storedUserProfile; // Use the stored profile
              console.log("Credentials match stored localStorage profile!");
          } else {
              console.log("Credentials do NOT match stored localStorage profile.");
          }
      } else {
          console.log("No user profile found in localStorage.");
      }
  }


  if (isAuthenticated && (userType === 'student' || userType === 'company') && foundProfile) {
    console.log(`Authentication successful for user: ${username}, Type: ${userType}`);

    // Prepare profile data for saving (remove password)
    const profileToSave = { ...foundProfile };
    delete profileToSave.password; // Remove password before saving

     // Ensure appliedInternships is an array when saving student profile
     if (profileToSave.userType === 'student' && !Array.isArray((profileToSave as StudentProfile).appliedInternships)) {
        (profileToSave as StudentProfile).appliedInternships = [];
     }

    // Save the authenticated user's profile (overwrites any existing session)
    safeLocalStorageSet('userProfile', profileToSave);
    console.log("Saved authenticated profile (without password) to localStorage:", profileToSave);

    // Return success and profile data (needed for redirect/UI updates)
    return { success: true, userType: userType, username: username, profileData: profileToSave };
  } else {
    console.error(`Authentication failed for user: ${username}.`); // This log will still appear if both mock and stored fail
    throw new Error('Usuario o contraseña incorrectos.');
  }
}


// --- Zod Schema ---
// Adjusted regex to handle CUIT with or without hyphens for input, but store/check without
const usernameSchema = z.string().refine(
  (val) => /^\d{1,6}$/.test(val) || /^\d{2}-?\d{8}-?\d{1}$/.test(val) || /^\d{11}$/.test(val),
  {
    message: "El usuario debe ser un legajo (1-6 dígitos) o CUIT (11 dígitos, con o sin guiones).",
  }
);


const formSchema = z.object({
  username: usernameSchema,
  password: z.string().min(1, { message: 'La contraseña es requerida.' }),
});

export function LoginForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false); // Track submit attempt
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
    mode: 'onSubmit', // Validate only on submit
    reValidateMode: 'onChange', // Re-validate on change after first submit
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setErrorMessage(null);
    setLoginSuccess(false);
    setHasAttemptedSubmit(true); // Mark that a submit attempt has been made

    // Normalize username: remove hyphens if it looks like a CUIT
    const normalizedUsername = /^\d{2}-?\d{8}-?\d{1}$/.test(values.username) || /^\d{11}$/.test(values.username)
        ? values.username.replace(/-/g, '')
        : values.username;

    try {
      // Pass the normalized username for authentication check
      const result = await authenticateUser(normalizedUsername, values.password);
      if (result.success) {
        toast({
          title: 'Inicio de Sesión Exitoso',
          description: `Bienvenido/a. (Tipo: ${result.userType === 'student' ? 'Estudiante' : 'Empresa'})`,
          variant: 'success', // Use success variant
        });
        setLoginSuccess(true);

        // Force a page reload after successful login to update header state reliably
        // This ensures the header reflects the logged-in user immediately.
        window.location.href = result.userType === 'student' ? '/internships' : '/post-internship';


        // Redirect based on user type (commented out in favor of page reload)
        // if (result.userType === 'student') {
        //   router.push('/internships'); // Redirect student to internships list
        // } else if (result.userType === 'company') {
        //    router.push('/post-internship'); // Redirect company to post internship page
        // }
        // router.refresh(); // Refresh router state - might not be enough for header
      }
      // No explicit else needed because authenticateUser throws on failure
    } catch (error: any) {
      console.error("Login error caught in onSubmit:", error);
      setErrorMessage(error.message || 'Error al iniciar sesión.');
      // Trigger validation again on error to show messages if needed
      // form.trigger(); // Maybe not needed if reValidateMode is onChange
    } finally {
      setIsLoading(false);
    }
  }

  // Check if user is already logged in on mount (client-side)
   React.useEffect(() => {
    const user = safeLocalStorageGet('userProfile');
    if (user) {
      // Optional: Display a message or disable the form if already logged in
      // console.log("User already logged in:", user);
      // setLoginSuccess(true); // Indicate success state if already logged in
      // setErrorMessage("Ya has iniciado sesión. Cierra sesión para ingresar con otra cuenta.");
    }
  }, []);


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Show error message only if there was a submit attempt and an error occurred */}
        {hasAttemptedSubmit && errorMessage && !loginSuccess && (
          <Alert variant="destructive">
            <Info className="h-4 w-4" />
            <AlertTitle>Error de Autenticación</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
         {loginSuccess && (
          <Alert variant="success"> {/* Use success variant */}
            <LogIn className="h-4 w-4" />
            <AlertTitle>¡Éxito!</AlertTitle>
            <AlertDescription>Has iniciado sesión correctamente. Serás redirigido en breve.</AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Usuario (Legajo o CUIT)</FormLabel>
              <FormControl>
                <Input placeholder="Tu legajo o CUIT" {...field} disabled={isLoading || loginSuccess} />
              </FormControl>
              {/* FormMessage will only show after submit attempt due to mode: 'onSubmit' */}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} disabled={isLoading || loginSuccess} />
              </FormControl>
              {/* FormMessage will only show after submit attempt */}
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading || loginSuccess}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
          Ingresar
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          ¿No tienes una cuenta?{' '}
          <Link href="/register" className="text-primary hover:underline">
            Regístrate aquí
          </Link>
        </div>
        {/* Optional: Add Forgot Password link */}
        {/* <div className="text-center text-sm">
          <Button variant="link" size="sm" className="text-muted-foreground px-0">
            ¿Olvidaste tu contraseña?
          </Button>
        </div> */}
      </form>
    </Form>
  );
}
