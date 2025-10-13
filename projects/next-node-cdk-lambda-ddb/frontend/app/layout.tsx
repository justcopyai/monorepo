import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Serverless App - Built with JustCopy.ai',
  description: 'Next.js + AWS CDK + Lambda + DynamoDB serverless application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <footer className="fixed bottom-4 right-4 text-xs text-gray-500">
          Built with ❤️ using{' '}
          <a
            href="https://justcopy.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            JustCopy.ai
          </a>
        </footer>
      </body>
    </html>
  );
}
