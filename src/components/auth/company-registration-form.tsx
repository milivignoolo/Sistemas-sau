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
import { Textarea } from '@/components/ui/textarea'; // Import Textarea
import { useToast } from '@/hooks/use-toast';

// Define Zod schema for validation
const formSchema = z.object({
  companyName: z.string().min(2, { message: 'El nombre de la empresa debe tener al menos 2 caracteres.' }),
  cuit: z.string().regex(/^\d{2}-\d{8}-\d{1}$/, { message: 'Formato de CUIT inválido (XX-XXXXXXXX-X).' }),
  contactName: z.string().min(2, { message: 'El nombre de contacto debe tener al menos 2 caracteres.' }),
  contactEmail: z.string().email({ message: 'Debe ser un correo electrónico válido.' }),
  contactPhone: z.string().optional(), // Optional phone number
  address: z.string().optional(), // Optional address
  description: z.string().optional(), // Optional company description
  password: z.string().min(8, { message: 'La contraseña debe tener al menos 8 caracteres.' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden.',
  path: ['confirmPassword'], // Set the error path to confirmPassword field
});

export function CompanyRegistrationForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: '',
      cuit: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      address: '',
      description: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Define submit handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    // TODO: Implement actual registration logic (e.g., API call)
    console.log('Company Registration Data:', values);
     // Simulate API call success
    toast({
      title: 'Registro Exitoso',
      description: 'La cuenta de la empresa ha sido creada.',
    });
     // Optionally reset the form
    // form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la Empresa</FormLabel>
                  <FormControl>
                    <Input placeholder="Tecno Soluciones S.A." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cuit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CUIT</FormLabel>
                  <FormControl>
                    <Input placeholder="30-12345678-9" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="contactName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del Contacto RRHH</FormLabel>
                <FormControl>
                  <Input placeholder="María García" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            />
             <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo Electrónico de Contacto</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="rrhh@tecnosoluciones.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>

         <FormField
          control={form.control}
          name="contactPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono de Contacto (Opcional)</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="+54 9 11 1234-5678" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dirección (Opcional)</FormLabel>
              <FormControl>
                <Input placeholder="Av. Siempre Viva 742, Springfield" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

         <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción de la Empresa (Opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Breve descripción de la empresa, su rubro, cultura, etc."
                  className="resize-none" // Prevent resizing
                  {...field}
                />
              </FormControl>
               <FormDescription>
                 Esta descripción ayudará a los estudiantes a conocer mejor tu empresa.
              </FormDescription>
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
                <Input type="password" placeholder="********" {...field} />
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
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">Registrar Empresa</Button>
      </form>
    </Form>
  );
}
