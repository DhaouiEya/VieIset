import { Routes } from '@angular/router';
import { ResponsableDashboardComponent } from './responsable-club/responsable-dashboard/responsable-dashboard.component';
import { PublicationPostComponent } from './responsable-club/publication-post/publication-post.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: ResponsableDashboardComponent },
  { path: 'publications', component: PublicationPostComponent }
]
