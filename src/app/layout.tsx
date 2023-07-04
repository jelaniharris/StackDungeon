import '@/styles/globals.scss';

import { Providers } from '@/store/provider';

export const metadata = {
  title: 'Stack Dungeon',
  description: 'Created by Jelani Harris',
  keywords: [
    'Next.js',
    'React',
    'TypeScript',
    'Server Components',
    'NextUI',
    'NextAuth',
    'Prisma',
    'PostgreSQL',
    'OpenAI',
    'GPT',
    'Stripe',
  ],
  authors: [
    {
      name: 'Jelani Harris',
      url: 'https://github.com/jelaniharris',
    },
  ],
  creator: 'Jelani Harris',
  publisher: 'Jelani Harris',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
