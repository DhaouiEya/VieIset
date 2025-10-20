import { Routes } from '@angular/router';
 import { ResponsableDashboardComponent } from './responsable-club/responsable-dashboard/responsable-dashboard.component';
 import { PublicationPostComponent } from './responsable-club/publication-post/publication-post.component';
import { EventCreateComponent } from './components/event-create/event-create.component';
import { EventDetailComponent } from './components/event-detail/event-detail.component';
import { EventListComponent } from './components/event-list/event-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/events', pathMatch: 'full' },
   { path: 'dashboard', component: ResponsableDashboardComponent },
  { path: 'publications', component: PublicationPostComponent },
  { path: 'events', component: EventListComponent },
  { path: 'events/create', component: EventCreateComponent },
  { path: 'events/:id', component: EventDetailComponent },
]

