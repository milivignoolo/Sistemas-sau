'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Search, RotateCcw } from 'lucide-react';

interface FilterProps {
  careers: { id: string; name: string }[];
  areas: { id: string; name: string }[];
}

export function InternshipFilters({ careers, areas }: FilterProps) {
  // TODO: Connect state and handlers for actual filtering
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCareer, setSelectedCareer] = React.useState('');
  const [selectedArea, setSelectedArea] = React.useState('');
  const [isRemote, setIsRemote] = React.useState(false);

  const handleApplyFilters = () => {
    console.log('Applying filters:', { searchTerm, selectedCareer, selectedArea, isRemote });
    // TODO: Trigger filter logic in parent component
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCareer('');
    setSelectedArea('');
    setIsRemote(false);
    console.log('Resetting filters');
     // TODO: Trigger filter reset logic in parent component
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
            <Search size={20} /> Filtrar Pasantías
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search by Keyword */}
        <div className="space-y-2">
          <Label htmlFor="search">Buscar por palabra clave</Label>
          <Input
             id="search"
             placeholder="Título, empresa..."
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter by Career */}
        <div className="space-y-2">
          <Label htmlFor="career">Carrera</Label>
          <Select value={selectedCareer} onValueChange={setSelectedCareer}>
            <SelectTrigger id="career">
              <SelectValue placeholder="Todas las carreras" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas las carreras</SelectItem>
              {careers.map((career) => (
                <SelectItem key={career.id} value={career.id}>
                  {career.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filter by Area */}
        <div className="space-y-2">
          <Label htmlFor="area">Área de Interés</Label>
           <Select value={selectedArea} onValueChange={setSelectedArea}>
            <SelectTrigger id="area">
              <SelectValue placeholder="Todas las áreas" />
            </SelectTrigger>
            <SelectContent>
               <SelectItem value="">Todas las áreas</SelectItem>
              {areas.map((area) => (
                <SelectItem key={area.id} value={area.id}>
                  {area.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

         {/* Filter by Location (Remote) */}
        <div className="flex items-center space-x-2 pt-2">
            <Checkbox
                id="remote"
                checked={isRemote}
                onCheckedChange={(checked) => setIsRemote(checked === true)}
            />
            <Label htmlFor="remote" className="font-medium">
                Solo pasantías remotas
            </Label>
        </div>


        {/* Action Buttons */}
        <div className="flex flex-col space-y-2 pt-4">
           <Button onClick={handleApplyFilters}>
             <Search className="mr-2 size-4" /> Aplicar Filtros
          </Button>
           <Button variant="outline" onClick={handleResetFilters}>
             <RotateCcw className="mr-2 size-4" /> Limpiar Filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

