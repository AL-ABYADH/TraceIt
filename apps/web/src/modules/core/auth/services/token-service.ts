type TokenChangeCallback = (token: string | null) => void;
type UnauthorizedCallback = () => void;

class TokenService {
  private token: string | null = null;
  private subs: TokenChangeCallback[] = [];
  private unauthorizedSubs: UnauthorizedCallback[] = [];

  getToken() {
    return this.token;
  }

  setToken(token: string | null) {
    this.token = token;
    this.subs.forEach((cb) => cb(token));
  }

  clear() {
    this.setToken(null);
  }

  subscribe(cb: TokenChangeCallback) {
    this.subs.push(cb);
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
}

export const tokenService = new TokenService();
