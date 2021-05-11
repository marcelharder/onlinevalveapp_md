import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TypeOfValve } from '../../_models/TypeOfValve';
import { ProductService } from 'src/app/_services/product.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { Router } from '@angular/router';
import { ValveService } from 'src/app/_services/valve.service';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';

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

    this.uploader = new FileUploader({

    });

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
