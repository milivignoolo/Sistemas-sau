
'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Search, RotateCcw, GraduationCap, Clock, Languages, Target } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'; // Import RadioGroup

// Define match score levels
export type MatchScoreLevel = 'all' | 'low' | 'medium' | 'high' | 'perfect';

// Update FilterProps to include new filter options if needed from parent
interface FilterProps {
  careers: { id: string; name: string }[];
  areas: { id: string; name: string }[];
  // Add onFiltersChange prop
  onFiltersChange: (filters: FiltersState) => void;
  initialFilters?: FiltersState; // Optional initial state
}

// Define the state structure for all filters
export interface FiltersState {
    searchTerm: string;
    selectedCareer: string;
    selectedArea: string;
    isRemote: boolean;
    selectedYear: string;
    selectedDuration: string;
    selectedLanguage: string;
    matchScoreLevel: MatchScoreLevel;
}

// Mock data for new filters (replace or fetch if needed)
const yearOptions = ['any', '1', '2', '3', '4', '5', 'Graduado Reciente'];
const durationOptions = ['any', '1-3 meses', '4-6 meses', '6+ meses', 'Indefinido'];
const languageOptions = ['any', 'ingles', 'portugues', 'frances', 'aleman', 'italiano']; // Use IDs matching skill IDs

export function InternshipFilters({ careers, areas, onFiltersChange, initialFilters }: FilterProps) {

  // Initialize state with optional initialFilters or defaults
   const [filters, setFilters] = React.useState<FiltersState>(initialFilters || {
    searchTerm: '',
    selectedCareer: '',
    selectedArea: '',
    isRemote: false,
    selectedYear: 'any',
    selectedDuration: 'any',
    selectedLanguage: 'any',
    matchScoreLevel: 'all',
   });

  // Update handler to modify the filters state object
   const handleFilterChange = <K extends keyof FiltersState>(key: K, value: FiltersState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

   const handleApplyFilters = () => {
    console.log('Applying filters:', filters);
    onFiltersChange(filters); // Pass the current filters state up
  };

  const handleResetFilters = () => {
    const defaultFilters = {
        searchTerm: '',
        selectedCareer: '',
        selectedArea: '',
        isRemote: false,
        selectedYear: 'any',
        selectedDuration: 'any',
        selectedLanguage: 'any',
        matchScoreLevel: 'all',
    };
    setFilters(defaultFilters);
    console.log('Resetting filters');
    onFiltersChange(defaultFilters); // Pass the reset filters state up
  };

  // Effect to apply initial filters if they change (e.g., from URL params)
  React.useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters);
    }
  }, [initialFilters]);


  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
            <Search size={20} /> Filtrar Pasantías
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5"> {/* Increased spacing */}
        {/* Search by Keyword */}
        <div className="space-y-2">
          <Label htmlFor="search">Buscar por palabra clave</Label>
          <Input
             id="search"
             placeholder="Título, empresa..."
             value={filters.searchTerm}
             onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
          />
        </div>

         {/* Filter by Match Score */}
         <div className="space-y-3">
           <Label className="flex items-center gap-1"><Target size={16}/> Nivel de Coincidencia</Label>
           <RadioGroup
             value={filters.matchScoreLevel}
             onValueChange={(value) => handleFilterChange('matchScoreLevel', value as MatchScoreLevel)}
             className="flex flex-wrap gap-x-4 gap-y-2"
           >
             <div className="flex items-center space-x-2">
               <RadioGroupItem value="all" id="match-all" />
               <Label htmlFor="match-all" className="font-normal">Todas</Label>
             </div>
             <div className="flex items-center space-x-2">
               <RadioGroupItem value="low" id="match-low" />
               <Label htmlFor="match-low" className="font-normal">Baja (&lt;50%)</Label>
             </div>
             <div className="flex items-center space-x-2">
               <RadioGroupItem value="medium" id="match-medium" />
               <Label htmlFor="match-medium" className="font-normal">Media (50-89%)</Label>
             </div>
             <div className="flex items-center space-x-2">
               <RadioGroupItem value="high" id="match-high" />
               <Label htmlFor="match-high" className="font-normal">Alta (90-99%)</Label>
             </div>
             <div className="flex items-center space-x-2">
               <RadioGroupItem value="perfect" id="match-perfect" />
               <Label htmlFor="match-perfect" className="font-normal">Perfecta (100%)</Label>
             </div>
           </RadioGroup>
         </div>


        {/* Filter by Career */}
        <div className="space-y-2">
          <Label htmlFor="career" className="flex items-center gap-1"><GraduationCap size={16}/> Carrera</Label>
          <Select value={filters.selectedCareer} onValueChange={(value) => handleFilterChange('selectedCareer', value)}>
            <SelectTrigger id="career">
              <SelectValue placeholder="Todas las carreras" />
            </SelectTrigger>
            <SelectContent>
               <SelectItem value="">Todas las carreras</SelectItem> {/* Explicit "all" option */}
              {careers.map((career) => (
                <SelectItem key={career.id} value={career.id}>
                  {career.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filter by Year */}
        <div className="space-y-2">
          <Label htmlFor="year" className="flex items-center gap-1"><GraduationCap size={16}/> Año de Cursado</Label>
          <Select value={filters.selectedYear} onValueChange={(value) => handleFilterChange('selectedYear', value)}>
            <SelectTrigger id="year">
              <SelectValue placeholder="Cualquier año" />
            </SelectTrigger>
            <SelectContent>
              {yearOptions.map((year) => (
                <SelectItem key={year} value={year}>
                  {year === 'any' ? 'Cualquier año' : (year === 'Graduado Reciente' ? year : `${year}° Año`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filter by Area */}
        <div className="space-y-2">
          <Label htmlFor="area" className="flex items-center gap-1"><Search size={16}/> Área de Interés</Label>
           <Select value={filters.selectedArea} onValueChange={(value) => handleFilterChange('selectedArea', value)}>
            <SelectTrigger id="area">
              <SelectValue placeholder="Todas las áreas" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="">Todas las áreas</SelectItem> {/* Explicit "all" option */}
              {areas.map((area) => (
                <SelectItem key={area.id} value={area.id}>
                  {area.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

         {/* Filter by Duration */}
         <div className="space-y-2">
           <Label htmlFor="duration" className="flex items-center gap-1"><Clock size={16}/> Duración</Label>
           <Select value={filters.selectedDuration} onValueChange={(value) => handleFilterChange('selectedDuration', value)}>
             <SelectTrigger id="duration">
               <SelectValue placeholder="Cualquier duración" />
             </SelectTrigger>
             <SelectContent>
               {durationOptions.map((duration) => (
                 <SelectItem key={duration} value={duration}>
                   {duration === 'any' ? 'Cualquier duración' : duration}
                 </SelectItem>
               ))}
             </SelectContent>
           </Select>
         </div>

          {/* Filter by Language */}
          <div className="space-y-2">
            <Label htmlFor="language" className="flex items-center gap-1"><Languages size={16}/> Idioma Requerido</Label>
            <Select value={filters.selectedLanguage} onValueChange={(value) => handleFilterChange('selectedLanguage', value)}>
              <SelectTrigger id="language">
                <SelectValue placeholder="Cualquier idioma" />
              </SelectTrigger>
              <SelectContent>
                {languageOptions.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang === 'any' ? 'Cualquier idioma' : lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>


         {/* Filter by Location (Remote) */}
        <div className="flex items-center space-x-2 pt-2">
            <Checkbox
                id="remote"
                checked={filters.isRemote}
                onCheckedChange={(checked) => handleFilterChange('isRemote', checked === true)}
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
