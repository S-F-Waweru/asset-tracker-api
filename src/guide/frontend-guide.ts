export const frontendGuideHtml = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Asset Tracker API — Frontend Integration Guide</title>
<style>
  :root{
    --bg:#0b0f17; --bg-2:#10151f; --panel:#141a26; --line:#232c3d;
    --ink:#e8edf7; --muted:#8fa0bf; --accent:#279e91; --accent-soft:#4fd1c522;
    --warn:#f0b357; --danger:#f2777a; --mono:'JetBrains Mono',ui-monospace,Consolas,monospace;
    --sans:'Inter',ui-sans-serif,system-ui,sans-serif;
  }
  html[data-theme="dark"]{
    --bg:#0b0f17; --bg-2:#10151f; --panel:#141a26; --line:#232c3d;
    --ink:#e8edf7; --muted:#8fa0bf; --accent:#4fd1c5; --accent-soft:#4fd1c522;
  }
  html[data-theme="light"]{
    --bg:#f7f8fb; --bg-2:#eef0f5; --panel:#ffffff; --line:#dde2ec;
    --ink:#171b26; --muted:#5b6579; --accent:#0f8f82; --accent-soft:#0f8f8218;
    --warn:#a3660e; --danger:#c23b3e;
  }
  *{box-sizing:border-box}
  body{margin:0;font:16px/1.7 var(--sans);color:var(--ink);background:var(--bg);transition:background .2s,color .2s}
  .theme-toggle{position:fixed;top:16px;right:16px;z-index:10;display:flex;gap:2px;
      padding:3px;border:1px solid var(--line);border-radius:999px;background:var(--panel)}
  .theme-toggle button{border:none;background:transparent;color:var(--muted);font:600 .78rem var(--sans);
      padding:6px 12px;border-radius:999px;cursor:pointer}
  .theme-toggle button.active{background:var(--accent-soft);color:var(--accent)}
  .shell{max-width:920px;margin:auto;padding:48px 24px 96px}
  h1{font-size:clamp(2rem,5vw,3rem);letter-spacing:-.03em;margin:0 0 12px;line-height:1.1}
  h2{font-size:1.5rem;margin:52px 0 16px;padding-top:8px;border-top:1px solid var(--line);letter-spacing:-.01em}
  h2:first-of-type{border-top:none;padding-top:0}
  h3{font-size:1.05rem;margin:28px 0 10px;color:var(--ink)}
  .kicker{color:var(--accent);font-weight:700;letter-spacing:.12em;text-transform:uppercase;font-size:.72rem}
  .lead{color:var(--muted);font-size:1.08rem;max-width:680px;margin:14px 0 0}
  nav{position:sticky;top:16px;z-index:5;display:flex;flex-wrap:wrap;gap:4px;margin:28px 0 8px;
      padding:8px;border:1px solid var(--line);border-radius:12px;background:color-mix(in srgb,var(--panel) 92%,transparent);backdrop-filter:blur(10px)}
  nav a{font-size:.85rem;color:var(--ink);text-decoration:none;padding:6px 10px;border-radius:8px}
  nav a:hover{background:var(--accent-soft);color:var(--accent)}
  p{color:var(--ink)}
  .card,.note,.warn{padding:16px 18px;border:1px solid var(--line);border-radius:12px;background:var(--panel);margin:16px 0}
  .note{border-left:3px solid var(--accent)}
  .warn{border-left:3px solid var(--warn)}
  .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin:18px 0}
  .grid .card{margin:0}
  .grid .card b{display:block;color:var(--accent);font-size:.85rem;margin-bottom:4px}
  code{font-family:var(--mono);font-size:.88em;color:var(--ink);background:var(--accent-soft);padding:2px 6px;border-radius:5px}
  pre{position:relative;margin:14px 0 20px;padding:20px;border:1px solid var(--line);border-radius:12px;
      overflow:auto;background:var(--bg-2);font-family:var(--mono);font-size:.86rem;line-height:1.55;color:var(--ink)}
  pre code{background:none;padding:0;color:inherit}
  table{width:100%;border-collapse:collapse;border:1px solid var(--line);border-radius:10px;overflow:hidden}
  th,td{padding:10px 12px;text-align:left;border-bottom:1px solid var(--line);font-size:.92rem}
  th{background:var(--bg-2);color:var(--accent);font-weight:600}
  tr:last-child td{border-bottom:none}
  a{color:var(--accent)}
  ol,ul{color:var(--ink);padding-left:22px}
  li{margin:6px 0}
  .checklist li{list-style:none;margin:8px 0;display:flex;gap:8px;align-items:flex-start}
  .checklist input{accent-color:var(--accent);margin-top:3px}
  .step-label{display:inline-block;font-family:var(--mono);font-size:.72rem;color:var(--accent);
      background:var(--accent-soft);border-radius:6px;padding:2px 8px;margin-bottom:8px}
  @media(max-width:640px){ .shell{padding:24px 16px 72px} nav{position:static} }
</style>
</head>
<body>
<div class="theme-toggle" role="group" aria-label="Theme">
  <button type="button" data-theme-btn="dark">Dark</button>
  <button type="button" data-theme-btn="light">Light</button>
</div>
<main class="shell">

  <div class="kicker">Intern onboarding · Asset Tracker API</div>
  <h1>Connect a frontend to the Asset Tracker API</h1>
  <p class="lead">A hands-on path from an empty project to a working login screen and a JWT-authenticated asset list, using the API exactly as it's built today — no extra services, no assumed features.</p>

  <nav>
    <a href="#start">Start API</a><a href="#flow">Request flow</a><a href="#test">Test first</a>
    <a href="#js">JavaScript</a><a href="#angular">Angular</a><a href="#errors">Errors</a>
    <a href="#deploy">Deploy</a><a href="#checklist">Checklist</a>
  </nav>

  <h2 id="architecture">Concepts you'll use</h2>
  <div class="grid">
    <div class="card"><b>Component</b>Owns one visible piece of UI, e.g. the login form or the asset list.</div>
    <div class="card"><b>Service</b>Plain class that talks to the API. No HTML lives here.</div>
    <div class="card"><b>HttpClient</b>Angular's HTTP tool. Sends typed requests, returns Observables.</div>
    <div class="card"><b>Interceptor</b>Runs on every outgoing request. Ours attaches the JWT automatically.</div>
    <div class="card"><b>Guard</b>Blocks a route until the user is authenticated.</div>
  </div>
  <div class="note"><strong>The full journey:</strong> a click in a component → the component calls a service → <code>HttpClient</code> builds the request → the interceptor adds the JWT → the API checks the token → typed JSON comes back → the component updates the page.</div>

  <h2 id="start">Step 1 — Start the API</h2>
  <ol>
    <li>Open a terminal in the API project.</li>
    <li>Install dependencies once: <code>npm install</code></li>
    <li>Start the dev server: <code>npm run start:dev</code></li>
    <li>Open <a href="http://localhost:3000/reference">http://localhost:3000/reference</a> — this is the live Scalar reference for every endpoint. If it loads, the API is ready.</li>
  </ol>
  <div class="note"><strong>Base URL:</strong> everything in this guide starts with <code>http://localhost:3000</code>. Login is <code>http://localhost:3000/auth/login</code>.</div>

  <h2 id="flow">Step 2 — The request flow</h2>
  <ol>
    <li>A new user sends email + password to <code>POST /auth/register</code>.</li>
    <li>The same credentials go to <code>POST /auth/login</code>.</li>
    <li>Login responds with <code>access_token</code>.</li>
    <li>The frontend stores that token for the current session.</li>
    <li>Every <code>/assets</code> request sends <code>Authorization: Bearer &lt;token&gt;</code>.</li>
    <li>The API only ever returns assets owned by that logged-in user.</li>
  </ol>
  <div class="warn"><strong>Don't hard-code a token.</strong> It's issued fresh on every login. This guide uses <code>sessionStorage</code>, which clears when the tab closes — fine for learning, not a production policy decision.</div>

  <h2 id="test">Step 3 — Test the API before writing any frontend code</h2>
  <p>Proving the API works first makes it much easier to tell a backend bug from a frontend bug later.</p>
  <ol>
    <li>Open <a href="http://localhost:3000/reference">/reference</a>.</li>
    <li>Under <strong>Authentication</strong>, call <code>POST /auth/register</code> with an unused email and a 6+ character password.</li>
    <li>Call <code>POST /auth/login</code> and copy the returned <code>access_token</code>.</li>
    <li>Click <strong>Authorize</strong>, paste the token.</li>
    <li>Under <strong>Assets</strong>, call <code>POST /assets</code> to create one, then <code>GET /assets</code> to confirm it appears.</li>
  </ol>
  <pre><code>{
  "name": "Apple Inc.",
  "type": "stock",
  "quantity": 10,
  "purchasePrice": 185.5,
  "currency": "USD"
}</code></pre>

  <h2 id="js">Path A — Plain JavaScript</h2>

  <span class="step-label">STEP A1</span>
  <h3>A small API helper</h3>
  <p>Create <code>api.js</code>. It attaches the token when one exists, parses JSON, and turns error responses into thrown errors.</p>
  <pre><code>const API_URL = 'http://localhost:3000';

export async function request(path, options = {}) {
  const token = sessionStorage.getItem('assetTrackerToken');
  const response = await fetch(API_URL + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: 'Bearer ' + token } : {}),
      ...options.headers,
    },
  });
  const body = await response.json();
  if (!response.ok) {
    throw new Error(typeof body.message === 'string' ? body.message : 'Request failed');
  }
  return body;
}</code></pre>

  <span class="step-label">STEP A2</span>
  <h3>Log in and store the token</h3>
  <pre><code>import { request } from './api.js';

export async function login(email, password) {
  const result = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  sessionStorage.setItem('assetTrackerToken', result.access_token);
}</code></pre>

  <span class="step-label">STEP A3</span>
  <h3>Load and render assets</h3>
  <p>Every response is wrapped by the API's global interceptor, so read the payload from <code>result.data</code>, not <code>result</code> directly.</p>
  <pre><code>export async function loadAssets() {
  const result = await request('/assets?page=1&limit=10');
  return result.data.items;
}

loadAssets().then((assets) => {
  document.querySelector('#asset-list').innerHTML = assets
    .map((a) => \`&lt;li&gt;\${a.name}: \${a.quantity} \${a.currency}&lt;/li&gt;\`)
    .join('');
});</code></pre>

  <h2 id="angular">Path B — Angular</h2>
  <p>This path shows the real production flow: <strong>UI → component → service → interceptor → API → typed response → UI</strong>.</p>

  <span class="step-label">STEP B1</span>
  <h3>Create and run the project</h3>
  <ol>
    <li>Install the CLI once: <code>npm install -g @angular/cli</code></li>
    <li><code>ng new asset-tracker-web --standalone --routing --style=css</code></li>
    <li><code>cd asset-tracker-web && ng serve</code></li>
    <li>Open <code>http://localhost:4200</code>. Leave the API running on port 3000 at the same time.</li>
  </ol>

  <span class="step-label">STEP B2</span>
  <h3>CORS is already open for this origin</h3>
  <p>The API's <code>main.ts</code> currently allows exactly one origin: <code>http://localhost:4200</code>. This is hard-coded, not read from an environment variable — keep that in mind for the deployment step below.</p>

  <span class="step-label">STEP B3</span>
  <h3>Generate the feature files</h3>
  <pre><code>ng generate component features/auth/login --standalone
ng generate component features/assets/asset-list --standalone
ng generate service core/auth
ng generate service core/assets
ng generate interceptor core/auth</code></pre>

  <span class="step-label">STEP B4</span>
  <h3>Register HttpClient and the interceptor</h3>
  <p>Replace <code>src/app/app.config.ts</code>:</p>
  <pre><code>import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(withInterceptors([authInterceptor]))],
};</code></pre>

  <span class="step-label">STEP B5</span>
  <h3>Type the API responses</h3>
  <p>Create <code>src/app/core/api.models.ts</code>:</p>
  <pre><code>export interface LoginResponse { access_token: string; }

export interface Asset {
  id: number; name: string; type: string; quantity: number;
  purchasePrice: number; currency: string; createdAt: string;
}
export interface CreateAssetDto {
  name: string; type: string; quantity: number;
  purchasePrice: number; currency?: string;
}
export interface AssetPage { items: Asset[]; total: number; page: number; limit: number; }
export interface ApiResponse&lt;T&gt; { success: true; data: T; }</code></pre>

  <span class="step-label">STEP B6</span>
  <h3>Auth service</h3>
  <p>Replace <code>src/app/core/auth.service.ts</code>:</p>
  <pre><code>import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginResponse } from './api.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = 'http://localhost:3000';
  private readonly tokenKey = 'assetTrackerToken';
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable&lt;LoginResponse&gt; {
    return this.http.post&lt;LoginResponse&gt;(this.apiUrl + '/auth/login', { email, password }).pipe(
      tap((res) => sessionStorage.setItem(this.tokenKey, res.access_token)),
    );
  }
  register(email: string, password: string) {
    return this.http.post(this.apiUrl + '/auth/register', { email, password });
  }
  getToken(): string | null { return sessionStorage.getItem(this.tokenKey); }
  isLoggedIn(): boolean { return !!this.getToken(); }
  logout(): void { sessionStorage.removeItem(this.tokenKey); }
}</code></pre>

  <span class="step-label">STEP B7</span>
  <h3>Attach the JWT automatically</h3>
  <p>Replace <code>src/app/core/auth.interceptor.ts</code>:</p>
  <pre><code>import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const token = sessionStorage.getItem('assetTrackerToken');
  if (!token) return next(request);
  return next(request.clone({ setHeaders: { Authorization: 'Bearer ' + token } }));
};</code></pre>

  <span class="step-label">STEP B8</span>
  <h3>Assets service</h3>
  <p>Replace <code>src/app/core/assets.service.ts</code>. No Authorization header here — the interceptor already added it.</p>
  <pre><code>import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Asset, AssetPage, CreateAssetDto } from './api.models';

@Injectable({ providedIn: 'root' })
export class AssetsService {
  private readonly apiUrl = 'http://localhost:3000/assets';
  constructor(private http: HttpClient) {}

  list(page = 1, limit = 10): Observable&lt;ApiResponse&lt;AssetPage&gt;&gt; {
    const params = new HttpParams().set('page', page).set('limit', limit);
    return this.http.get&lt;ApiResponse&lt;AssetPage&gt;&gt;(this.apiUrl, { params });
  }
  create(dto: CreateAssetDto): Observable&lt;ApiResponse&lt;Asset&gt;&gt; {
    return this.http.post&lt;ApiResponse&lt;Asset&gt;&gt;(this.apiUrl, dto);
  }
  remove(id: number): Observable&lt;ApiResponse&lt;{ id: number }&gt;&gt; {
    return this.http.delete&lt;ApiResponse&lt;{ id: number }&gt;&gt;(this.apiUrl + '/' + id);
  }
}</code></pre>

  <span class="step-label">STEP B9</span>
  <h3>Login component</h3>
  <p>Replace <code>src/app/features/auth/login/login.component.ts</code>:</p>
  <pre><code>import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-login', standalone: true, imports: [FormsModule],
  template: \`&lt;h1&gt;Sign in&lt;/h1&gt;
  &lt;form (ngSubmit)="submit()"&gt;
    &lt;label&gt;Email &lt;input name="email" [(ngModel)]="email" type="email" required&gt;&lt;/label&gt;&lt;br&gt;
    &lt;label&gt;Password &lt;input name="password" [(ngModel)]="password" type="password" required&gt;&lt;/label&gt;&lt;br&gt;
    &lt;button [disabled]="loading"&gt;{{ loading ? 'Signing in...' : 'Sign in' }}&lt;/button&gt;
  &lt;/form&gt;
  &lt;p *ngIf="error"&gt;{{ error }}&lt;/p&gt;\`,
})
export class LoginComponent {
  private auth = inject(AuthService); private router = inject(Router);
  email = ''; password = ''; loading = false; error = '';
  submit(): void {
    this.loading = true; this.error = '';
    this.auth.login(this.email, this.password).subscribe({
      next: () => this.router.navigateByUrl('/assets'),
      error: (err) => { this.error = err.error?.message ?? 'Login failed'; this.loading = false; },
    });
  }
}</code></pre>

  <span class="step-label">STEP B10</span>
  <h3>Asset list component</h3>
  <p>Replace <code>src/app/features/assets/asset-list/asset-list.component.ts</code>:</p>
  <pre><code>import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Asset } from '../../../core/api.models';
import { AssetsService } from '../../../core/assets.service';

@Component({
  selector: 'app-asset-list', standalone: true, imports: [CommonModule],
  template: \`&lt;h1&gt;My assets&lt;/h1&gt;
  &lt;p *ngIf="loading"&gt;Loading...&lt;/p&gt;
  &lt;p *ngIf="error"&gt;{{ error }}&lt;/p&gt;
  &lt;ul&gt;&lt;li *ngFor="let asset of assets"&gt;{{ asset.name }} — {{ asset.quantity }} {{ asset.currency }}&lt;/li&gt;&lt;/ul&gt;\`,
})
export class AssetListComponent implements OnInit {
  private assetsApi = inject(AssetsService);
  assets: Asset[] = []; loading = true; error = '';
  ngOnInit(): void {
    this.assetsApi.list().subscribe({
      next: (result) => { this.assets = result.data.items; this.loading = false; },
      error: (err) => { this.error = err.error?.message ?? 'Could not load assets'; this.loading = false; },
    });
  }
}</code></pre>

  <span class="step-label">STEP B11</span>
  <h3>Routes</h3>
  <p>Replace <code>src/app/app.routes.ts</code>, then place <code>&lt;router-outlet /&gt;</code> in your root component template.</p>
  <pre><code>import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { AssetListComponent } from './features/assets/asset-list/asset-list.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'assets', component: AssetListComponent },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
];</code></pre>

  <span class="step-label">STEP B12</span>
  <h3>Verify the whole flow</h3>
  <ol>
    <li>Register a user via <code>/reference</code>, or a form calling <code>AuthService.register()</code>.</li>
    <li>Open <code>http://localhost:4200/login</code> and sign in.</li>
    <li>DevTools → Application → Session Storage: confirm <code>assetTrackerToken</code> exists.</li>
    <li>DevTools → Network → visit <code>/assets</code> and confirm the request carries <code>Authorization: Bearer ...</code>.</li>
    <li>Confirm the response body has <code>success</code> and <code>data.items</code>.</li>
  </ol>

  <h2 id="errors">Step 4 — Handle status codes</h2>
  <table>
    <tr><th>Status</th><th>Meaning</th><th>Frontend action</th></tr>
    <tr><td>200</td><td>Request succeeded</td><td>Read <code>body.data</code></td></tr>
    <tr><td>201</td><td>Asset or valuation created</td><td>Show confirmation, refresh the list</td></tr>
    <tr><td>400</td><td>Validation failed</td><td>Show the field(s) to correct</td></tr>
    <tr><td>401</td><td>Token missing/invalid/expired</td><td>Clear the token, redirect to login</td></tr>
    <tr><td>404</td><td>Asset not found for this user</td><td>Return to the list, show a message</td></tr>
  </table>
  <p>For create, update, and delete actions: call the service, check the result, then refresh the displayed list. Never trust an ID typed into the page — the API enforces ownership using the token, not the ID alone.</p>
>

  <h2 id="checklist">Completion checklist</h2>
  <ul class="checklist">
    <li><label><input type="checkbox"> Started the API and opened <code>/reference</code></label></li>
    <li><label><input type="checkbox"> Registered and logged in via <code>/reference</code></label></li>
    <li><label><input type="checkbox"> Created an asset and confirmed it via <code>GET /assets</code></label></li>
    <li><label><input type="checkbox"> Built a JavaScript or Angular project</label></li>
    <li><label><input type="checkbox"> Kept the API base URL in one place</label></li>
    <li><label><input type="checkbox"> Built a login form with a visible error state</label></li>
    <li><label><input type="checkbox"> Store the JWT only after login succeeds; clear it on logout</label></li>
    <li><label><input type="checkbox"> Confirmed <code>Authorization: Bearer ...</code> in DevTools on a protected request</label></li>
    <li><label><input type="checkbox"> Rendered the signed-in user's assets from <code>result.data.items</code></label></li>
    <li><label><input type="checkbox"> Handled 400, 401, and 404 in the UI</label></li>
    <li><label><input type="checkbox"> Deployed the API and pointed the frontend at the deployed URL</label></li>
  </ul>

  <h2>Next steps once the basics work</h2>
  <ul class="checklist">
    <li><label><input type="checkbox"> Build real registration/login forms</label></li>
    <li><label><input type="checkbox"> Add a logout control</label></li>
    <li><label><input type="checkbox"> Add a route guard that redirects unauthenticated users to <code>/login</code></label></li>
    <li><label><input type="checkbox"> Add an asset creation form calling <code>AssetsService.create()</code></label></li>
    <li><label><input type="checkbox"> Add edit/delete controls that refresh the list on success</label></li>
    <li><label><input type="checkbox"> Add valuation and performance screens</label></li>
    <li><label><input type="checkbox"> Add loading, empty, and error states everywhere</label></li>
    <li><label><input type="checkbox"> Format currency and dates with Angular's built-in pipes</label></li>
  </ul>

</main>
<script>
  (function () {
    var root = document.documentElement;
    var buttons = document.querySelectorAll('[data-theme-btn]');

    function apply(theme) {
      root.setAttribute('data-theme', theme);
      buttons.forEach(function (b) {
        b.classList.toggle('active', b.dataset.themeBtn === theme);
      });
    }

    var saved = localStorage.getItem('asset-tracker-guide-theme');
    apply(saved || 'dark');

    buttons.forEach(function (b) {
      b.addEventListener('click', function () {
        localStorage.setItem('asset-tracker-guide-theme', b.dataset.themeBtn);
        apply(b.dataset.themeBtn);
      });
    });
  })();
</script>
</body>
</html>
`;
