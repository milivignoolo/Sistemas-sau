
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


// --- Mock Authentication Function ---
async function authenticateUser(username: string, password: string) {
  console.log(`Attempting to authenticate user: ${username} with password: ${password}`);
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

  // Mock credentials (replace with actual backend verification)
  // Ensure these match the credentials used during mock registration
  const validStudent = { username: '12345', password: 'password123' }; // From student registration mock
  const validCompany = { username: '30-12345678-9', password: 'password123' }; // From company registration mock

  let isAuthenticated = false;
  let userType: 'student' | 'company' | 'unknown' = 'unknown';

  if (username === validStudent.username && password === validStudent.password) {
    isAuthenticated = true;
    userType = 'student';
  } else if (username === validCompany.username && password === validCompany.password) {
    isAuthenticated = true;
    userType = 'company';
  }

  if (isAuthenticated) {
    console.log(`Authentication successful for user: ${username}, Type: ${userType}`);
    return { success: true, userType: userType, username: username };
  } else {
    console.error(`Authentication failed for user: ${username}. Provided password: ${password}. Expected student pass: ${validStudent.password}, Expected company pass: ${validCompany.password}`);
    throw new Error('Usuario o contraseña incorrectos.');
  }
}

// --- Zod Schema ---
const formSchema = z.object({
  username: z.string().min(1, { message: 'El nombre de usuario (Legajo o CUIT) es requerido.' }),
  password: z.string().min(1, { message: 'La contraseña es requerida.' }),
});

export function LoginForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setErrorMessage(null);
    setLoginSuccess(false);

    try {
      const result = await authenticateUser(values.username, values.password);
      if (result.success) {
        toast({
          title: 'Inicio de Sesión Exitoso',
          description: `Bienvenido/a de nuevo, ${result.username}. (Tipo: ${result.userType === 'student' ? 'Estudiante' : 'Empresa'})`,
          // Removed success variant to use default style
        });
        setLoginSuccess(true);
        // TODO: Redirect to appropriate dashboard based on userType
        // e.g., router.push(result.userType === 'student' ? '/student/dashboard' : '/company/dashboard');
        // form.reset(); // Clear form on success - optional, might be better to leave it for viewing success message
      }
      // No explicit else needed because authenticateUser throws on failure
    } catch (error: any) {
      console.error("Login error:", error);
      setErrorMessage(error.message || 'Error al iniciar sesión.');
      // Optionally set error on a specific field, e.g., password
      // form.setError("password", { type: "manual", message: error.message || 'Error desconocido' });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {errorMessage && !loginSuccess && (
          <Alert variant="destructive">
            <Info className="h-4 w-4" />
            <AlertTitle>Error de Autenticación</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
         {loginSuccess && (
          // Using default alert style for success message
          <Alert variant="default" className="border-green-500/50 text-green-700 bg-green-50 dark:border-green-700 dark:text-green-300 dark:bg-green-950">
            <LogIn className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertTitle className="text-green-800 dark:text-green-200">¡Éxito!</AlertTitle>
            <AlertDescription className="text-green-700 dark:text-green-300">Has iniciado sesión correctamente. Serás redirigido en breve.</AlertDescription>
            {/* TODO: Add link to dashboard here later or implement redirect */}
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

