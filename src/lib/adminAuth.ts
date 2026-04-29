// 클라이언트 단독 관리자 인증 (데모/프로토타입 용도)
// 비밀번호는 SHA-256 + per-account salt로 해시 후 localStorage 보관.
// 진정한 보안이 필요하면 Lovable Cloud 인증으로 전환 권장.

const ACCOUNT_KEY = "perfume_admin";
const SESSION_KEY = "perfume_admin_session";

export type AdminAccount = {
  username: string;
  salt: string;
  hash: string;
  createdAt: string;
};

const toHex = (buf: ArrayBuffer) =>
  Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

const randomHex = (bytes = 16) => {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

const sha256 = async (text: string) => {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return toHex(buf);
};

export const hashPassword = async (password: string, salt: string) =>
  sha256(`${salt}::${password}`);

export const getAdminAccount = (): AdminAccount | null => {
  try {
    const raw = localStorage.getItem(ACCOUNT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed.username === "string" &&
      typeof parsed.salt === "string" &&
      typeof parsed.hash === "string"
    ) {
      return parsed as AdminAccount;
    }
    return null;
  } catch {
    return null;
  }
};

export const hasAdminAccount = () => !!getAdminAccount();

export const createAdminAccount = async (username: string, password: string) => {
  const salt = randomHex(16);
  const hash = await hashPassword(password, salt);
  const account: AdminAccount = {
    username: username.trim(),
    salt,
    hash,
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
  return account;
};

export const verifyCredentials = async (username: string, password: string) => {
  const acc = getAdminAccount();
  if (!acc) return false;
  if (acc.username !== username.trim()) return false;
  const hash = await hashPassword(password, acc.salt);
  // constant-time-ish compare
  if (hash.length !== acc.hash.length) return false;
  let diff = 0;
  for (let i = 0; i < hash.length; i++) diff |= hash.charCodeAt(i) ^ acc.hash.charCodeAt(i);
  return diff === 0;
};

export const updateAdminPassword = async (currentPw: string, newPw: string) => {
  const acc = getAdminAccount();
  if (!acc) throw new Error("관리자 계정이 없습니다.");
  const ok = await verifyCredentials(acc.username, currentPw);
  if (!ok) throw new Error("현재 비밀번호가 일치하지 않습니다.");
  const salt = randomHex(16);
  const hash = await hashPassword(newPw, salt);
  const next: AdminAccount = { ...acc, salt, hash };
  localStorage.setItem(ACCOUNT_KEY, JSON.stringify(next));
};

// --- session ---
export const startSession = (username: string) => {
  sessionStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ username, at: new Date().toISOString() }),
  );
};

export const endSession = () => sessionStorage.removeItem(SESSION_KEY);

export const isLoggedIn = () => {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    const acc = getAdminAccount();
    return !!parsed?.username && !!acc && parsed.username === acc.username;
  } catch {
    return false;
  }
};
