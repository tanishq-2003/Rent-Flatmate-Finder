import type { Metadata } from "next";
import { AuthProvider } from "../context/AuthContext";
import { SocketProvider } from "../context/SocketContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "FlatMatch | Premium Flatmate & Rent Finder",
  description: "Find your perfect flatmate and next home with AI-driven compatibility matching.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <SocketProvider>
            {children}
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
