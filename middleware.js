import { rewrite } from "@vercel/edge";

export const config = {
  matcher: ["/", "/Image/:path*", "/JSON/:path*", "/Dev/:path*"]
};

export default function middleware(request) {
  const accept = request.headers.get("accept") || "";
  if (!accept.includes("text/markdown")) {
    return;
  }
  const url = new URL(request.url);
  let path = url.pathname.replace(/\/+$/, "");
  if (!path) {
    path = "/index";
  }
  return rewrite(new URL(`/md${path}.md`, request.url));
}
