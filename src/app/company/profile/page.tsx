
'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
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
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Building, User, Mail, Phone, Link as LinkIcon, Briefcase, Home, Globe, Share2, Save, Edit, Info } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import Alert components

// --- localStorage Interaction ---
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

// --- Zod Schema for Editable Company Profile Data ---
// Define which fields from the registration are editable.
// For now, let's allow editing most descriptive fields and contact info.
// CUIT and companyName might be less frequently changed or require re-verification.
const companyProfileFormSchema = z.object({
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
  // Read-only fields (not included in schema for validation, but will be displayed)
  // companyName: z.string(),
  // cuit: z.string(),
});

type CompanyProfileFormData = z.infer<typeof companyProfileFormSchema>;

// Interface for the full company profile stored in localStorage
interface UserProfile {
  userType: 'company';
  companyName: string;
  cuit: string;
  // Include all fields from the schema, plus potentially read-only ones if needed elsewhere
  industry: string;
  address: string;
  workLocation: string;
  website?: string;
  socialMedia?: string;
  description?: string;
  contactName: string;
  contactRole: string;
  contactEmail: string;
  contactPhone?: string;
  username: string; // CUIT without hyphens
  // Password is not stored here
}


export default function CompanyProfilePage() {
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);


  const form = useForm<CompanyProfileFormData>({
    resolver: zodResolver(companyProfileFormSchema),
    defaultValues: {
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
    },
    mode: 'onBlur',
  });

  // --- Load Profile Data ---
  useEffect(() => {
    const loadProfile = () => {
        setIsLoading(true);
        const storedProfile = safeLocalStorageGet('userProfile');
        console.log("Loaded profile from localStorage:", storedProfile);
        if (storedProfile && storedProfile.userType === 'company') {
            const companyProfile = storedProfile as UserProfile;
            setUserProfile(companyProfile);
            // Populate form with loaded profile data (only editable fields)
            form.reset({
                industry: companyProfile.industry,
                address: companyProfile.address,
                workLocation: companyProfile.workLocation,
                website: companyProfile.website || '',
                socialMedia: companyProfile.socialMedia || '',
                description: companyProfile.description || '',
                contactName: companyProfile.contactName,
                contactRole: companyProfile.contactRole,
                contactEmail: companyProfile.contactEmail,
                contactPhone: companyProfile.contactPhone || '',
            });
        } else {
            console.warn("No company profile found in localStorage or userType mismatch.");
        }
        setIsLoading(false);
    };
    loadProfile();
  }, [form]);

  // --- Handle Form Submission (Save Changes) ---
  async function onSubmit(values: CompanyProfileFormData) {
    if (!userProfile) return;
    setIsLoading(true);
    setErrorMessage(null);
    console.log('Saving company profile updates:', values);

    // Simulate saving to backend/localStorage
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
        // Construct the updated profile, keeping read-only fields
        const updatedProfile: UserProfile = {
          ...userProfile, // Keep existing CUIT, companyName, username etc.
          ...values,     // Overwrite with new editable values
        };

        safeLocalStorageSet('userProfile', updatedProfile);
        setUserProfile(updatedProfile); // Update local state

        toast({
          title: 'Perfil Actualizado',
          description: 'Los cambios en el perfil de la empresa han sido guardados.',
          variant: 'success',
        });
        setIsEditing(false); // Exit editing mode
    } catch (error: any) {
         console.error("Profile update error:", error);
         setErrorMessage(error.message || 'No se pudo guardar el perfil.');
         toast({
             title: 'Error al Guardar',
             description: 'No se pudieron guardar los cambios en el perfil.',
             variant: 'destructive',
         });
    } finally {
         setIsLoading(false);
    }
  }

  // --- Render Logic ---
   if (isLoading && !userProfile) { // Show loader only if profile hasn't loaded yet
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex justify-center items-start pt-10">
         <Card className="w-full max-w-lg">
            <CardHeader>
                <CardTitle className="text-center">Perfil de Empresa no encontrado</CardTitle>
                <CardDescription className="text-center">
                    No pudimos cargar el perfil. Por favor, intenta iniciar sesión de nuevo.
                </CardDescription>
            </CardHeader>
             <CardContent className="flex justify-center">
                 <Button onClick={() => window.location.href = '/login'}>Ir a Iniciar Sesión</Button>
            </CardContent>
         </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Building /> Perfil de Empresa
            </CardTitle>
            <CardDescription>
              Visualiza y edita la información de {userProfile.companyName}.
            </CardDescription>
          </div>
          {!isEditing && (
            <Button variant="outline" onClick={() => setIsEditing(true)} disabled={isLoading}>
              <Edit className="mr-2" /> Editar Perfil
            </Button>
          )}
        </CardHeader>
        <CardContent>
           <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

               {/* Display Read-Only Info */}
               <section className="space-y-4">
                 <h3 className="text-xl font-semibold border-b pb-2 flex items-center gap-2">
                   <Info size={20} /> Información Principal
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-muted/50 p-4 rounded-md border">
                   <p><strong>Razón Social:</strong> {userProfile.companyName}</p>
                   <p><strong>CUIT:</strong> {userProfile.cuit}</p>
                   <p><strong>Usuario (Login):</strong> {userProfile.username}</p>
                 </div>
               </section>

               <Separator />

               {/* Editable Company Details Section */}
               <section className="space-y-6">
                    <h3 className="text-xl font-semibold border-b pb-2 mb-4 flex items-center gap-2">
                       <Briefcase size={20}/> Detalles de la Empresa
                    </h3>
                    <FormField control={form.control} name="industry" render={({ field }) => ( <FormItem> <FormLabel>Rubro / Actividad Principal</FormLabel> <FormControl><Input placeholder="Ej: Desarrollo de Software" {...field} disabled={!isEditing || isLoading} className={!isEditing ? "bg-muted/30 border-dashed" : ""}/></FormControl> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="address" render={({ field }) => ( <FormItem> <FormLabel>Domicilio Legal</FormLabel> <FormControl><Input placeholder="Av. Siempre Viva 742" {...field} disabled={!isEditing || isLoading} className={!isEditing ? "bg-muted/30 border-dashed" : ""}/></FormControl> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="workLocation" render={({ field }) => ( <FormItem> <FormLabel>Ubicación del Lugar de Trabajo</FormLabel> <FormControl><Input placeholder="Ej: Resistencia, Chaco / Remoto" {...field} disabled={!isEditing || isLoading} className={!isEditing ? "bg-muted/30 border-dashed" : ""}/></FormControl> <FormMessage /> </FormItem> )}/>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <FormField control={form.control} name="website" render={({ field }) => ( <FormItem> <FormLabel><LinkIcon size={14} className="inline mr-1"/> Sitio Web</FormLabel> <FormControl><Input type="url" placeholder="https://www.empresa.com" {...field} disabled={!isEditing || isLoading} className={!isEditing ? "bg-muted/30 border-dashed" : ""}/></FormControl> <FormMessage /> </FormItem> )}/>
                       <FormField control={form.control} name="socialMedia" render={({ field }) => ( <FormItem> <FormLabel><Share2 size={14} className="inline mr-1"/> Redes Sociales</FormLabel> <FormControl><Input placeholder="LinkedIn, Instagram..." {...field} disabled={!isEditing || isLoading} className={!isEditing ? "bg-muted/30 border-dashed" : ""}/></FormControl> <FormMessage /> </FormItem> )}/>
                    </div>

                   <FormField control={form.control} name="description" render={({ field }) => ( <FormItem> <FormLabel>Descripción de la Empresa</FormLabel> <FormControl><Textarea placeholder="Breve descripción..." {...field} disabled={!isEditing || isLoading} className={!isEditing ? "bg-muted/30 border-dashed resize-none" : "resize-none"} rows={4} /></FormControl> <FormMessage /> </FormItem> )}/>
               </section>

               <Separator />

               {/* Editable Contact Details Section */}
               <section className="space-y-6">
                    <h3 className="text-xl font-semibold border-b pb-2 mb-4 flex items-center gap-2">
                        <User size={20}/> Datos de Contacto (RRHH)
                    </h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <FormField control={form.control} name="contactName" render={({ field }) => ( <FormItem> <FormLabel>Nombre del Contacto</FormLabel> <FormControl><Input placeholder="María García" {...field} disabled={!isEditing || isLoading} className={!isEditing ? "bg-muted/30 border-dashed" : ""}/></FormControl> <FormMessage /> </FormItem> )}/>
                       <FormField control={form.control} name="contactRole" render={({ field }) => ( <FormItem> <FormLabel>Cargo del Contacto</FormLabel> <FormControl><Input placeholder="Responsable de RRHH" {...field} disabled={!isEditing || isLoading} className={!isEditing ? "bg-muted/30 border-dashed" : ""}/></FormControl> <FormMessage /> </FormItem> )}/>
                   </div>
                    <FormField control={form.control} name="contactEmail" render={({ field }) => ( <FormItem> <FormLabel>Correo Electrónico de Contacto</FormLabel> <FormControl><Input type="email" placeholder="rrhh@empresa.com" {...field} disabled={!isEditing || isLoading} className={!isEditing ? "bg-muted/30 border-dashed" : ""}/></FormControl> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="contactPhone" render={({ field }) => ( <FormItem> <FormLabel>Teléfono de Contacto</FormLabel> <FormControl><Input type="tel" placeholder="+54 9 11 1234-5678" {...field} disabled={!isEditing || isLoading} className={!isEditing ? "bg-muted/30 border-dashed" : ""}/></FormControl> <FormMessage /> </FormItem> )}/>
               </section>


              {/* Action Buttons */}
              {isEditing && (
                <div className="flex justify-end gap-4 pt-6 border-t mt-8">
                  <Button type="button" variant="outline" onClick={() => {
                      setIsEditing(false);
                      form.reset({ // Reset form to original editable data
                         industry: userProfile.industry,
                         address: userProfile.address,
                         workLocation: userProfile.workLocation,
                         website: userProfile.website || '',
                         socialMedia: userProfile.socialMedia || '',
                         description: userProfile.description || '',
                         contactName: userProfile.contactName,
                         contactRole: userProfile.contactRole,
                         contactEmail: userProfile.contactEmail,
                         contactPhone: userProfile.contactPhone || '',
                      });
                      setErrorMessage(null); // Clear any previous errors
                  }} disabled={isLoading}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 animate-spin" /> : <Save className="mr-2" />}
                    Guardar Cambios
                  </Button>
                </div>
              )}
               {/* Display error message if save fails */}
                {errorMessage && (
                    <Alert variant="destructive" className="mt-4">
                        <AlertTitle>Error al guardar</AlertTitle>
                        <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
