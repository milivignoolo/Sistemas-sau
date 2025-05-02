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
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Briefcase } from 'lucide-react';

// Define Zod schema for validation
const formSchema = z.object({
  title: z.string().min(5, { message: 'El título debe tener al menos 5 caracteres.' }),
  description: z.string().min(20, { message: 'La descripción debe tener al menos 20 caracteres.' }),
  requirements: z.string().optional(),
  location: z.string().min(3, { message: 'La ubicación es requerida.' }),
  isRemote: z.boolean().default(false),
  career: z.string().min(1, { message: 'Debes seleccionar una carrera objetivo.' }),
  area: z.string().min(1, { message: 'Debes seleccionar un área.' }),
  duration: z.string().optional(), // e.g., "3 meses", "6 meses"
  compensation: z.string().optional(), // e.g., "Remunerada", "No remunerada", "$XXXX ARS"
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
    {id: 'otro', name: 'Otro'},
];


export default function PostInternshipPage() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      requirements: '',
      location: '',
      isRemote: false,
      career: '',
      area: '',
      duration: '',
      compensation: '',
    },
  });

   // Define submit handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    // TODO: Implement actual internship posting logic (e.g., API call)
    // Assume authentication context provides company ID
    console.log('New Internship Data:', values);
     // Simulate API call success
    toast({
      title: 'Pasantía Publicada',
      description: 'La nueva oferta de pasantía ha sido publicada exitosamente.',
    });
     // Optionally reset the form or redirect
     // form.reset();
     // router.push('/company/dashboard'); // Example redirect
  }

  return (
    <div className="max-w-3xl mx-auto">
       <Card>
        <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
                <Briefcase /> Publicar Nueva Pasantía
            </CardTitle>
            <CardDescription>
                Completa los detalles de la oferta de pasantía para encontrar al candidato ideal.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título de la Pasantía</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Pasantía en Desarrollo Frontend" {...field} />
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
                      <FormLabel>Descripción Detallada</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe las tareas, responsabilidades, el equipo, la cultura de la empresa, etc."
                          rows={5}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Sé claro y conciso para atraer a los candidatos adecuados.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="requirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Requisitos (Opcional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Conocimientos específicos, herramientas, nivel de inglés, materias aprobadas, etc."
                           rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                    <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Ubicación</FormLabel>
                        <FormControl>
                            <Input placeholder="Ej: Resistencia, Chaco / Remoto" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="isRemote"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-end space-x-3 space-y-0 pb-2">
                        <FormControl>
                            <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                            <FormLabel>
                                Es 100% Remota
                            </FormLabel>
                        </div>
                        </FormItem>
                    )}
                    />
                </div>


                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <FormField
                        control={form.control}
                        name="career"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Carrera Objetivo</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona la carrera" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {careers.map((career) => (
                                    <SelectItem key={career.id} value={career.id}>
                                    {career.name}
                                    </SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                     <FormField
                        control={form.control}
                        name="area"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Área de la Pasantía</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona el área" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {areas.map((area) => (
                                    <SelectItem key={area.id} value={area.id}>
                                    {area.name}
                                    </SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Duración (Opcional)</FormLabel>
                        <FormControl>
                            <Input placeholder="Ej: 3 meses, 6 meses" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                     <FormField
                    control={form.control}
                    name="compensation"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Compensación (Opcional)</FormLabel>
                        <FormControl>
                            <Input placeholder="Ej: Remunerada, $150.000 ARS" {...field} />
                        </FormControl>
                         <FormDescription>
                            Indica si la pasantía es remunerada y el monto si aplica.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                 </div>


                <Button type="submit" className="w-full">Publicar Pasantía</Button>
              </form>
            </Form>
         </CardContent>
       </Card>
    </div>
  );
}
