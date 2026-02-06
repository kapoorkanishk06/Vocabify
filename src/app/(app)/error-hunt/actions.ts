'use server';

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

async function generateErrorHuntPassage(input: {
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  passageLength: number;
}) {
  // Note: The `weaknesses` are hardcoded here for simplicity.
  // In a real application, this would likely come from the user's profile.
  const weaknesses = [
    'Subject-verb agreement',
    'Comma splices',
    'Misplaced modifiers',
  ];

  const prompt = `
You are an expert at generating text passages with specific types of errors.

Generate a passage on the topic "${input.topic}" with difficulty "${input.difficulty}" and length ${input.passageLength} words.

The passage should look like a student draft that unintentionally contains common grammar mistakes related to:
${weaknesses.map((w) => `- ${w}`).join('\n')}

Return the passage and a list of the errors you included.
`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          // Instruct the API to return a JSON object
          responseMimeType: 'application/json',
          temperature: 0.7,
          maxOutputTokens: 800,
        },
        // Define the JSON schema for the API to follow
        toolConfig: {
          functionCallingConfig: {
            mode: 'ANY',
            allowedFunctionNames: ['outputPassage'],
          },
        },
        tools: [
          {
            functionDeclarations: [
              {
                name: 'outputPassage',
                description: 'Outputs the generated passage and suggested errors.',
                parameters: {
                  type: 'OBJECT',
                  properties: {
                    passage: {
                      type: 'STRING',
                      description: 'The generated text passage.',
                    },
                    suggestedErrors: {
                      type: 'ARRAY',
                      items: {
                        type: 'STRING',
                      },
                      description: 'A list of the grammatical errors included in the passage.',
                    },
                  },
                  required: ['passage', 'suggestedErrors'],
                },
              },
            ],
          },
        ],
      }),
    }
  );

  if (!res.ok) {
    const error = await res.json();
    console.error('Gemini API Error:', error);
    throw new Error(`Gemini API request failed: ${error.error?.message}`);
  }

  const data = await res.json();

  // Extract the function call arguments, which will be our JSON object
  const functionCall = data.candidates?.[0]?.content?.parts?.[0]?.functionCall;
  if (!functionCall || !functionCall.args) {
    console.error('Invalid response from Gemini API:', JSON.stringify(data, null, 2));
    throw new Error('Gemini did not return the expected data structure.');
  }

  // The arguments are already a JSON object, no need for JSON.parse()
  return functionCall.args;
}

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
      },
    };
  }

  try {
    const result = await generateErrorHuntPassage(parsed.data);

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
      if (error.message.includes('API key not valid')) {
        errorMessage =
          'The provided Gemini API key is not valid. Please check your .env.local file.';
      } else if (error.message.includes('GEMINI_API_KEY')) {
        errorMessage =
          'The Gemini API key is missing. Please add GEMINI_API_KEY to your .env.local file.';
      } else {
        errorMessage = error.message;
      }
    }
    return { message: errorMessage };
  }
}
