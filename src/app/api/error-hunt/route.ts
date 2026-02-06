import { z } from 'zod';
import { NextResponse } from 'next/server';

const formSchema = z.object({
  topic: z.string().min(2, { message: 'Topic must be at least 2 characters.' }),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  passageLength: z.coerce.number().min(50).max(500),
});

async function generateErrorHuntPassage(input: {
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  passageLength: number;
}) {
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
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
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
          responseMimeType: 'application/json',
          temperature: 0.7,
          maxOutputTokens: 800,
        },
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
  const functionCall = data.candidates?.[0]?.content?.parts?.[0]?.functionCall;
  if (!functionCall || !functionCall.args) {
    console.error('Invalid response from Gemini API:', JSON.stringify(data, null, 2));
    throw new Error('Gemini did not return the expected data structure.');
  }

  return functionCall.args;
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = formSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: 'Invalid form data.', issues: parsed.error.issues }, { status: 400 });
  }

  try {
    const result = await generateErrorHuntPassage(parsed.data);
    if (result && result.passage) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Failed to generate passage. The result was empty.' }, { status: 500 });
    }
  } catch (error) {
    console.error(error);
    let errorMessage = 'An unexpected error occurred on the server.';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
