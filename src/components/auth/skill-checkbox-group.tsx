
// src/components/auth/skill-checkbox-group.tsx
'use client';

import * as React from 'react';
import { Controller } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'; // Import FormDescription
import { cn } from '@/lib/utils'; // Import the cn utility function

// --- Component Logic ---
interface SkillCheckboxGroupProps {
    control: any;
    name: string; // Expect string for field name
    label: string;
    skills: { id: string; name: string }[];
    levels: string[];
    icon: React.ReactNode;
    description?: string; // Added optional description prop
    disabled?: boolean; // Added disabled prop
}

export function SkillCheckboxGroup({ control, name, label, skills, levels, icon, description, disabled }: SkillCheckboxGroupProps) {
    return (
        <FormField
            control={control}
            name={name} // Use the string name directly
            render={({ field }) => (
                <FormItem>
                    <FormLabel className={cn("text-lg font-semibold mb-3 flex items-center gap-2", disabled && "text-muted-foreground/70")}>{icon} {label}</FormLabel>
                    {description && <FormDescription className="mb-4">{description}</FormDescription>} {/* Display description */}
                    <div className="space-y-3">
                        {skills.map((skill) => (
                            <div key={skill.id} className={cn("flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 border p-3 rounded-md", disabled ? "bg-muted/20 border-dashed" : "bg-muted/50")}>
                                <div className="flex items-center space-x-2 flex-grow">
                                    <Checkbox
                                        id={`${name}-${skill.id}`}
                                        checked={!!field.value?.[skill.id]}
                                        onCheckedChange={(checked) => {
                                            if (disabled) return; // Prevent changes if disabled
                                            const currentSkills = { ...(field.value || {}) };
                                            if (checked) {
                                                currentSkills[skill.id] = levels[0]; // Default to first level
                                            } else {
                                                delete currentSkills[skill.id];
                                            }
                                            field.onChange(currentSkills);
                                        }}
                                        disabled={disabled} // Pass disabled state to Checkbox
                                    />
                                    <label
                                        htmlFor={`${name}-${skill.id}`}
                                        className={cn(
                                            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-grow",
                                            disabled && "text-muted-foreground/70"
                                        )}
                                    >
                                        {skill.name}
                                    </label>
                                </div>
                                {field.value?.[skill.id] && (
                                    <div className="w-full sm:w-48">
                                         <Select
                                            value={field.value[skill.id]}
                                            onValueChange={(level) => {
                                                if (disabled) return; // Prevent changes if disabled
                                                const currentSkills = { ...(field.value || {}) };
                                                currentSkills[skill.id] = level;
                                                field.onChange(currentSkills);
                                            }}
                                            disabled={disabled} // Pass disabled state to Select
                                        >
                                            <FormControl>
                                                {/* Add disabled styling to trigger */}
                                                <SelectTrigger disabled={disabled} className={cn(disabled ? "bg-muted/30 border-dashed" : "")}>
                                                    <SelectValue placeholder="Seleccionar nivel" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {levels.map((level) => (
                                                    <SelectItem key={level} value={level}>
                                                        {level}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
