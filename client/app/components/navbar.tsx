"use client";

import { Suspense } from "react";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  return (
    <header className="h-14 border-b px-6 flex items-center justify-between bg-background shrink-0">
      <div className="font-semibold text-base">PDF RAG</div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Suspense fallback={<div className="h-8 w-8 animate-pulse rounded-full bg-muted" />}>
          <Show when="signed-out">
            <div className="flex items-center gap-2">
              <SignInButton mode="modal">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm">Sign Up</Button>
              </SignUpButton>
            </div>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </Suspense>
      </div>
    </header>
  );
}
