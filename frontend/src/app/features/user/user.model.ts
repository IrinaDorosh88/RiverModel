import { BehaviorSubject, Observable } from 'rxjs';
import jwtDecode from 'jwt-decode';

export class User {
  private static instance$$: BehaviorSubject<User | undefined>;

  static {
    this.instance$$ = new BehaviorSubject<User | undefined>(undefined);
  }

  private constructor(
    public readonly email: string,
    public readonly role: string
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

  public static fromToken(token: string) {
    const payload: { email: string; role: string } = jwtDecode(token);
    this.fromObject(payload);
  }

  public static fromObject(json: { email: string; role: string }) {
    this.instance$$.next(new User(json['email'], json['role']));
  }
}
