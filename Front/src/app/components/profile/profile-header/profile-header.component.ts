import { Component, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ProfileViewComponent } from "../profile-view/profile-view.component";
import { ProfileEditComponent } from "../profile-edit/profile-edit.component";

@Component({
  selector: 'app-profile-header',
  imports: [ProfileViewComponent, ProfileEditComponent],
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.css'
})
export class ProfileHeaderComponent implements OnInit{
  activeTab = signal<'Overview' | 'Settings'>('Overview');

   user!: any;



  constructor(private authService: AuthService) {}

  ngOnInit(): void {
      this.authService.getUserByToken().subscribe((user) => {
      this.user = user;
    });
  }


  switchToTab(tab: 'Overview' | 'Settings'): void {
    this.activeTab.set(tab);
  }

  handleSaveChanges(updatedData: Partial<any>): void {

    this.switchToTab('Overview');
  }

}
