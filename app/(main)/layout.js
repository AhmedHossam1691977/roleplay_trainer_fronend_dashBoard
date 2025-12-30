import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "../../components/sidebar.jsx";
import { cookies } from "next/headers"; 
import Upgrade from "../../components/Upgrade.jsx";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({ children }) {
  
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user")?.value;
  
  let showUpgradeBanner = false;

  if (userCookie) {
    try {
      const user = JSON.parse(decodeURIComponent(userCookie));
      console.log(user);
      
      
      if (user.role === 'admin' && user.subscriptions !== true) {
        showUpgradeBanner = true;
      }
      
  
    } catch (e) {
      console.error("Error parsing user cookie", e);
    }
  }

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans bg-gray-50 text-gray-900`}>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 lg:pl-64">
            
        
            {showUpgradeBanner && (
            <Upgrade/>
            )}

            <main className={`p-4 md:p-8 w-full max-w-7xl mx-auto ${showUpgradeBanner ? 'pt-20' : 'pt-24 lg:pt-8'}`}>
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}