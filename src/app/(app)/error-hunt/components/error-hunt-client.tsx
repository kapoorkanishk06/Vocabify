'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import PassageDisplay from './passage-display';
import { Lightbulb, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  topic: z.string().min(2, 'Topic must be at least 2 characters.'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  passageLength: z.number().min(50).max(500),
});

type FormValues = z.infer<typeof formSchema>;

export default function ErrorHuntClient() {
  const { toast } = useToast();
  const [passage, setPassage] = useState<string | null>(null);
  const [suggestedErrors, setSuggestedErrors] = useState<string[] | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: 'The history of space exploration',
      difficulty: 'medium',
      passageLength: 150,
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: FormValues) {
    try {
      const response = await fetch('/api/error-hunt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'An unknown error occurred.');
      }

      setPassage(result.passage);
      setSuggestedErrors(result.suggestedErrors);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
      setPassage(null);
      setSuggestedErrors(null);
    }
  }
  
  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Game Settings</CardTitle>
            <CardDescription>
              Customize the passage you want to proofread.
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Topic</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., The life of bees" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Difficulty</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="passageLength"
                  render={({ field }) => (
                    <FormItem>
                       <FormLabel>Passage Length: {field.value} words</FormLabel>
                      <FormControl>
                        <Slider
                            min={50}
                            max={500}
                            step={10}
                            value={[field.value]}
                            onValueChange={(vals) => field.onChange(vals[0])}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
              </CardContent>
              <CardFooter>
                 <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Generate Passage
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>

      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Passage</CardTitle>
            <CardDescription>
              Click on words to mark potential errors. When you're done,
              submit your answers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {passage ? (
              <div className="space-y-4">
                {suggestedErrors && suggestedErrors.length > 0 && (
                  <Alert>
                    <Lightbulb className="h-4 w-4" />
                    <AlertTitle>Hints</AlertTitle>
                    <AlertDescription>
                      Look out for these types of errors:{' '}
                      {suggestedErrors.join(', ')}.
                    </AlertDescription>
                  </Alert>
                )}
                <PassageDisplay passage={passage} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground rounded-lg border border-dashed">
                Your generated passage will appear here.
              </div>
            )}
          </CardContent>
           {passage && (
            <CardFooter>
                <Button className="w-full" onClick={() => toast({ title: "Feedback not implemented yet."})}>Check Answers</Button>
            </CardFooter>
           )}
        </Card>
      </div>
    </div>
  );
}
