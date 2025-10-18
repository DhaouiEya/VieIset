import { Routes } from '@angular/router';
// import { ResponsibleDashboardComponent } from './responsible-club/responsible-dashboard/responsible-dashboard.component';
// import { PublicationPostComponent } from './responsible-club/publication-post/publication-post.component';
import { EventCreateComponent } from './components/event-create/event-create.component';
import { EventDetailComponent } from './components/event-detail/event-detail.component';
import { EventListComponent } from './components/event-list/event-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  // { path: 'dashboard', component: ResponsibleDashboardComponent },
  // { path: 'publications', component: PublicationPostComponent },
  { path: 'events', component: EventListComponent },
  { path: 'events/create', component: EventCreateComponent },
  { path: 'events/:id', component: EventDetailComponent },
]

