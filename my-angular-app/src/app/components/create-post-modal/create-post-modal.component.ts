import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder,ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IdeaService } from '../../services/idea.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-create-post-modal',
  imports: [ CommonModule, ReactiveFormsModule],
  templateUrl: './create-post-modal.component.html',
  styleUrls: ['./create-post-modal.component.scss']
})
export class CreatePostModalComponent {
  createIdeaForm: FormGroup;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private dialogRef: MatDialogRef<CreatePostModalComponent>,
    private ideaService: IdeaService,
    private toastr: ToastrService


  ) {
    this.createIdeaForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      content: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(400)]]
    });
  }


  closeDialog(): void {
    this.dialogRef.close();
  }

  submitPost(): void {
    if (this.createIdeaForm.invalid) return;

    this.isLoading = true; 
    const { title, content } = this.createIdeaForm.value;

    this.ideaService.postIdea(title, content).subscribe({
      next: (idea) => {
        this.toastr.success('Post pubblicato con successo!', 'Successo'); 
        this.dialogRef.close(idea);
      },
      error: (err) => {
        console.error('Errore nella creazione del post:', err);
        this.toastr.error('Si è verificato un errore.', 'Errore'); 
      },
      complete: () => {
        this.isLoading = false; 
      }
    });
  }
}
