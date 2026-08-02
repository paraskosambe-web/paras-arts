import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { LoadingScreen } from "../components/LoadingScreen";
import { ScrollToTop } from "../components/ScrollToTop";
import { AiAssistant } from "../components/AiAssistant";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-lg text-center">
        <div className="font-display text-[7rem] leading-none text-gold-gradient md:text-[10rem]">404</div>
        <h1 className="mt-2 font-display text-3xl text-foreground md:text-4xl">
          This page has drifted away
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          The page you're looking for doesn't exist — perhaps it was moved, renamed, or never
          sketched. The gallery, however, is always open.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn-gold">
            Return to the studio
          </Link>
          <Link to="/portfolio" className="btn-ghost-gold">
            Browse the portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-lg text-center">
        <div className="font-display text-[7rem] leading-none text-gold-gradient md:text-[10rem]">500</div>
        <h1 className="mt-2 font-display text-3xl text-foreground md:text-4xl">A smudge on our side</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Something went wrong on the studio server. Please try again — your enquiries are safe.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="btn-gold"
          >
            Try again
          </button>
          <a href="/" className="btn-ghost-gold">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}


export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Paras Arts — Hyper-Realistic Pencil Portraits" },
      {
        name: "description",
        content:
          "Paras Arts is a luxury pencil-art atelier crafting hyper-realistic portraits, couple sketches, pet & car art on commission.",
      },
      { name: "author", content: "Paras Arts" },
      { property: "og:title", content: "Paras Arts — Hyper-Realistic Pencil Portraits" },
      {
        property: "og:description",
        content: "Commission a handcrafted, hyper-realistic pencil portrait from Paras Arts.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
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
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAuthPage = pathname === "/admin-login";
  const isAdminArea = pathname.startsWith("/admin") && !isAuthPage;
  const chromeless = isAuthPage || isAdminArea;

  return (
    <QueryClientProvider client={queryClient}>
      {!chromeless && <LoadingScreen />}
      {!chromeless && <Navbar />}
      <main key={pathname} className={chromeless ? "" : "pt-20 animate-fade-in"}>
        <Outlet />
      </main>
      {!chromeless && <Footer />}
      {!chromeless && <ScrollToTop />}
      {!chromeless && <AiAssistant />}

  );
}
