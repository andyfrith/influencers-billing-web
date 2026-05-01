import type { Metadata } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { SideNavBar } from "@/components/side-nav-bar";
import { getAppSession } from "@/lib/session";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-club-kinetic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Influencers Billing",
  description: "Customer credit card management portal",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): Promise<React.JSX.Element> {
  const session = await getAppSession();
  const isAuthenticated = Boolean(session?.user?.id);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${plusJakarta.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers>
          {isAuthenticated ? (
            <div className="flex min-h-full flex-1 flex-col lg:pl-64">
              <SideNavBar isAdmin={session?.user?.role === "admin"} />
              <div className="flex min-h-0 flex-1 flex-col">{children}</div>
            </div>
          ) : (
            children
          )}
        </Providers>
      </body>
    </html>
  );
}
