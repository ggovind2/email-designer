<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->
🏗️ Project Overview
This is an Angular application built with:

Angular Version: [Specify version, e.g., 16.2.0]

TypeScript

RxJS for reactive programming

Angular CLI for project scaffolding and development

SCSS for styling

Component-based architecture

REST APIs for backend communication

📁 Project Structure
ruby
Copy
Edit
src/
├── app/
│   ├── core/             # Singleton services, interceptors, guards
│   ├── shared/           # Reusable components, pipes, directives
│   ├── features/         # Feature modules
│   ├── app.component.ts
├── assets/               # Static assets (images, translations)
├── environments/         # Environment-specific configs
└── styles/               # Global styles
🧱 Coding Conventions
Use Angular CLI to generate components, services, modules, etc.

Follow Angular Style Guide by John Papa.

Use async pipe over manual subscriptions when possible.

Group imports: Angular → 3rd Party → Application Specific.

Services and HTTP logic should live in the core/ or relevant features/ module.

Reusable components go into the shared/ folder.

📦 Component Naming & Structure
Use kebab-case for file names (e.g., user-profile.component.ts).

Use PascalCase for class names and Angular decorators.

Components should have:

.component.ts

.component.html

.component.scss

.component.spec.ts (tests)

🔌 API Integration
Use HttpClient from @angular/common/http.

Wrap API logic in a dedicated service.

Use environment.ts to manage base API URLs.

Prefer Observables over Promises.

Example:

ts
Copy
Edit
this.apiService.getUsers().subscribe(users => this.users = users);
✅ Unit Testing
Use Karma + Jasmine (default Angular test setup).

Write tests for:

Components

Services

Pipes

Place test files alongside the files being tested, suffixed with .spec.ts.

🧠 Tips for Copilot
When generating Angular code, prefer using CLI conventions and @Injectable, @Component, @NgModule, etc.

When suggesting routing or lazy loading, refer to app.route.ts.

Avoid directly manipulating the DOM; use Angular directives or Renderer2.
Use Angular Signals for state management where applicable.
Use lifecycle hooks appropriately

Suggest using ngOnInit() for initialization logic in components.

Use ng generate syntax in comments for scaffolding guidance.

🚫 Anti-Patterns to Avoid
Avoid logic in templates; use component methods or pipes.

Do not subscribe in components without unsubscribing (use async pipe or takeUntil).

Avoid using any type unless absolutely necessary.

Avoid tightly coupling services with UI components.

📄 Example CLI Commands
bash
Copy
Edit
ng generate component features/user-profile
ng generate service core/auth
ng generate module features/settings --route settings --module app
🙌 Collaboration Notes
Follow the branch naming: feature/, bugfix/, hotfix/

Pull Request titles should follow: feat:, fix:, refactor:, etc.

Write clear commit messages with context.

Always lint (ng lint) and test (ng test) before pushing.

Let’s build something amazing together — one component at a time! 🚀