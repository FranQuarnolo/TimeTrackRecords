import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TeamThemeProvider } from "@/components/team-theme-provider";
import { AuthProvider } from "@/components/auth/auth-provider";
import { ThemeDrawer } from "@/components/theme-drawer";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Telemetry System",
  description: "Track your lap times",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <TeamThemeProvider>
            <AuthProvider>
              {children}
              <div className="fixed bottom-4 left-4 z-50">
                <ThemeDrawer />
              </div>
              <Toaster />
            </AuthProvider>
          </TeamThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
