import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/i18n/LanguageContext";
import { Loader2 } from "lucide-react";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string, fullName: string, phoneNumber: string, age: number) => Promise<any>;
}

export default function AuthModal({ open, onClose, onSignIn, onSignUp }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [age, setAge] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  // Guard against double-submission from rapid clicks
  const submittingRef = useRef(false);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setFullName("");
    setPhoneNumber("");
    setAge("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent double-submission
    if (submittingRef.current || loading) return;
    submittingRef.current = true;
    setLoading(true);

    try {
      if (isSignUp) {
        const data = await onSignUp(email, password, fullName, phoneNumber, parseInt(age, 10));

        // If a session was returned, user is auto-logged-in
        if (data?.session) {
          toast({ title: t("accountCreated") || "Account created! Welcome." });
        } else {
          // No session = email confirmation is required on the Supabase side
          toast({
            title: t("accountCreated") || "Account created!",
            description: t("checkEmail") || "Please check your email to verify.",
          });
        }
        onClose();
        resetForm();
      } else {
        await onSignIn(email, password);
        toast({ title: t("welcomeBack") });
        onClose();
        resetForm();
      }
    } catch (err: any) {
      const code = err?.code;

      if (code === "rate_limit") {
        toast({
          title: t("rateLimitTitle") || "Too many attempts",
          description: t("rateLimitDesc") || "Please wait a minute before trying again.",
          variant: "destructive",
        });
      } else if (code === "email_not_confirmed") {
        toast({
          title: t("emailNotConfirmedTitle") || "Email not confirmed",
          description:
            t("emailNotConfirmedDesc") ||
            "Your email has not been confirmed. Ask the site admin to disable 'Confirm Email' in the Supabase Dashboard (Authentication → Providers → Email), or check your inbox for a verification link.",
          variant: "destructive",
        });
      } else {
        toast({
          title: t("error"),
          description: err.message,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
      submittingRef.current = false;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-surface-container-highest ghost-border ambient-shadow max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-3xl text-foreground mb-2">
            {isSignUp ? t("createAccount") : t("signIn")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          {isSignUp && (
            <>
              <div>
                <Label htmlFor="fullName" className="text-muted-foreground font-label text-xs uppercase tracking-widest">{t("fullName")}</Label>
                <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="bg-surface ghost-border focus:border-primary focus:ring-1 focus:ring-primary transition-all mt-2" />
              </div>
              <div>
                <Label htmlFor="phoneNumber" className="text-muted-foreground font-label text-xs uppercase tracking-widest">Phone Number</Label>
                <Input id="phoneNumber" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required className="bg-surface ghost-border focus:border-primary focus:ring-1 focus:ring-primary transition-all mt-2" />
              </div>
              <div>
                <Label htmlFor="age" className="text-muted-foreground font-label text-xs uppercase tracking-widest">Age</Label>
                <Input id="age" type="number" min="1" value={age} onChange={(e) => setAge(e.target.value)} required className="bg-surface ghost-border focus:border-primary focus:ring-1 focus:ring-primary transition-all mt-2" />
              </div>
            </>
          )}
          <div>
            <Label htmlFor="email" className="text-muted-foreground font-label text-xs uppercase tracking-widest">{t("email")}</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-surface ghost-border focus:border-primary focus:ring-1 focus:ring-primary transition-all mt-2" />
          </div>
          <div>
            <Label htmlFor="password" className="text-muted-foreground font-label text-xs uppercase tracking-widest">{t("password")}</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="bg-surface ghost-border focus:border-primary focus:ring-1 focus:ring-primary transition-all mt-2" />
          </div>
          <Button type="submit" className="w-full bg-primary-gradient hover:opacity-90 text-primary-foreground font-label uppercase tracking-widest border-none shadow-[0_0_15px_rgba(0,219,231,0.2)]" disabled={loading}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("pleaseWait")}
              </span>
            ) : isSignUp ? t("signUp") : t("signIn")}
          </Button>
          <p className="text-center text-sm font-label text-muted-foreground">
            {isSignUp ? t("alreadyHaveAccount") : t("dontHaveAccount")}{" "}
            <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="text-primary hover:text-white transition-colors">
              {isSignUp ? t("signIn") : t("signUp")}
            </button>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
