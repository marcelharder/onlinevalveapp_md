import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TypeOfValve } from '../../_models/TypeOfValve';
import { ProductService } from 'src/app/_services/product.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { Router } from '@angular/router';
import { ValveService } from 'src/app/_services/valve.service';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { Photo } from 'src/app/_models/Photo';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-editProduct',
  templateUrl: './editProduct.component.html'
})
export class EditProductComponent implements OnInit {
  @Input() vc: TypeOfValve;
  uploader: FileUploader;
  @Output() povOut: EventEmitter<number> = new EventEmitter();
  ImagePath = "";
  baseUrl = environment.apiUrl;

  constructor(private alertify: AlertifyService,
    private prod: ProductService,
    private vs: ValveService,
    private router: Router) { }


  ngOnInit(): void {
    this.initializeUploader();

  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'valves/' + this.vc.no + '/photos/',
      authToken: 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader.onSuccessItem = (item, response, status, headers) => {
      debugger;
      if (response) {
        const res: Photo = JSON.parse(response);
        const photo = {
          id: res.id,
          url: res.url,
          dateAdded: res.dateAdded,
          description: res.description,
          isMain: res.isMain
        };
        /* this.photos.push(photo);
        if (photo.isMain) {
         /*  this.authService.changeMemberPhoto(photo.url);
          this.authService.currentUser.photoUrl = photo.url;
          localStorage.setItem('user', JSON.stringify(this.authService.currentUser) ); */

      }
    };
  }



  updateProductDetails() {
    this.prod.saveDetails(this.vc).subscribe((next) => {
      this.povOut.emit(1);
    }, (error) => { console.log(error); });
  }

  cancel() {
    this.povOut.emit(1);
  }

  deleteProduct() {
    this.alertify.confirm('Are you sure ?', () => {
      this.prod.deleteProduct(this.vc.no).subscribe();
      this.povOut.emit(1);
    });

  }

}
