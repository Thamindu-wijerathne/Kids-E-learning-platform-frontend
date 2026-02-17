'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AVATARS, THEMES, PATTERNS, CustomizationItem } from '@/lib/customizations';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CustomizationDialogProps {
    totalScore: number;
    currentAvatar: string;
    currentTheme: string;
    onSelectAvatar: (value: string) => void;
    onSelectTheme: (value: string) => void;
    onSelectPattern: (value: string) => void;
    currentPattern: string;
}

export default function CustomizationDialog({
    totalScore,
    currentAvatar,
    currentTheme,
    currentPattern,
    onSelectAvatar,
    onSelectTheme,
    onSelectPattern,
}: CustomizationDialogProps) {
    const [open, setOpen] = useState(false);

    const renderItem = (item: CustomizationItem, isSelected: boolean, onSelect: (val: string) => void) => {
        const isLocked = totalScore < item.threshold;

        return (
            <Card
                key={item.id}
                className={`relative p-4 cursor-pointer transition-all border-2 ${isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-transparent'
                    } ${isLocked ? 'opacity-60 grayscale' : 'hover:border-primary/50'}`}
                onClick={() => !isLocked && onSelect(item.value)}
            >
                <div className="flex flex-col items-center gap-2">
                    {item.type === 'avatar' || item.type === 'pattern' ? (
                        <div className="text-4xl">{item.value}</div>
                    ) : (
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${item.value}`} />
                    )}
                    <span className="text-xs font-bold text-center">{item.name}</span>
                    {isLocked && (
                        <div className="text-[10px] text-destructive font-bold">
                            Unlock at {item.threshold.toLocaleString()}
                        </div>
                    )}
                </div>
                {isSelected && (
                    <div className="absolute top-1 right-1 bg-primary text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                        Selected
                    </div>
                )}
            </Card>
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-accent hover:brightness-110 text-accent-foreground font-bold rounded-xl">
                    Customize Look ✨
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto rounded-3xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                        Customize Your Hero 🎭
                    </DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="avatars" className="mt-4">
                    <TabsList className="grid w-full grid-cols-3 bg-secondary/10 p-1 rounded-xl">
                        <TabsTrigger value="avatars" className="rounded-lg font-bold">Avatars</TabsTrigger>
                        <TabsTrigger value="themes" className="rounded-lg font-bold">Themes</TabsTrigger>
                        <TabsTrigger value="patterns" className="rounded-lg font-bold">Patterns</TabsTrigger>
                    </TabsList>

                    <TabsContent value="avatars" className="mt-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {AVATARS.map((item) => renderItem(item, currentAvatar === item.value, onSelectAvatar))}
                        </div>
                    </TabsContent>

                    <TabsContent value="themes" className="mt-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {THEMES.map((item) => renderItem(item, currentTheme === item.value, onSelectTheme))}
                        </div>
                    </TabsContent>

                    <TabsContent value="patterns" className="mt-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {PATTERNS.map((item) => renderItem(item, currentPattern === item.value, onSelectPattern))}
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="mt-6 flex justify-end">
                    <Button onClick={() => setOpen(false)} className="rounded-xl font-bold">
                        Done! 🚀
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
