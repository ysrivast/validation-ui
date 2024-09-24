import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FileUploadService } from '../services/file-upload.service';
import { Observable, throwError } from 'rxjs';
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit{
  status: "initial" | "uploading" | "success" | "fail" = "initial"; // Variable to store file status
  file: File | null = null; // Variable to store file
  title = 'File Upload';

  public myForm! : FormGroup;
  error!: string;
  fileInfos?: Observable<any>;

  //////
  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';

  constructor(private formBuilder : FormBuilder,
              private fileUploadService : FileUploadService
  ){

  }

  ngOnInit(): void {
    this.initForm();
    this.fileInfos = this.fileUploadService.getFiles();
  }

  initForm() {
    this.myForm = this.formBuilder.group({
      name : ['',[Validators.required]]
    });

  }


  onUpload() {
    if(this.file){
      this.status ='uploading';
      this.fileUploadService.upload(this.file).subscribe({
        next:(data : any) => {
          console.log(data);
          this.status = 'success'
        },
        error:(error: any)=>{
          this.status= 'fail';
          console.log(error);
          this.error = error['title'];
          return throwError(()=> error)
        }
      })
    }
    }

  onChange(event: any) {
    const file: File = event.target.files[0];
  
    if (file) {
      this.status = "initial";
      this.file = file;
    }
  }


  onSubmit() {
    console.log(this.myForm.controls['name'].value)
  }

  bytesForHuman(bytes : any) {
    const decimals = 2
    let units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
    let i=0;
    for ( i; bytes > 1024; i++) {
        bytes /= 1024;
    }
    return parseFloat(bytes.toFixed(decimals)) + ' ' + units[i]
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

  upload(): void {
    this.progress = 0;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.currentFile = file;

        this.fileUploadService.upload(this.currentFile).subscribe({
          next: (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message;
              this.fileInfos = this.fileUploadService.getFiles();
            }
          },
          error: (err: any) => {
            console.log(err);
            this.progress = 0;

            if (err.error && err.error.message) {
              this.message = err.error.message;
            } else {
              this.message = 'Could not upload the file!';
            }

            this.currentFile = undefined;
          }
        });
      }

      this.selectedFiles = undefined;
    }
  }

}
