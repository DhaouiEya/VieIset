import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profile-edit.component.html',
  styleUrl: './profile-edit.component.css'
})
export class ProfileEditComponent {
  @Input() user!: any;
  @Output() save = new EventEmitter<Partial<any>>();
  @Output() cancel = new EventEmitter<void>();

  // FIX: Move FormBuilder injection and form initialization to the constructor.
  // This ensures a reliable injection context and resolves the 'unknown' type error for the form builder.
  constructor( private readonly fb: FormBuilder) {


  }
  studentForm!: FormGroup;
  avatarPreview: string | null = null;
  availableSpecialites: string[] = [];
  private filiereSubscription?: Subscription;

  // Data for select dropdowns
  filieres = ['Technologies de l\'informatique', 'Génie Mécanique', 'Génie Électrique', 'Gestion des Entreprises'];
  niveaux = ['1ère année', '2ème année', '3ème année LMD', '1ère année Mastère', '2ème année Mastère'];

  specialitesParFiliere: { [key: string]: string[] } = {
    'Technologies de l\'informatique': ['Développement des Systèmes d\'Information (DSI)', 'Systèmes Embarqués et Mobiles (SEM)', 'Réseaux et Sécurité Informatique (RSI)'],
    'Génie Mécanique': ['Conception et Fabrication Mécanique', 'Maintenance Industrielle'],
    'Génie Électrique': ['Automatisme et Informatique Industrielle', 'Électronique Industrielle'],
    'Gestion des Entreprises': ['Comptabilité et Finance', 'Marketing', 'Ressources Humaines']
  };

  initForm(){
    this.studentForm = this.fb.group({
      firstName: [this.user.firstName || ''],
      lastName: [this.user.lastName || ''],
      adresse: [this.user.adresse || ''],
      numeroTelephone: [this.user.numeroTelephone || ''],
      dateNaissance: [this.user.dateNaissance || ''],
      ville: [this.user.ville || ''],
      filiere: [this.user.filiere || ''],
      specialite: [this.user.specialite || ''],
      niveau: [this.user.niveau ||''],
      classe: [this.user.classe || ''],
      photoProfil: [this.user.photoProfil || ''],
    });
  }


 ngOnInit(): void {
      this.initForm();

    this.resetFormToStudentData();

    const filiereControl = this.studentForm.get('filiere');
    if (filiereControl) {
      this.filiereSubscription = filiereControl.valueChanges.subscribe(filiere => {
        if (filiere) {
          this.updateAvailableSpecialites(filiere);
          this.studentForm.get('specialite')?.setValue('');
        } else {
          this.availableSpecialites = [];
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.filiereSubscription?.unsubscribe();
  }

  private updateAvailableSpecialites(filiere: string): void {
    this.availableSpecialites = this.specialitesParFiliere[filiere] || [];
  }

  private resetFormToStudentData(): void {
    if (!this.user) return;

    this.studentForm.patchValue({ ...this.user });
    this.updateAvailableSpecialites(this.user.filiere);
    this.avatarPreview = null;
  }

  saveChanges(): void {
    const formValue = this.studentForm.getRawValue();
    const payload: Partial<any> = {
      ...formValue,
      location: `${formValue.ville || 'Lieu non défini'}, Tunisie`,
    };

    if (this.avatarPreview) {
      payload['photoProfil'] = this.avatarPreview;
    }

    this.save.emit(payload);
  }

  discardChanges(): void {
    this.cancel.emit();
  }

 onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    const file = element.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => this.avatarPreview = e.target?.result as string;
    reader.readAsDataURL(file);
  }

}
