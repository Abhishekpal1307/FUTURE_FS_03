import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { useState } from "react";
import { Toaster } from "sonner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { SplashScreen } from "@/components/SplashScreen";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Urban Brew Café" },
      { name: "description", content: "Artisan coffee, fresh pastries, and a warm atmosphere in downtown." },
      { name: "author", content: "Urban Brew Café" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:title", content: "Urban Brew Café" },
      { name: "twitter:title", content: "Urban Brew Café" },
      { property: "og:description", content: "Artisan coffee, fresh pastries, and a warm atmosphere in downtown." },
      { name: "twitter:description", content: "Artisan coffee, fresh pastries, and a warm atmosphere in downtown." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/31811d2c-9219-4abd-a0a0-2b8f6a25b8fe/id-preview-770d6d5a--98690213-681d-4cd0-ad5c-48dcc0a39fa5.lovable.app-1776938575857.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/31811d2c-9219-4abd-a0a0-2b8f6a25b8fe/id-preview-770d6d5a--98690213-681d-4cd0-ad5c-48dcc0a39fa5.lovable.app-1776938575857.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold font-heading text-foreground">404</h1>
        <p className="mt-4 text-muted-foreground">The page you're looking for doesn't exist.</p>
        <a href="/" className="mt-6 inline-block px-6 py-3 rounded-xl bg-accent text-accent-foreground font-semibold hover:brightness-110 transition">Go Home</a>
      </div>
    </div>
  );
}

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
      <Toaster position="top-right" richColors />
    </>
  );
}
