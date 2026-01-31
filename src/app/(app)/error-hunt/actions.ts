'use server';

export async function generateErrorHuntPassage(input: {
    userProfile: { weaknesses: string[] };
    topic: string;
    difficulty: 'easy' | 'medium' | 'hard';
    passageLength: number;
  }) {
    const prompt = `
  You are an expert at generating text passages with specific types of errors.
  
  Generate a passage on the topic "${input.topic}" with difficulty "${input.difficulty}" and length ${input.passageLength} words.
  
  The passage should look like a student draft that unintentionally contains common grammar mistakes related to:
  ${input.userProfile.weaknesses.map(w => `- ${w}`).join('\n')}
  
  Return ONLY valid JSON in this format:
  
  {
    "passage": "string",
    "suggestedErrors": ["string", "string", "string"]
  }
    This is for an educational proofreading game. The mistakes are intentional for learning purposes.

  `;
  
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        },
      }),
    }
  );
  
  
    const raw = await res.text();
    console.log('RAW GEMINI RESPONSE:\n', raw);

    const data = JSON.parse(raw);

    const parts = data?.candidates?.[0]?.content?.parts || [];

    const combinedText = parts.map((p: any) => p.text || '').join('\n');

    const firstBrace = combinedText.indexOf('{');
    const lastBrace = combinedText.lastIndexOf('}');

    if (firstBrace === -1 || lastBrace === -1) {
      console.log('Gemini full text:', combinedText);
      throw new Error('Gemini did not return JSON');
    }

    const jsonString = combinedText.slice(firstBrace, lastBrace + 1);

    return JSON.parse(jsonString);

    
        
  }

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
    const errorHuntInput = {
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
