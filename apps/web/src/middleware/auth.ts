import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {}

export const config = {
  /**
   * matcher: Array of route patterns where this middleware will run.
   * runtime: (optional) Specify the runtime environment ('nodejs' or 'edge').
   * unstable_allowDynamic: (optional) Allow dynamic imports from specific paths.
   * api: (optional) Apply middleware to API routes.
   */
  // examples:
  //   matcher: ['/dashboard/:path*', '/profile/:path*'],
  // runtime: 'nodejs', // or 'edge' if you want to run on the edge
  // unstable_allowDynamic: [
  //     '/node_modules/**',
  //     '/src/**',
  // ],
  // api: {
  //     bodyParser: false, // Example: disable body parsing for API routes
  // },
};
