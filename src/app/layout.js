// I:\FromGit\Wall-Damage-Analysis-and-Cost-Estimation-project\src\app\layout.js
import Header from "./components/header";
import Footer from "./components/footer";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
