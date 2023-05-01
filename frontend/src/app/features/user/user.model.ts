import { BehaviorSubject, Observable } from 'rxjs';
import jwtDecode from 'jwt-decode';

export class User {
  private static instance$$: BehaviorSubject<User | undefined>;

  static {
    this.instance$$ = new BehaviorSubject<User | undefined>(undefined);
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

  public static get$(): Observable<User | undefined> {
    return this.instance$$;
  }

  public static get() {
    return this.instance$$.value;
  }

  public static unset() {
    this.instance$$.next(undefined);
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
