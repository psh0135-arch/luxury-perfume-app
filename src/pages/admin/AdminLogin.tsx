import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminShell, { Field, PasswordInput, PrimaryBtn, inputCls } from "@/components/admin/AdminShell";
import { hasAdminAccount, isLoggedIn, startSession, verifyCredentials } from "@/lib/adminAuth";
import { toast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!hasAdminAccount()) navigate("/admin/setup", { replace: true });
    else if (isLoggedIn()) navigate("/admin", { replace: true });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const ok = await verifyCredentials(username, pw);
      if (!ok) {
        setError("ID 또는 비밀번호가 올바르지 않습니다.");
        return;
      }
      startSession(username.trim());
      toast({ title: "로그인되었어요" });
      navigate("/admin", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminShell title="관리자 로그인" back="/">
      <form onSubmit={submit} className="space-y-4">
        <Field label="관리자 ID" htmlFor="u">
          <input
            id="u"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            className={inputCls}
          />
        </Field>
        <Field label="비밀번호" htmlFor="p" error={error}>
          <PasswordInput id="p" value={pw} onChange={setPw} autoComplete="current-password" />
        </Field>
        <PrimaryBtn type="submit" loading={loading}>
          로그인
        </PrimaryBtn>
      </form>
    </AdminShell>
  );
};

export default AdminLogin;
