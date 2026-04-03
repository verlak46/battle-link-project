import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { IonSpinner, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { imageOutline } from 'ionicons/icons';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../../core/services/storage.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.html',
  styleUrl: './image-upload.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonSpinner, IonIcon, TranslatePipe],
})
export class ImageUploadComponent {
  private readonly storageService = inject(StorageService);
  private readonly auth = inject(AuthService);
  private readonly translate = inject(TranslateService);

  imageUrl = input<string | undefined>(undefined);
  entityType = input.required<string>();
  imageUrlChange = output<string>();
  uploadError = output<string>();

  uploading = signal(false);

  constructor() {
    addIcons({ imageOutline });
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const userId = this.auth.user()?._id ?? 'anon';
    this.uploading.set(true);
    this.storageService.upload(file, this.entityType(), userId).subscribe({
      next: (url) => {
        this.uploading.set(false);
        this.imageUrlChange.emit(url);
      },
      error: () => {
        this.uploading.set(false);
        this.uploadError.emit(this.translate.instant('IMAGE_UPLOAD.ERROR'));
      },
    });
  }
}
