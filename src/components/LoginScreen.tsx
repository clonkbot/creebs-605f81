import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";

export function LoginScreen() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    try {
      await signIn("password", formData);
    } catch (err) {
      setError(flow === "signIn" ? "Invalid credentials" : "Could not create account");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden flex flex-col">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-20 w-60 h-60 bg-orange-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-20 right-1/4 w-40 h-40 bg-yellow-500/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "2s" }} />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,191,36,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,191,36,0.5) 1px, transparent 1px)`,
            backgroundSize: "60px 60px"
          }}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-md relative">
          {/* Logo and branding */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center mb-4 sm:mb-6">
              <div className="relative">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 rounded-2xl rotate-12 shadow-lg shadow-amber-500/30" />
                <div className="absolute inset-0 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-300 to-orange-400 rounded-2xl -rotate-6 opacity-60" />
                <span className="absolute inset-0 flex items-center justify-center text-[#0a0a0f] font-black text-xl sm:text-2xl rotate-3">C</span>
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-2">
              <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-orange-400 bg-clip-text text-transparent">
                Creebs
              </span>
            </h1>
            <p className="text-amber-100/40 text-sm sm:text-base tracking-wide font-light">
              Property Management Simplified
            </p>
          </div>

          {/* Login card */}
          <div className="relative">
            {/* Card glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 rounded-3xl blur-xl opacity-50" />

            <div className="relative bg-[#12121a]/80 backdrop-blur-xl border border-amber-400/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl">
              {/* Tab switcher */}
              <div className="flex mb-6 sm:mb-8 bg-[#0a0a0f]/50 rounded-xl p-1">
                <button
                  onClick={() => setFlow("signIn")}
                  className={`flex-1 py-2.5 sm:py-3 text-sm font-medium rounded-lg transition-all duration-300 ${
                    flow === "signIn"
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-[#0a0a0f] shadow-lg shadow-amber-500/25"
                      : "text-amber-200/50 hover:text-amber-200/80"
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setFlow("signUp")}
                  className={`flex-1 py-2.5 sm:py-3 text-sm font-medium rounded-lg transition-all duration-300 ${
                    flow === "signUp"
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-[#0a0a0f] shadow-lg shadow-amber-500/25"
                      : "text-amber-200/50 hover:text-amber-200/80"
                  }`}
                >
                  Sign Up
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="block text-amber-200/70 text-xs sm:text-sm font-medium tracking-wide uppercase">
                    Email
                  </label>
                  <div className="relative group">
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 sm:py-3.5 bg-[#0a0a0f]/60 border border-amber-400/20 rounded-xl text-amber-100 placeholder-amber-200/30 focus:outline-none focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 transition-all duration-300 text-sm sm:text-base"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-400/0 via-amber-400/5 to-amber-400/0 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <label className="block text-amber-200/70 text-xs sm:text-sm font-medium tracking-wide uppercase">
                    Password
                  </label>
                  <div className="relative group">
                    <input
                      name="password"
                      type="password"
                      required
                      placeholder="••••••••"
                      className="w-full px-4 py-3 sm:py-3.5 bg-[#0a0a0f]/60 border border-amber-400/20 rounded-xl text-amber-100 placeholder-amber-200/30 focus:outline-none focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 transition-all duration-300 text-sm sm:text-base"
                    />
                  </div>
                </div>

                <input name="flow" type="hidden" value={flow} />

                {error && (
                  <div className="px-4 py-2.5 sm:py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs sm:text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 sm:py-4 mt-2 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-[#0a0a0f] font-bold rounded-xl shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm sm:text-base"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      {flow === "signIn" ? "Signing in..." : "Creating account..."}
                    </span>
                  ) : flow === "signIn" ? (
                    "Sign In"
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-4 my-5 sm:my-6">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" />
                <span className="text-amber-200/30 text-xs">OR</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" />
              </div>

              {/* Anonymous sign in */}
              <button
                onClick={() => signIn("anonymous")}
                className="w-full py-3 sm:py-3.5 border border-amber-400/20 text-amber-200/70 font-medium rounded-xl hover:bg-amber-400/5 hover:border-amber-400/30 hover:text-amber-200 transition-all duration-300 text-sm sm:text-base"
              >
                Continue as Guest
              </button>
            </div>
          </div>

          {/* Features list */}
          <div className="mt-8 sm:mt-10 grid grid-cols-3 gap-3 sm:gap-4">
            {[
              { icon: "🏠", label: "Properties" },
              { icon: "🔧", label: "Repairs" },
              { icon: "📊", label: "Analytics" },
            ].map((feature, i) => (
              <div
                key={feature.label}
                className="text-center p-3 sm:p-4 rounded-xl bg-[#12121a]/40 border border-amber-400/5 hover:border-amber-400/20 transition-all duration-300"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="text-xl sm:text-2xl mb-1 sm:mb-2">{feature.icon}</div>
                <div className="text-amber-200/50 text-[10px] sm:text-xs font-medium tracking-wide uppercase">{feature.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 sm:py-6 text-center">
        <p className="text-amber-200/20 text-[10px] sm:text-xs font-light tracking-wide">
          Requested by @web-user · Built by @clonkbot
        </p>
      </footer>
    </div>
  );
}
