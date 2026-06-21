import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Refreshes the Supabase auth session on every admin request and
 * redirects unauthenticated users away from /admin (except the login page).
 *
 * Runs on the Node.js runtime (Next 16) so the full Supabase SSR client and
 * runtime env vars are available — avoids the Edge bundle missing inlined
 * NEXT_PUBLIC_* values, which previously caused MIDDLEWARE_INVOCATION_FAILED.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLogin = pathname === "/admin/login";

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If env is missing, never hard-500. Let the login page render; protected
  // pages still guard server-side via their own auth checks.
  if (!supabaseUrl || !supabaseAnonKey) {
    if (pathname.startsWith("/admin") && !isLogin) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (pathname.startsWith("/admin") && !isLogin && !user) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }

    if (isLogin && user) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }

    return response;
  } catch {
    // Auth lookup failed (network/env) — fail safe: send protected routes to
    // login rather than throwing a 500 from middleware.
    if (pathname.startsWith("/admin") && !isLogin) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
    return response;
  }
}

export const runtime = "nodejs";

export const config = {
  matcher: ["/admin/:path*"],
};
