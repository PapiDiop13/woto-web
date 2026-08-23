import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "WOTO — Louez une voiture près de vous",
  description: "WOTO met en relation les propriétaires de véhicules et les personnes qui souhaitent en louer un. Sans intermédiaire, sans complication.",
  metadataBase: new URL('https://woto.app'),
  openGraph: {
    title: "WOTO — Louez une voiture près de vous",
    description: "Parcourez les véhicules disponibles autour de vous et réservez en quelques clics.",
    siteName: "WOTO",
    locale: "fr_SN",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#0E8C6A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-text">
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
