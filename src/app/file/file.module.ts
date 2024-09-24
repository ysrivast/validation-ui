import { NgModule } from '@angular/core';

import { FileRoutingModule } from './file-routing.module';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FileUploadService } from './services/file-upload.service';


@NgModule({
  declarations: [
    FileUploadComponent
  ],
  imports: [
    FileRoutingModule,
    ReactiveFormsModule,
    CommonModule
  ],
  providers: [FileUploadService]
})
export class FileModule { }
