'use server';

/**
 * @fileOverview Personalized Error Hunt mode AI agent.
 *
 * - generateErrorHuntPassage - A function that generates a passage with errors based on user's weak points.
 * - ErrorHuntPassageInput - The input type for the generateErrorHuntPassage function.
 * - ErrorHuntPassageOutput - The return type for the generateErrorHuntPassage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ErrorHuntPassageInputSchema = z.object({
  userProfile: z
    .object({
      weaknesses: z
        .array(z.string())
        .describe("A list of grammar, usage, or vocabulary error types the user commonly makes."),
    })
    .describe("The user's profile, including their identified weaknesses."),
  topic: z.string().describe('The topic of the passage to generate.'),
  difficulty: z
    .enum(['easy', 'medium', 'hard'])
    .describe('The difficulty level of the passage.'),
  passageLength: z
    .number()
    .min(50)
    .max(500)
    .describe('The desired length of the passage in words.'),
});
export type ErrorHuntPassageInput = z.infer<typeof ErrorHuntPassageInputSchema>;

const ErrorHuntPassageOutputSchema = z.object({
  passage: z
    .string()
    .describe('A passage of text containing errors tailored to the user profile.'),
  suggestedErrors: z
    .array(z.string())
    .describe('A list of errors suggested for the user to find in this passage.'),
});
export type ErrorHuntPassageOutput = z.infer<typeof ErrorHuntPassageOutputSchema>;

export async function generateErrorHuntPassage(
  input: ErrorHuntPassageInput
): Promise<ErrorHuntPassageOutput> {
  return errorHuntPassageFlow(input);
}

const errorHuntPassagePrompt = ai.definePrompt({
  name: 'errorHuntPassagePrompt',
  input: {schema: ErrorHuntPassageInputSchema},
  output: {schema: ErrorHuntPassageOutputSchema},
  prompt: `You are an expert at generating text passages with specific types of errors.

  Generate a passage on the topic of "{{topic}}" with a difficulty level of "{{difficulty}}" and a length of "{{passageLength}}" words.

  The passage should contain errors that focus on the following weaknesses of the user:
  {{#each userProfile.weaknesses}}
  - {{{this}}}
  {{/each}}

  Return the passage and suggest the type of errors that were added to the passage. Do not reveal the actual error locations.

  Make the errors subtle but noticeable.  Do not include an explanation. Only the passage and the suggested error array is required.
  `,
});

const errorHuntPassageFlow = ai.defineFlow(
  {
    name: 'errorHuntPassageFlow',
    inputSchema: ErrorHuntPassageInputSchema,
    outputSchema: ErrorHuntPassageOutputSchema,
  },
  async input => {
    const {output} = await errorHuntPassagePrompt(input);
    if (!output) {
      throw new Error(
        'The AI model returned an empty response. This could be due to a configuration issue or content safety filters.'
      );
    }
    return output;
  }
);
