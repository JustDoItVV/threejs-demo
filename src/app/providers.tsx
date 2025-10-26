'use client';

import { ColorModeProvider } from '@/libs/ui/components/color-mode';
import { system } from '@/libs/ui/theme';
import { ChakraProvider } from '@chakra-ui/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider>{children}</ColorModeProvider>
    </ChakraProvider>
  );
}
