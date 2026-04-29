import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Plus, Pencil, Trash2, RefreshCcw } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import { useEvents } from "@/contexts/EventsContext";
import { useAllParticipations } from "@/hooks/useParticipation";
import { endSession } from "@/lib/adminAuth";
import { toast } from "@/hooks/use-toast";

const statusLabel: Record<string, string> = {
  ongoing: "진행 중",
  upcoming: "예정",
  ended: "종료",
};
const statusCls: Record<string, string> = {
  ongoing: "bg-primary text-primary-foreground",
  upcoming: "bg-secondary text-foreground",
  ended: "bg-muted text-muted-foreground",
};

const AdminDashboard = () => {
  const { events, removeEvent, resetToDefaults } = useEvents();
  const participations = useAllParticipations();
  const navigate = useNavigate();

  const stats = useMemo(() => {
    const ongoing = events.filter((e) => e.status === "ongoing").length;
    const upcoming = events.filter((e) => e.status === "upcoming").length;
    const ended = events.filter((e) => e.status === "ended").length;
    const joined = Object.keys(participations).length;
    return { total: events.length, ongoing, upcoming, ended, joined };
  }, [events, participations]);

  const handleDelete = (id: string, title: string) => {
    if (!confirm(`"${title}" 이벤트를 삭제할까요?\n참여 기록은 그대로 남습니다.`)) return;
    removeEvent(id);
    toast({ title: "이벤트가 삭제되었어요" });
  };

  const handleReset = () => {
    if (!confirm("기본 샘플 이벤트로 초기화할까요? 현재 이벤트 목록이 모두 교체됩니다.")) return;
    resetToDefaults();
    toast({ title: "기본 데이터로 초기화되었어요" });
  };

  const handleLogout = () => {
    endSession();
    navigate("/admin/login", { replace: true });
  };

  return (
    <AdminShell
      title="대시보드"
      subtitle={`총 ${stats.total}개 이벤트`}
      back="/"
      right={
        <button
          onClick={handleLogout}
          aria-label="로그아웃"
          className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-muted-foreground active:bg-secondary"
        >
          <LogOut className="h-4 w-4" />
        </button>
      }
    >
      {/* Stats */}
      <section className="grid grid-cols-2 gap-3">
        <StatCard label="진행 중" value={stats.ongoing} accent />
        <StatCard label="예정" value={stats.upcoming} />
        <StatCard label="종료" value={stats.ended} />
        <StatCard label="총 참여" value={stats.joined} />
      </section>

      {/* Actions */}
      <div className="mt-5 flex gap-2">
        <Link
          to="/admin/event/new"
          className="flex h-11 min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-full text-sm font-semibold text-primary-foreground"
          style={{ background: "var(--gradient-luxury)" }}
        >
          <Plus className="h-4 w-4" /> 새 이벤트
        </Link>
        <button
          onClick={handleReset}
          aria-label="기본값 복원"
          className="flex h-11 min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-full border border-border px-3 text-[12px] text-muted-foreground active:bg-secondary"
        >
          <RefreshCcw className="h-4 w-4" /> 기본값
        </button>
      </div>

      {/* List */}
      <section className="mt-6 space-y-3">
        <h2 className="px-1 text-[11px] font-medium tracking-[0.25em] text-muted-foreground">
          EVENTS
        </h2>
        {events.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border bg-secondary/30 p-6 text-center text-xs text-muted-foreground">
            이벤트가 없습니다. 새 이벤트를 등록해 주세요.
          </p>
        ) : (
          <ul className="space-y-2.5">
            {events.map((e) => (
              <li
                key={e.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
              >
                <img
                  src={e.image}
                  alt={e.title}
                  className="h-14 w-14 flex-shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold tracking-wider ${statusCls[e.status]}`}
                    >
                      {statusLabel[e.status]}
                    </span>
                    <p className="truncate text-[10px] tracking-widest text-muted-foreground">
                      {e.brand}
                    </p>
                  </div>
                  <p className="mt-0.5 truncate text-[13px] font-medium text-foreground">
                    {e.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{e.period}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <Link
                    to={`/admin/event/${e.id}/edit`}
                    aria-label="수정"
                    className="flex h-9 w-9 min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-foreground active:bg-secondary"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(e.id, e.title)}
                    aria-label="삭제"
                    className="flex h-9 w-9 min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-destructive active:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </AdminShell>
  );
};

const StatCard = ({ label, value, accent }: { label: string; value: number; accent?: boolean }) => (
  <div
    className={`rounded-xl border p-4 ${accent ? "border-primary/40 bg-primary/5" : "border-border bg-card"}`}
  >
    <p className="text-[10px] font-medium tracking-[0.25em] text-muted-foreground">{label}</p>
    <p
      className={`mt-1 font-serif text-2xl ${accent ? "text-primary" : "text-foreground"}`}
    >
      {value}
    </p>
  </div>
);

export default AdminDashboard;
