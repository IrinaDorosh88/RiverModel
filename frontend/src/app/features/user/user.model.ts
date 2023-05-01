import { BehaviorSubject, Observable } from 'rxjs';
import jwtDecode from 'jwt-decode';

export class User {
  private static instance$$;

  static {
    this.instance$$ = new BehaviorSubject<User | null>(null);
  }

  // private constructor(
  //   public readonly token: string,
  //   public readonly login: string,
  //   public readonly role: string
  // ) {}

  private constructor(
    public readonly token: string,
    public readonly login: string
  ) {}

  public static get$(): Observable<User | null> {
    return this.instance$$;
  }

  public static get() {
    return this.instance$$.value;
  }

  public static unset() {
    this.instance$$.next(null);
  }

  // public static fromToken(token: string) {
  //   const payload: { sub: string; role: string } = jwtDecode(token);
  //   this.instance$$.next(new User(token, payload['sub'], payload['role']));
  //   console.log(payload);
  // }

  public static fromToken(token: string) {
    const payload: { sub: string } = jwtDecode(token);
    this.instance$$.next(new User(token, payload['sub']));
  }
}
