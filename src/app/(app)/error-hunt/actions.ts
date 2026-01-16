'use server';

import { generateErrorHuntPassage, ErrorHuntPassageInput } from '@/ai/flows/error-hunt-personalized';
import { z } from 'zod';

const formSchema = z.object({
  topic: z.string().min(2, { message: 'Topic must be at least 2 characters.' }),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  passageLength: z.string().transform(Number),
});

export type FormState = {
  message: string;
  passage?: string;
  suggestedErrors?: string[];
  fields?: Record<string, string>;
  issues?: string[];
};

export async function createPassageAction(
  prevState: FormState,
  data: FormData
): Promise<FormState> {
  const formData = Object.fromEntries(data);
  const parsed = formSchema.safeParse(formData);

  if (!parsed.success) {
    const issues = parsed.error.issues.map((issue) => issue.message);
    return {
      message: 'Invalid form data.',
      issues,
      fields: {
        topic: data.get('topic')?.toString() ?? '',
      }
    };
  }
  
  const { topic, difficulty, passageLength } = parsed.data;

  try {
    const errorHuntInput: ErrorHuntPassageInput = {
      userProfile: {
        // This can be replaced with actual user data in the future
        weaknesses: [
          'Subject-verb agreement',
          'Comma splices',
          'Misplaced modifiers',
        ],
      },
      topic,
      difficulty,
      passageLength,
    };

    const result = await generateErrorHuntPassage(errorHuntInput);

    if (result && result.passage) {
      return {
        message: 'Passage generated successfully!',
        passage: result.passage,
        suggestedErrors: result.suggestedErrors,
      };
    } else {
      return { message: 'Failed to generate passage. The result was empty.' };
    }
  } catch (error) {
    console.error(error);
    return { message: 'An unexpected error occurred on the server.' };
  }
}
