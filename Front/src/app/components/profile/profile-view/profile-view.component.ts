import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-profile-view',
  standalone:true,
  imports: [DatePipe],
  templateUrl: './profile-view.component.html',
  styleUrl: './profile-view.component.css',
})
export class ProfileViewComponent {
  @Input() user!: any;
  @Output() editRequest = new EventEmitter<void>();

  onEdit(): void {
    this.editRequest.emit();
  }
}
