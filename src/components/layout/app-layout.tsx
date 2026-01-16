"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  BookOpen,
  LayoutDashboard,
  Puzzle,
  Replace,
  Search,
  Settings,
  SpellCheck,
  User,
  Workflow,
  Zap,
} from 'lucide-react';
import { ThemeToggle } from './theme-toggle';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/grammar-puzzle', label: 'Grammar Puzzles', icon: Puzzle, disabled: true },
  { href: '/vocab-game', label: 'Vocab Game', icon: SpellCheck, disabled: true },
  { href: '/sentence-flow', label: 'Sentence Flow', icon: Workflow, disabled: true },
  { href: '/error-hunt', label: 'Error Hunt', icon: Search },
  { href: '/story-mode', label: 'Story Mode', icon: BookOpen, disabled: true },
  { href: '/synonym-challenge', label: 'Synonym Challenge', icon: Replace, disabled: true },
  { href: '/rapid-fire', label: 'Rapid-Fire', icon: Zap, disabled: true },
];

const Logo = () => (
    <div className="bg-primary text-primary-foreground font-bold text-2xl w-10 h-10 flex items-center justify-center rounded-lg font-headline">
      V
    </div>
  );
  

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Logo />
            <span className="text-lg font-bold font-headline text-sidebar-foreground">Vocabify</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <Link href={item.href} passHref legacyBehavior>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    disabled={item.disabled}
                    tooltip={item.label}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Profile">
                <Avatar className="h-7 w-7">
                  <AvatarImage src="https://picsum.photos/seed/avatar/100/100" />
                  <AvatarFallback>
                    <User />
                  </AvatarFallback>
                </Avatar>
                <span>Jane Doe</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background/50 px-6 backdrop-blur-sm sticky top-0 z-40">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold md:text-xl font-headline">
                {navItems.find(item => pathname.startsWith(item.href))?.label || 'Vocabify'}
            </h1>
            <div className="ml-auto flex items-center gap-2">
                <ThemeToggle />
            </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
