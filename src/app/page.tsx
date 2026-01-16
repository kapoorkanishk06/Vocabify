import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BookOpen,
  Puzzle,
  Replace,
  Search,
  SpellCheck,
  Workflow,
  Zap,
} from 'lucide-react';

const featureCards = [
  {
    icon: <Puzzle className="w-8 h-8 text-primary" />,
    title: 'Grammar Puzzle Engine',
    description: 'Interactive grammar challenges presented as engaging puzzles.',
  },
  {
    icon: <SpellCheck className="w-8 h-8 text-primary" />,
    title: 'Vocabulary Guessing Game',
    description: 'Guess words with visual clues and hints, inspired by Wordle.',
  },
  {
    icon: <Workflow className="w-8 h-8 text-primary" />,
    title: 'Sentence Flow Lab',
    description: 'Reorder sentences to form logical paragraphs and improve clarity.',
  },
  {
    icon: <Search className="w-8 h-8 text-primary" />,
    title: 'Error Hunt Mode',
    description: 'Scan passages to find grammar and vocabulary errors against the clock.',
  },
  {
    icon: <BookOpen className="w-8 h-8 text-primary" />,
    title: 'Story Mode',
    description: 'Learn contextually with challenges embedded in a continuous story.',
  },
  {
    icon: <Replace className="w-8 h-8 text-primary" />,
    title: 'Synonym & Usage Challenge',
    description: 'Choose the right word based on sentence context, not just definitions.',
  },
];

const Logo = () => (
  <div className="bg-primary text-primary-foreground font-bold text-2xl w-10 h-10 flex items-center justify-center rounded-lg font-headline">
    V
  </div>
);

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <Link href="#" className="flex items-center justify-center gap-2">
          <Logo />
          <span className="text-xl font-bold font-headline">Vocabify</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/dashboard">
            <Button>Get Started</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-primary/10">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Unlock Your Language Genius
                  </h1>
                  <p className="max-w-[600px] text-foreground/80 md:text-xl">
                    Vocabify transforms language learning into an exciting
                    adventure. Master grammar, expand your vocabulary, and
                    perfect your writing through fun, interactive games.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/dashboard">
                    <Button size="lg">Start Your Quest</Button>
                  </Link>
                </div>
              </div>
              <Image
                src="https://picsum.photos/seed/1/600/600"
                data-ai-hint="brain puzzle"
                width="600"
                height="600"
                alt="Hero"
                className="mx-auto aspect-square overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-accent/20 px-3 py-1 text-sm text-accent-foreground font-semibold">
                  Core Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                  A New Way to Learn Language
                </h2>
                <p className="max-w-[900px] text-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our app is packed with innovative features designed to make
                  learning effective and enjoyable, moving beyond traditional
                  methods.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-3 mt-12">
              {featureCards.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center gap-4">
                    {feature.icon}
                    <CardTitle className="font-headline">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-foreground/80">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-foreground/60">
          &copy; {new Date().getFullYear()} Vocabify. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
