import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminShell, { Field, PrimaryBtn, inputCls, textareaCls } from "@/components/admin/AdminShell";
import { useEvents } from "@/contexts/EventsContext";
import { computeStatus, type EventSeed } from "@/data/events";
import { toast } from "@/hooks/use-toast";

type FormState = Omit<EventSeed, "id" | "notes"> & { notes: string };

const TAGS: EventSeed["tag"][] = ["NEW", "HOT", "LIMITED"];
const MAX_IMAGE_BYTES = 1024 * 1024; // 1MB (DataURL은 ~1.33배 커짐)

const toLocalDT = (iso: string) => {
  // ISO -> "YYYY-MM-DDTHH:mm" (input[type=datetime-local])
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
const fromLocalDT = (v: string) => (v ? new Date(v).toISOString() : "");

const empty: FormState = {
  title: "",
  subtitle: "",
  brand: "",
  image: "",
  tag: "NEW",
  startDate: "",
  endDate: "",
  reward: "",
  benefit: "",
  description: "",
  notes: "",
};

const AdminEventForm = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const { getSeed, addEvent, updateEvent } = useEvents();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    const seed = getSeed(id!);
    if (!seed) {
      setNotFound(true);
      return;
    }
    setForm({
      title: seed.title,
      subtitle: seed.subtitle,
      brand: seed.brand,
      image: seed.image,
      tag: seed.tag,
      startDate: seed.startDate,
      endDate: seed.endDate,
      reward: seed.reward,
      benefit: seed.benefit,
      description: seed.description,
      notes: seed.notes.join("\n"),
    });
  }, [id, isEdit, getSeed]);

  const status = useMemo(() => {
    if (!form.startDate || !form.endDate) return null;
    return computeStatus(form.startDate, form.endDate);
  }, [form.startDate, form.endDate]);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const onImageFile = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "이미지 파일만 업로드 가능합니다.", variant: "destructive" });
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      toast({
        title: "이미지가 너무 큽니다",
        description: "1MB 이하 이미지를 사용해 주세요. (또는 이미지 URL을 입력)",
        variant: "destructive",
      });
      return;
    }
    const dataUrl: string = await new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(String(r.result));
      r.onerror = () => rej(r.error);
      r.readAsDataURL(file);
    });
    set("image", dataUrl);
  };

  const validate = () => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.title.trim() || form.title.length > 80) e.title = "제목은 1~80자입니다.";
    if (!form.brand.trim() || form.brand.length > 40) e.brand = "브랜드는 1~40자입니다.";
    if (!form.subtitle.trim() || form.subtitle.length > 120) e.subtitle = "1~120자";
    if (!form.benefit.trim() || form.benefit.length > 40) e.benefit = "1~40자 (예: 30% OFF)";
    if (!form.reward.trim() || form.reward.length > 200) e.reward = "1~200자";
    if (!form.description.trim() || form.description.length > 1000) e.description = "1~1000자";
    if (!form.image.trim()) e.image = "이미지 URL 또는 파일을 등록하세요.";
    if (!form.startDate) e.startDate = "시작일을 입력하세요.";
    if (!form.endDate) e.endDate = "종료일을 입력하세요.";
    if (form.startDate && form.endDate && new Date(form.startDate) >= new Date(form.endDate)) {
      e.endDate = "종료일은 시작일 이후여야 합니다.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const notes = form.notes
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 10);
      const payload: Omit<EventSeed, "id"> = {
        title: form.title.trim(),
        subtitle: form.subtitle.trim(),
        brand: form.brand.trim(),
        image: form.image.trim(),
        tag: form.tag,
        startDate: form.startDate,
        endDate: form.endDate,
        reward: form.reward.trim(),
        benefit: form.benefit.trim(),
        description: form.description.trim(),
        notes,
      };
      if (isEdit && id) {
        updateEvent(id, payload);
        toast({ title: "이벤트가 수정되었어요" });
      } else {
        addEvent(payload);
        toast({ title: "이벤트가 등록되었어요" });
      }
      navigate("/admin", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  if (notFound) {
    return (
      <AdminShell title="이벤트 없음" back="/admin">
        <p className="rounded-2xl border border-dashed border-border bg-secondary/30 p-6 text-center text-xs text-muted-foreground">
          존재하지 않는 이벤트입니다.
        </p>
      </AdminShell>
    );
  }

  return (
    <AdminShell title={isEdit ? "이벤트 수정" : "새 이벤트"} back="/admin">
      <form onSubmit={submit} className="space-y-4">
        <Field label="브랜드명" error={errors.brand}>
          <input
            value={form.brand}
            onChange={(e) => set("brand", e.target.value)}
            className={inputCls}
            placeholder="예: MAISON NOIR"
          />
        </Field>
        <Field label="이벤트명" error={errors.title}>
          <input
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="서브 카피" error={errors.subtitle}>
          <input
            value={form.subtitle}
            onChange={(e) => set("subtitle", e.target.value)}
            className={inputCls}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="태그">
            <select
              value={form.tag}
              onChange={(e) => set("tag", e.target.value as EventSeed["tag"])}
              className={inputCls}
            >
              {TAGS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
          <Field label="혜택 요약" error={errors.benefit} hint="예: 30% OFF">
            <input
              value={form.benefit}
              onChange={(e) => set("benefit", e.target.value)}
              className={inputCls}
            />
          </Field>
        </div>

        <Field label="이벤트 이미지" error={errors.image} hint="URL 입력 또는 파일 업로드 (≤ 1MB)">
          <input
            value={form.image.startsWith("data:") ? "" : form.image}
            onChange={(e) => set("image", e.target.value)}
            className={inputCls}
            placeholder="https://..."
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onImageFile(e.target.files?.[0])}
            className="mt-2 block w-full text-[11px] text-muted-foreground file:mr-3 file:rounded-full file:border-0 file:bg-secondary file:px-3 file:py-2 file:text-[11px] file:text-foreground"
          />
          {form.image ? (
            <img
              src={form.image}
              alt="미리보기"
              className="mt-2 h-32 w-full rounded-lg border border-border object-cover"
            />
          ) : null}
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="시작 일시" error={errors.startDate}>
            <input
              type="datetime-local"
              value={toLocalDT(form.startDate)}
              onChange={(e) => set("startDate", fromLocalDT(e.target.value))}
              className={inputCls}
            />
          </Field>
          <Field label="종료 일시" error={errors.endDate}>
            <input
              type="datetime-local"
              value={toLocalDT(form.endDate)}
              onChange={(e) => set("endDate", fromLocalDT(e.target.value))}
              className={inputCls}
            />
          </Field>
        </div>
        {status ? (
          <p className="text-[11px] text-muted-foreground">
            현재 시간 기준 상태:{" "}
            <span className="font-semibold text-foreground">
              {status === "ongoing" ? "진행 중" : status === "upcoming" ? "예정" : "종료"}
            </span>
          </p>
        ) : null}

        <Field label="혜택 상세" error={errors.reward}>
          <input
            value={form.reward}
            onChange={(e) => set("reward", e.target.value)}
            className={inputCls}
            placeholder="예: 정품 향수 5ml + 시향 카드 3종"
          />
        </Field>
        <Field label="설명" error={errors.description}>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            className={textareaCls}
          />
        </Field>
        <Field label="향 노트 (한 줄에 하나씩)" hint="최대 10줄">
          <textarea
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            className={textareaCls}
            placeholder={"Top — Bergamot\nHeart — Rose\nBase — Oud"}
          />
        </Field>

        <PrimaryBtn type="submit" loading={loading}>
          {isEdit ? "변경사항 저장" : "이벤트 등록"}
        </PrimaryBtn>
      </form>
    </AdminShell>
  );
};

export default AdminEventForm;
