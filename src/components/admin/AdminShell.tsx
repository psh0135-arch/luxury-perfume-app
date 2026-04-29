import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface AdminShellProps {
  title: string;
  subtitle?: string;
  back?: string;
  children: React.ReactNode;
  right?: React.ReactNode;
}

const AdminShell = ({ title, subtitle, back, children, right }: AdminShellProps) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[420px] pb-20">
        <header className="sticky top-0 z-30 border-b border-border bg-background/95 px-5 py-4 backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              {back ? (
                <Link
                  to={back}
                  aria-label="뒤로"
                  className="-ml-2 flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-foreground active:bg-secondary"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              ) : null}
              <div className="min-w-0">
                <p className="text-[10px] font-medium tracking-[0.3em] text-muted-foreground">
                  ADMIN
                </p>
                <h1 className="truncate font-serif text-lg text-foreground">{title}</h1>
                {subtitle ? (
                  <p className="text-[11px] text-muted-foreground">{subtitle}</p>
                ) : null}
              </div>
            </div>
            {right}
          </div>
        </header>
        <div className="px-5 pt-5">{children}</div>
      </div>
    </div>
  );
};

interface FieldProps {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}

export const Field = ({ label, htmlFor, hint, error, children }: FieldProps) => (
  <div className="space-y-1.5">
    <label htmlFor={htmlFor} className="text-[12px] font-medium text-foreground">
      {label}
    </label>
    {children}
    {error ? (
      <p className="text-[11px] text-destructive">{error}</p>
    ) : hint ? (
      <p className="text-[11px] text-muted-foreground">{hint}</p>
    ) : null}
  </div>
);

export const inputCls =
  "h-11 min-h-[44px] w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary";

export const textareaCls =
  "min-h-[96px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary";

interface BtnState { loading?: boolean }

export const PrimaryBtn = ({
  loading,
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & BtnState) => (
  <button
    {...rest}
    disabled={rest.disabled || loading}
    className={`flex h-12 min-h-[44px] w-full items-center justify-center rounded-full text-sm font-semibold tracking-wider text-primary-foreground transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${rest.className ?? ""}`}
    style={{ background: "var(--gradient-luxury)" }}
  >
    {loading ? "처리 중…" : children}
  </button>
);

export default AdminShell;

// 임시 토글식 비밀번호 input
export const PasswordInput = ({
  id,
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
}) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={inputCls + " pr-14"}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute inset-y-0 right-2 my-auto h-9 rounded px-2 text-[11px] text-muted-foreground hover:text-foreground"
      >
        {show ? "숨김" : "보기"}
      </button>
    </div>
  );
};
