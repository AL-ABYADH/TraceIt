import { Providers } from "@/providers/Providers";
import "./globals.css";
import "@xyflow/react/dist/style.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full w-full bg-background text-foreground font-sans">
      <body className="h-full m-0 p-0">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
