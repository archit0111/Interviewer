import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-blue-100 bg-white">
      <div className="mx-auto flex max-w-8xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:px-6">
        <div className="flex items-center gap-3">
          <img src="/oratoai-logo.png" alt="oratoai logo" className="h-9 w-9" />
          <div>
            <p className="text-lg font-bold leading-none text-blue-950">
              orato<span className="text-orange-500">ai</span>
            </p>
            <p className="mt-1 text-xs">Speak it. Score it. Own it.</p>
          </div>
        </div>

        <nav aria-label="Footer" className="flex gap-5 font-medium">
          <Link href="/about" className="hover:text-blue-800">About</Link>
          <Link href="/privacy" className="hover:text-blue-800">Privacy</Link>
          <Link href="/terms" className="hover:text-blue-800">Terms</Link>
          <Link href="/contact" className="hover:text-blue-800">Contact</Link>
        </nav>

        <p>© {new Date().getFullYear()} oratoai</p>
      </div>
    </footer>
  );
}