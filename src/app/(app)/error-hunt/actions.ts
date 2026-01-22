'use server';

import { generateErrorHuntPassage, ErrorHuntPassageInput } from '@/ai/flows/error-hunt-personalized';
import { z } from 'zod';

const formSchema = z.object({
  topic: z.string().min(2, { message: 'Topic must be at least 2 characters.' }),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  passageLength: z.coerce.number().min(50).max(500),
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
    let errorMessage = 'An unexpected error occurred on the server.';
    if (error instanceof Error) {
        // Check for specific API key-related error messages from the Google AI provider
        if (error.message.includes('API key not valid')) {
            errorMessage = 'The provided Gemini API key is not valid. Please check the key in your .env file.';
        } else if (error.message.includes('GEMINI_API_KEY') || error.message.includes('FAILED_PRECONDITION')) {
            errorMessage = 'The Gemini API key is missing. Please add your GEMINI_API_KEY to the .env file.';
        } else {
            errorMessage = error.message;
        }
    }
    return { message: errorMessage };
  }
}
