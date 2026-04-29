import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminShell, { Field, PasswordInput, PrimaryBtn, inputCls } from "@/components/admin/AdminShell";
import { createAdminAccount, hasAdminAccount, startSession } from "@/lib/adminAuth";
import { toast } from "@/hooks/use-toast";

const AdminSetup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; pw?: string; pw2?: string }>({});

  useEffect(() => {
    if (hasAdminAccount()) navigate("/admin/login", { replace: true });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    const u = username.trim();
    if (u.length < 3 || u.length > 32) next.username = "ID는 3~32자여야 합니다.";
    if (!/^[a-zA-Z0-9_.-]+$/.test(u)) next.username = "영문/숫자/._- 만 사용할 수 있어요.";
    if (pw.length < 8 || pw.length > 64) next.pw = "비밀번호는 8~64자여야 합니다.";
    if (pw !== pw2) next.pw2 = "비밀번호가 일치하지 않습니다.";
    setErrors(next);
    if (Object.keys(next).length) return;

    try {
      setLoading(true);
      await createAdminAccount(u, pw);
      startSession(u);
      toast({ title: "관리자 계정이 생성되었어요" });
      navigate("/admin", { replace: true });
    } catch {
      toast({ title: "계정 생성 실패", description: "다시 시도해주세요.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminShell title="관리자 등록" subtitle="최초 1회만 진행됩니다" back="/">
      <div className="rounded-2xl border border-border bg-secondary/30 p-3 text-[11px] leading-relaxed text-muted-foreground">
        ⚠️ 데모용 클라이언트 인증입니다. 비밀번호는 이 브라우저에 해시로만 저장되며,
        브라우저 데이터 삭제 시 초기화됩니다.
      </div>

      <form onSubmit={submit} className="mt-5 space-y-4">
        <Field label="관리자 ID" htmlFor="u" error={errors.username} hint="영문/숫자/._- 3~32자">
          <input
            id="u"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            className={inputCls}
            placeholder="예: admin"
          />
        </Field>
        <Field label="비밀번호" htmlFor="p1" error={errors.pw} hint="8~64자">
          <PasswordInput id="p1" value={pw} onChange={setPw} autoComplete="new-password" />
        </Field>
        <Field label="비밀번호 확인" htmlFor="p2" error={errors.pw2}>
          <PasswordInput id="p2" value={pw2} onChange={setPw2} autoComplete="new-password" />
        </Field>
        <PrimaryBtn type="submit" loading={loading}>
          관리자 계정 만들기
        </PrimaryBtn>
      </form>
    </AdminShell>
  );
};

export default AdminSetup;
