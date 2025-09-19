type TokenChangeCallback = (token: string | null) => void;
type UnauthorizedCallback = () => void;

const STORAGE_KEY = "traceit_access_token";

class TokenService {
  private token: string | null = null;
  private subs: TokenChangeCallback[] = [];
  private unauthorizedSubs: UnauthorizedCallback[] = [];

  private readFromStorage(): string | null {
    try {
      if (typeof window === "undefined") return null;
      const v = localStorage.getItem(STORAGE_KEY);
      return v ?? null;
    } catch (e) {
      return null;
    }
  }

  private writeToStorage(token: string | null) {
    try {
      if (typeof window === "undefined") return;
      if (token == null) {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(STORAGE_KEY, token);
      }
    } catch (e) {
      // ignore write errors
    }
  }

  // If token was not loaded into memory yet, try reading from storage lazily
  getToken() {
    if (this.token == null) {
      this.token = this.readFromStorage();
    }
    return this.token;
  }

  // Set token in memory, persist to storage (client only) and notify subscribers
  setToken(token: string | null) {
    this.token = token;
    this.writeToStorage(token);
    // notify subscribers
    this.subs.forEach((cb) => cb(token));
  }

  // Subscribe: returns an unsubscribe function. Call the subscriber immediately
  // with current token so callers get an initial value without additional code.
  subscribe(cb: TokenChangeCallback) {
    this.subs.push(cb);
    // immediately deliver current token (so Redux/store can sync on subscribe)
    cb(this.getToken());
    return () => {
      this.subs = this.subs.filter((x) => x !== cb);
    };
  }

  onUnauthorized(cb: UnauthorizedCallback) {
    this.unauthorizedSubs.push(cb);
    return () => {
      this.unauthorizedSubs = this.unauthorizedSubs.filter((x) => x !== cb);
    };
  }

  emitUnauthorized() {
    this.unauthorizedSubs.forEach((cb) => cb());
  }

  // Optional helper to clear everything (memory + storage + notify)
  clear() {
    this.setToken(null);
    this.unauthorizedSubs.forEach((cb) => cb());
  }
}

export const tokenService = new TokenService();
