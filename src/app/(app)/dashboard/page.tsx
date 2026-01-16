import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Puzzle, Replace, Search, SpellCheck, Workflow, Zap } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const gameModes = [
  {
    title: 'Error Hunt',
    description: 'Find grammar & vocabulary errors in AI-generated passages. A true test of your proofreading skills!',
    icon: <Search className="w-8 h-8" />,
    href: '/error-hunt',
    image: PlaceHolderImages.find(img => img.id === 'dashboard-error-hunt'),
    disabled: false,
  },
  {
    title: 'Grammar Puzzle Engine',
    description: 'Solve interactive grammar puzzles. Correct sentences and fix structures under constraints.',
    icon: <Puzzle className="w-8 h-8" />,
    href: '#',
    image: PlaceHolderImages.find(img => img.id === 'dashboard-grammar-puzzle'),
    disabled: true,
  },
  {
    title: 'Vocabulary Guessing Game',
    description: 'A Wordle-inspired game. Use clues and logic to guess words and expand your vocabulary.',
    icon: <SpellCheck className="w-8 h-8" />,
    href: '#',
    image: PlaceHolderImages.find(img => img.id === 'dashboard-vocab-game'),
    disabled: true,
  },
    {
    title: 'Sentence Flow Lab',
    description: 'Practice creating coherent and logical paragraphs by reordering sentences and clauses.',
    icon: <Workflow className="w-8 h-8" />,
    href: '#',
    image: PlaceHolderImages.find(img => img.id === 'dashboard-sentence-flow'),
    disabled: true,
  },
  {
    title: 'Story Mode',
    description: 'Embark on a narrative adventure where you solve challenges to advance the plot.',
    icon: <BookOpen className="w-8 h-8" />,
    href: '#',
    image: PlaceHolderImages.find(img => img.id === 'dashboard-story-mode'),
    disabled: true,
  },
    {
    title: 'Synonym & Usage',
    description: 'Go beyond definitions. Pick the perfect synonym based on nuanced sentence context.',
    icon: <Replace className="w-8 h-8" />,
    href: '#',
    image: PlaceHolderImages.find(img => img.id === 'dashboard-synonym-challenge'),
    disabled: true,
  },
    {
    title: 'Rapid-Fire Challenge',
    description: 'Test your speed and accuracy in timed, escalating mini-challenges.',
    icon: <Zap className="w-8 h-8" />,
    href: '#',
    image: PlaceHolderImages.find(img => img.id === 'dashboard-rapid-fire'),
    disabled: true,
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Welcome, Language Warrior!</h1>
        <p className="text-muted-foreground">Choose your challenge and start your quest.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gameModes.map((mode) => (
          <Card key={mode.title} className="flex flex-col group overflow-hidden">
            <div className="overflow-hidden">
                {mode.image && (
                    <Image
                    src={mode.image.imageUrl}
                    alt={mode.title}
                    data-ai-hint={mode.image.imageHint}
                    width={400}
                    height={200}
                    className="object-cover w-full h-40 transition-transform duration-300 group-hover:scale-105"
                    />
                )}
            </div>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-md text-primary">{mode.icon}</div>
                <CardTitle className="font-headline">{mode.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription>{mode.description}</CardDescription>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full" disabled={mode.disabled}>
                <Link href={mode.href}>
                  {mode.disabled ? 'Coming Soon' : 'Play Now'} <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
