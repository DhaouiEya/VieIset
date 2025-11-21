import { Routes } from '@angular/router';

import { RegistrationComponent } from './components/auth/registration/registration.component';
import { VerifyEmailComponent } from './components/auth/verify-email/verify-email.component';
import { LoginComponent } from './components/auth/login/login.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { EmailVerificationComponent } from './components/auth/email-verification/email-verification.component';

import { EventCreateComponent } from './components/event-create/event-create.component';
import { EventDetailComponent } from './components/event-detail/event-detail.component';
import { EventListComponent } from './components/event-list/event-list.component';

import { CreateClubComponent } from './components/clubs/create-club/create-club.component';
import { EspaceClubComponent } from './components/clubs/espace-club/espace-club.component';
import { ClubsListComponent } from './components/clubs/clubs-list/clubs-list.component';

import { ResponsableDashboardComponent } from './responsable-club/responsable-dashboard/responsable-dashboard.component';
import { PublicationPostComponent } from './responsable-club/publication-post/publication-post.component';

import { LogementComponent } from './components/logement/logement.component';
import { AdmindashboardComponent } from './admin/admindashboard/admindashboard.component';
import { CompagneComponent } from './admin/compagne/compagne.component';
import { MyClubComponent } from './components/clubs/my-club/my-club.component';
import { ProfileComponent } from './components/profile/profile/profile.component';
import { ParticipationFormsComponent } from './components/responsable-club/participation-forms/participation-forms.component';
import { ChatbotComponent } from './chatbot/chatbot.component';

export const routes: Routes = [
  { path: '', redirectTo: '/register', pathMatch: 'full' },

  // Auth
  { path: 'register', component: RegistrationComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'send-verification-email', component: EmailVerificationComponent },
  { path: 'verify-email', component: VerifyEmailComponent },

  // Responsable / publications / participation
  { path: 'dashboard', component: ResponsableDashboardComponent },
  { path: 'publications', component: PublicationPostComponent },
  { path: 'participation-forms', component: ParticipationFormsComponent },
  { path: 'mon-club', component: MyClubComponent },

  // Events
  { path: 'events', component: EventListComponent },
  { path: 'events/create', component: EventCreateComponent },
  { path: 'events/:id', component: EventDetailComponent },

  // Clubs
  { path: 'createClub', component: CreateClubComponent },
  { path: 'espaceClub/:id', component: EspaceClubComponent },
  { path: 'clubs', component: ClubsListComponent },

  // Other pages
  { path: 'logement', component: LogementComponent },
  { path: 'admindashboard', component: AdmindashboardComponent },
  { path: 'compagne', component: CompagneComponent },
  { path: 'profile', component: ProfileComponent },
  //{path:'chatbot', component: ChatbotComponent},

];
