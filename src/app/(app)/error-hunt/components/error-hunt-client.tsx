'use client';

import { useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useActionState, useEffect } from 'react';
import { createPassageAction, FormState } from '../actions';
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

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Generate Passage
    </Button>
  );
}

export default function ErrorHuntClient() {
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: 'The history of space exploration',
      difficulty: 'medium',
      passageLength: 150,
    },
  });

  const [state, formAction] = useActionState<FormState, FormData>(createPassageAction, {
    message: '',
  });

  useEffect(() => {
    if (state.message && state.message !== 'Passage generated successfully!') {
      toast({
        variant: "destructive",
        title: "Error",
        description: state.message,
      });
    }
  }, [state, toast]);

  const onFormSubmit = (data: FormValues) => {
    const formData = new FormData();
    formData.append('topic', data.topic);
    formData.append('difficulty', data.difficulty);
    formData.append('passageLength', String(data.passageLength));
    formAction(formData);
  };
  

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
            <form onSubmit={form.handleSubmit(onFormSubmit)}>
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
                 <SubmitButton />
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
            {state?.passage ? (
              <div className="space-y-4">
                {state.suggestedErrors && state.suggestedErrors.length > 0 && (
                  <Alert>
                    <Lightbulb className="h-4 w-4" />
                    <AlertTitle>Hints</AlertTitle>
                    <AlertDescription>
                      Look out for these types of errors:{' '}
                      {state.suggestedErrors.join(', ')}.
                    </AlertDescription>
                  </Alert>
                )}
                <PassageDisplay passage={state.passage} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground rounded-lg border border-dashed">
                Your generated passage will appear here.
              </div>
            )}
          </CardContent>
           {state.passage && (
            <CardFooter>
                <Button className="w-full" onClick={() => toast({ title: "Feedback not implemented yet."})}>Check Answers</Button>
            </CardFooter>
           )}
        </Card>
      </div>
    </div>
  );
}
