import React, { useState } from 'react';
import { Globe, Check, Copy, ExternalLink, ShieldCheck, ArrowRight, Github, Code, CheckCircle } from 'lucide-react';

interface DomainSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DomainSetupModal: React.FC<DomainSetupModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'github-pages' | 'dns-records'>('github-pages');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const gitCommands = `# 1. Stage the updated workflow fix
git add .
git commit -m "Fix GitHub Actions workflow: remove lockfile cache requirement"

# 2. Push to your repository
git push origin main`;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-stone-900 rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col border border-stone-200 dark:border-stone-800 shadow-2xl my-auto overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-editorial font-bold text-stone-900 dark:text-stone-100">
                Host on GitHub Pages · akshayblog.sapiexa.com
              </h3>
              <p className="text-xs text-stone-500 font-mono">
                Deploying Vite + React with custom subdomain & automatic SSL
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-2 px-5 pt-3 border-b border-stone-200 dark:border-stone-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('github-pages')}
            className={`pb-2.5 border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'github-pages'
                ? 'border-stone-900 dark:border-white text-stone-900 dark:text-white'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub Pages Deployment Steps</span>
          </button>
          <button
            onClick={() => setActiveTab('dns-records')}
            className={`pb-2.5 border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'dns-records'
                ? 'border-stone-900 dark:border-white text-stone-900 dark:text-white'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>DNS CNAME Settings (sapiexa.com)</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-stone-700 dark:text-stone-300">
          {activeTab === 'github-pages' && (
            <div className="space-y-5">
              <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-950 bg-emerald-50/50 dark:bg-emerald-950/20 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-medium">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Pre-configured files ready: <code>public/CNAME</code>, <code>public/404.html</code>, and <code>.github/workflows/deploy.yml</code> are included!</span>
                </div>
              </div>

              {/* Step 1 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-bold text-stone-900 dark:text-stone-100 text-sm">
                  <span className="w-5 h-5 rounded-full bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs flex items-center justify-center">1</span>
                  <span>Create a GitHub Repository & Push Your Code</span>
                </div>
                <p className="text-stone-500">
                  Create a new repository on <a href="https://github.com/new" target="_blank" rel="noreferrer" className="underline font-semibold">github.com/new</a> named <code>akshayblog</code>. Then run these commands in your terminal:
                </p>
                <div className="relative">
                  <pre className="p-3.5 rounded-xl bg-stone-950 text-stone-200 font-mono text-[11px] overflow-x-auto leading-relaxed">
                    <code>{gitCommands}</code>
                  </pre>
                  <button
                    onClick={() => handleCopy(gitCommands, 'git')}
                    className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 text-[10px] font-mono cursor-pointer"
                  >
                    {copiedKey === 'git' ? 'Copied!' : 'Copy Commands'}
                  </button>
                </div>
              </div>

              {/* Step 2 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-bold text-stone-900 dark:text-stone-100 text-sm">
                  <span className="w-5 h-5 rounded-full bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs flex items-center justify-center">2</span>
                  <span>Enable GitHub Pages in Repository Settings</span>
                </div>
                <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/40 space-y-2">
                  <p>1. Go to your repository on GitHub: <strong>Settings &gt; Pages</strong> (in the left sidebar).</p>
                  <p>2. Under <strong>Build and deployment &gt; Source</strong>, select: <strong className="text-stone-900 dark:text-stone-100">GitHub Actions</strong>.</p>
                  <p className="text-stone-500">
                    Because we added <code>.github/workflows/deploy.yml</code>, GitHub will automatically build and deploy your site on every commit!
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-bold text-stone-900 dark:text-stone-100 text-sm">
                  <span className="w-5 h-5 rounded-full bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs flex items-center justify-center">3</span>
                  <span>Set Custom Domain & Enforce HTTPS</span>
                </div>
                <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/40 space-y-2">
                  <p>1. In <strong>Settings &gt; Pages &gt; Custom domain</strong>, enter: <code className="font-bold">akshayblog.sapiexa.com</code>.</p>
                  <p>2. Click <strong>Save</strong>. GitHub will verify the DNS record automatically.</p>
                  <p>3. Check the box <strong className="text-emerald-600">Enforce HTTPS</strong> (GitHub will auto-issue a free Let's Encrypt SSL certificate for your subdomain).</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dns-records' && (
            <div className="space-y-5">
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                Log into your domain DNS registrar (Cloudflare, GoDaddy, Namecheap, Hostinger, etc.) where <strong>sapiexa.com</strong> is managed, and add this DNS record:
              </p>

              {/* DNS Table */}
              <div className="rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden font-mono text-[11px]">
                <table className="w-full text-left">
                  <thead className="bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                    <tr>
                      <th className="p-3">Type</th>
                      <th className="p-3">Name / Host</th>
                      <th className="p-3">Target / Points to</th>
                      <th className="p-3">TTL / Proxy</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                    <tr>
                      <td className="p-3 font-bold text-stone-900 dark:text-stone-100">CNAME</td>
                      <td className="p-3 text-stone-800 dark:text-stone-200 font-bold">akshayblog</td>
                      <td className="p-3 text-emerald-600 font-bold">
                        antonyakshaygi.github.io
                      </td>
                      <td className="p-3 text-stone-500">Auto / DNS only</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Copy helper */}
              <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/40 space-y-3 font-mono">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-stone-500 text-[10px] uppercase block">Subdomain Host</span>
                    <span className="font-bold text-stone-900 dark:text-stone-100">akshayblog</span>
                  </div>
                  <button
                    onClick={() => handleCopy('akshayblog', 'host')}
                    className="px-2.5 py-1 rounded bg-white dark:bg-stone-800 border text-[11px] cursor-pointer"
                  >
                    {copiedKey === 'host' ? 'Copied' : 'Copy Host'}
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/40 space-y-2">
                <p className="font-semibold text-stone-900 dark:text-stone-100">
                  Tip for Cloudflare users:
                </p>
                <p className="text-stone-500">
                  If your domain <code>sapiexa.com</code> uses Cloudflare, set the Proxy status to <strong>DNS only (grey cloud)</strong> during initial verification so GitHub Pages can issue the SSL certificate smoothly. You can switch to Proxied once verified!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs">
          <span className="text-stone-500 font-mono">
            Destination: https://akshayblog.sapiexa.com
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-semibold cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
