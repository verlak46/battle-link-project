import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class StorageService {
  upload(file: File, entityType: string, userId: string): Observable<string> {
    const { cloudName, uploadPreset } = environment.cloudinary;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', `images/${entityType}`);
    formData.append('public_id', `${userId}_${Date.now()}`);

    return from(
      fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      })
        .then((res) => {
          if (!res.ok) throw new Error('Upload failed');
          return res.json() as Promise<{ secure_url: string }>;
        })
        .then((data) => data.secure_url),
    );
  }
}
