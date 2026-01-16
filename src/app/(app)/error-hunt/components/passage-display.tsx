'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';

type PassageDisplayProps = {
  passage: string;
};

export default function PassageDisplay({ passage }: PassageDisplayProps) {
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());

  const tokens = useMemo(() => {
    // This regex splits the text into words and non-word characters (including spaces and punctuation)
    return passage.split(/(\W+)/).filter(Boolean);
  }, [passage]);

  const toggleSelection = (index: number) => {
    setSelectedIndices((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <div className="text-lg leading-relaxed p-4 rounded-md bg-secondary/30 border">
      {tokens.map((token, index) => {
        const isWord = /^\w+$/.test(token);
        const isSelected = selectedIndices.has(index);

        return (
          <span
            key={index}
            className={cn(
              'transition-colors duration-200 rounded-md',
              isWord && 'cursor-pointer px-0.5 py-0.5',
              isSelected && 'bg-accent/70 text-accent-foreground',
              !isSelected && isWord && 'hover:bg-primary/20'
            )}
            onClick={() => isWord && toggleSelection(index)}
          >
            {token}
          </span>
        );
      })}
    </div>
  );
}
