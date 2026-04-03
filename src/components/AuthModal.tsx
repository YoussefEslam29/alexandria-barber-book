import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/i18n/LanguageContext";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string, fullName: string) => Promise<void>;
}

export default function AuthModal({ open, onClose, onSignIn, onSignUp }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        await onSignUp(email, password, fullName);
        toast({ title: t("accountCreated"), description: t("checkEmail") });
      } else {
        await onSignIn(email, password);
        toast({ title: t("welcomeBack") });
      }
      onClose();
      setEmail("");
      setPassword("");
      setFullName("");
    } catch (err: any) {
      toast({ title: t("error"), description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl text-foreground">
            {isSignUp ? t("createAccount") : t("signIn")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <Label htmlFor="fullName" className="text-muted-foreground">{t("fullName")}</Label>
              <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="bg-muted border-border" />
            </div>
          )}
          <div>
            <Label htmlFor="email" className="text-muted-foreground">{t("email")}</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-muted border-border" />
          </div>
          <div>
            <Label htmlFor="password" className="text-muted-foreground">{t("password")}</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="bg-muted border-border" />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t("pleaseWait") : isSignUp ? t("signUp") : t("signIn")}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            {isSignUp ? t("alreadyHaveAccount") : t("dontHaveAccount")}{" "}
            <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="text-primary hover:underline">
              {isSignUp ? t("signIn") : t("signUp")}
            </button>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
