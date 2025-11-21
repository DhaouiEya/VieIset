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
import { ReclamationsComponent } from './admin/reclamations/reclamations.component';
import { SidebarComponent } from './components/etudiant/sidebar/sidebar.component';
import { ListeReclamationsComponent } from './components/etudiant/liste-reclamations/liste-reclamations.component';
import { CreateReclamationComponent } from './components/etudiant/create-reclamation/create-reclamation.component';
import { ParticipationFormsComponent } from './responsable-club/participation-forms/participation-forms.component';
import { ListeDmandesComponent } from './components/etudiant/liste-dmandes/liste-dmandes.component';
import { HomeComponent } from './components/homePage/home/home.component';
import { AppBarHomeComponent } from './components/homePage/app-bar-home/app-bar-home.component';
import { FooterHomeComponent } from './components/homePage/footer-home/footer-home.component';
import { AboutUsComponent } from './components/homePage/about-us/about-us.component';

export const routes: Routes = [
 

  // Auth
 {
    path: 'home',
    component: AppBarHomeComponent,
    children: [
      { path: '', redirectTo: 'contentHome', pathMatch: 'full' },
      { path: 'register', component: RegistrationComponent },
      { path: 'login', component: LoginComponent },
      { path: 'contentHome', component: HomeComponent },
      {path:'aboutUs',component:AboutUsComponent}
    ]
  },
  {path: 'footer', component: FooterHomeComponent},
  
 
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'send-verification-email', component: EmailVerificationComponent },
  { path: 'verify-email', component: VerifyEmailComponent },
  // Responsable / publications / participation
  { path: 'dashboard', component: ResponsableDashboardComponent },
  { path: 'publications', component: PublicationPostComponent },
  { path: 'participation-forms', component: ParticipationFormsComponent  },

  // Events
  
  { path: 'events/create', component: EventCreateComponent },
  { path: 'events/:id', component: EventDetailComponent },

  // Clubs
  { path: 'createClub', component: CreateClubComponent },
  { path: 'espaceClub/:id', component: EspaceClubComponent },
  

  // Other pages
 
  { path: 'admindashboard', component: AdmindashboardComponent },
  { path: 'compagne', component: CompagneComponent },
  { path: 'reclamations', component: ReclamationsComponent },
  {path: 'sideBarEtudiant', component: SidebarComponent,
    children:[
     { path: 'clubs', component: ClubsListComponent },
     {path: 'reclamations', component: ListeReclamationsComponent},
     {path:'newReclamation', component: CreateReclamationComponent},
     {path : 'mesDemandes', component: ListeDmandesComponent},
    { path: 'events', component: EventListComponent },
     { path: 'logements', component: LogementComponent },
  ]

  },
];
