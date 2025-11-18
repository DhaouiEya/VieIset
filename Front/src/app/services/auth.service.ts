import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserModel } from '../models/user.model';
import {
  BehaviorSubject,
  catchError,
  finalize,
  map,
  Observable,
  of,
  Subscription,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:9000/api/auth';
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  private authLocalStorageToken = 'authenticationToken';
  private temporaryAuth: any | null = null;

  currentUser$: Observable<UserModel | null>;
  currentUserSubject: BehaviorSubject<UserModel | null>;

  get currentUserValue(): UserModel | null {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: UserModel | null) {
    this.currentUserSubject.next(user);
  }

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<UserModel | null>(null);
    this.currentUser$ = this.currentUserSubject.asObservable();
    const subscr = this.getUserByToken().subscribe();
    this.unsubscribe.push(subscr);
  }

  login(email: string, password: string, role:string,keepMeLoggedIn: boolean): Observable<UserModel> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password, keepMeLoggedIn })
      .pipe(
        map(res => {
          if (res && res.authToken) {
            // Stocker le token et user
            this.setAuthFromLocalStorage({ ...res.user, authToken: res.authToken, refreshToken: res.refreshToken });
            this.currentUserSubject.next(res.user);
          }
          return res;
        }),
        catchError(err => {
          console.error('Login error:', err);
          return of(err);
        })
      );
  }
  // Register
  register(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/`, data).pipe(
      map((res: any) => {
        console.log('Registration successful:', res);
        this.setAuthFromLocalStorage(res);
        return res;
      })
    );
  }


    // Mot de passe oublié
  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/request-password-reset`, { email });
  }

  // Réinitialisation du mot de passe
  resetPassword(password: string, token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { password, token });
  }


  // Verify Email
  verifyEmail(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/verify-email/${token}`);
  }

  // Resend Verification Email
  resendVerificationEmail(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/resendVerificationEmail`, { email });
  }

  // Google Login
  googleLogin(
    idToken: string,
    keepmeloggedin: boolean = false
  ): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/google-login`, {
        idToken,
        keepmeloggedin,
      })
      .pipe(
        map((res: any) => {
          this.setAuthFromLocalStorage(res);
          return res;
        })
      );
  }


updateUserProfile(updates: any): Observable<any> {
  const token = this.getAuthFromLocalStorage()?.authToken;
  const headers = { Authorization: `Bearer ${token}` };

  return this.http.put<any>(`${this.apiUrl}/update-profile`, updates, { headers });
}


   // Me (need JWT in headers)

  me(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/me`, { headers });
  }

  // Load current user using token stored in local storage (if any)
  getUserByToken(): Observable<UserModel | undefined> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }
    return this.me(auth.authToken).pipe(
      map((res: any) => {
        const user = res as UserModel;
        this.currentUserSubject.next(user);
        return user;
      }),
      catchError((error) => {
        console.error('Error fetching user by token:', error);
        return of(undefined);
      })
    );
  }

  private setAuthFromLocalStorage(auth: UserModel): boolean {
    // store auth authToken/refreshToken/epiresIn in local storage to keep user logged in between page refreshes

    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      if (auth && auth.authToken) {
        localStorage.setItem(this.authLocalStorageToken, JSON.stringify(auth));
        return true;
      }
    }
    return false;
  }

  private getAuthFromLocalStorage(): UserModel | undefined {
    try {
      if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        const lsValue = localStorage.getItem(this.authLocalStorageToken);
        if (!lsValue) {
          return undefined;
        }
        const authData = JSON.parse(lsValue);
        return authData;
      } else {
        return undefined;
      }
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  getToken() {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }
    return auth.authToken;
  }
}
