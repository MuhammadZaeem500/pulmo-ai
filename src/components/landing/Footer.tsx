import Link from "next/link";
import { Activity } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0b132b] text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-slate-800/80">
          
          {/* Brand Info (Left Column - 4 Spans) */}
          <div className="md:col-span-4 flex flex-col items-start">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="h-9 w-9 rounded-xl bg-linear-to-tr from-blue-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Activity className="h-5 w-5" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                Pulmo<span className="text-teal-400">AI</span>
              </span>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-sm">
              Your trusted AI-powered pulmonary health companion for better respiratory outcomes.
            </p>

            {/* Social Icons (Inline SVGs) */}
            <div className="flex items-center gap-3">
              {/* GitHub */}
              <a 
                href="https://github.com/MuhammadZaeem500" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="h-10 w-10 rounded-xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-slate-300 hover:bg-slate-700 hover:text-white transition"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </a>

              {/* Twitter / X */}
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="h-10 w-10 rounded-xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-slate-300 hover:bg-slate-700 hover:text-white transition"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>

              {/* LinkedIn */}
              <a 
                href="https://www.linkedin.com/in/muhammad-zaeem-sheikh/" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="h-10 w-10 rounded-xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-slate-300 hover:bg-slate-700 hover:text-white transition"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Links Columns (Right 8 Spans) */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            
            {/* Features Column */}
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Features</h3>
              <ul className="space-y-3 text-sm">
                <li><Link href="/symptom-checker" className="hover:text-white transition">AI Chatbot</Link></li>
                <li><Link href="/medical-history" className="hover:text-white transition">Medical History</Link></li>
                <li><Link href="/symptom-tracker" className="hover:text-white transition">Symptom Tracker</Link></li>
                <li><Link href="/appointments" className="hover:text-white transition">Appointments</Link></li>
                <li><Link href="/prescriptions" className="hover:text-white transition">Prescriptions</Link></li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Company</h3>
              <ul className="space-y-3 text-sm">
                <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
                <li><Link href="/careers" className="hover:text-white transition">Careers</Link></li>
                <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
                <li><Link href="/press" className="hover:text-white transition">Press Kit</Link></li>
                <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
              </ul>
            </div>

            {/* Support Column */}
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Support</h3>
              <ul className="space-y-3 text-sm">
                <li><Link href="/help" className="hover:text-white transition">Help Center</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
                <li><Link href="/cookies" className="hover:text-white transition">Cookie Policy</Link></li>
                <li><Link href="/hipaa" className="hover:text-white transition">HIPAA Compliance</Link></li>
              </ul>
            </div>

          </div>

        </div>

        {/* Bottom Copyright & Credit */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} PulmoAI. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <span className="text-red-500">❤️</span> for better pulmonary healthcare
          </p>
        </div>

      </div>
    </footer>
  );
}