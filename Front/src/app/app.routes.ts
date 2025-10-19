import { RegistrationComponent } from './components/registration/registration.component';
import { Routes } from '@angular/router';
// import { PublicationPostComponent } from './responsible-club/publication-post/publication-post.component';
import { EventCreateComponent } from './components/event-create/event-create.component';
import { EventDetailComponent } from './components/event-detail/event-detail.component';
import { EventListComponent } from './components/event-list/event-list.component';

import { CreateClubComponent } from './components/clubs/create-club/create-club.component';
import { EspaceClubComponent } from './components/clubs/espace-club/espace-club.component';

import { ResponsableDashboardComponent } from './responsable-club/responsable-dashboard/responsable-dashboard.component';
import { EmailVerificationComponent } from './components/email-verification/email-verification.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { PublicationPostComponent } from './responsable-club/publication-post/publication-post.component';
import { ParticipationFormsComponent } from './responsable-club/participation-forms/participation-forms.component';


export const routes: Routes = [
  // { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '', redirectTo: '/register', pathMatch: 'full' },
  { path: 'send-verification-email', component: EmailVerificationComponent },
  { path: 'verify-email', component: VerifyEmailComponent },
  { path: 'dashboard', component: ResponsableDashboardComponent },
  { path: 'publications', component: PublicationPostComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'events', component: EventListComponent },
  { path: 'events/create', component: EventCreateComponent },
  { path: 'events/:id', component: EventDetailComponent },

  {path: 'createClub ',component:CreateClubComponent },
//il faut  avec id 
 //  {path: 'espaceClub/:id',component:EspaceClubComponent },
  {path: 'espaceClub',component:EspaceClubComponent },

  {path: 'participation-forms', component: ParticipationFormsComponent}

]

