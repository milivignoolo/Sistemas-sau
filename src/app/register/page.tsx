
'use client';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StudentRegistrationForm } from '@/components/auth/student-registration-form';
import { CompanyRegistrationForm } from '@/components/auth/company-registration-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('type') === 'company' ? 'company' : 'student';
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState(defaultTab);


  const handleStudentRegisterSuccess = () => {
    toast({
        title: 'Registro Estudiante Completo',
        description: 'Tu cuenta ha sido creada. Serás redirigido/a a la página principal.',
        variant: 'success',
    });
    router.push('/'); // Redirect to home page
  };

  const handleCompanyRegisterSuccess = () => {
     toast({
        title: 'Registro Empresa Completo',
        description: 'La cuenta de la empresa ha sido creada. Serás redirigido/a a la página principal.',
        variant: 'success',
    });
    router.push('/'); // Redirect to home page
  };


  return (
    <div className="flex justify-center items-start pt-10">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-lg">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="student">Soy Estudiante</TabsTrigger>
          <TabsTrigger value="company">Soy Empresa</TabsTrigger>
        </TabsList>
        <TabsContent value="student">
          <Card>
            <CardHeader>
              <CardTitle>Registro de Estudiante</CardTitle>
              <CardDescription>Completa tus datos para acceder a las pasantías.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Pass the callback function */}
              <StudentRegistrationForm onRegisterSuccess={handleStudentRegisterSuccess} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Registro de Empresa</CardTitle>
              <CardDescription>Registra tu empresa para publicar ofertas de pasantías.</CardDescription>
            </CardHeader>
            <CardContent>
             {/* Pass the callback function */}
             <CompanyRegistrationForm onRegisterSuccess={handleCompanyRegisterSuccess} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
