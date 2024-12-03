import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { IUser } from "@/stores/auth.store";

const protectedRoutes = ["/"];

export default async function middleware(req: NextRequest) {
   try {
      const cookieStore = await cookies();
      const token = cookieStore.get("access_token")?.value || "";

      const isProtected = protectedRoutes.some((path) =>
         req.nextUrl.pathname.startsWith(path)
      );

      if (token && (req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register"))) {
         return NextResponse.redirect(new URL("/", req.nextUrl));
      }

      // if (isProtected && !token) {
      //    return NextResponse.redirect(new URL("/login", req.nextUrl));
      // }

      if (token) {
         const user: IUser = jwtDecode(token);

         if (
            isProtected &&
            req.nextUrl.pathname.startsWith("/") &&
            user.role != "Event Organizer"
         ) {
            return NextResponse.redirect(new URL("/", req.nextUrl));
         }
      }

      return NextResponse.next();
   } catch {
      return NextResponse.redirect(new URL("/", req.nextUrl));
   }
}

export const config = {
   matcher: ["/user/:path*", "/login", "/register"],
};
