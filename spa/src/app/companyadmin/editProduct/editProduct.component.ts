import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TypeOfValve } from '../../_models/TypeOfValve';
import { ProductService } from 'src/app/_services/product.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { Router } from '@angular/router';
import { ValveService } from 'src/app/_services/valve.service';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { valveSize } from 'src/app/_models/valveSize';

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
  showAdd = 0; newsize = 0; neweoa = 0.0;
  valvesize: valveSize = {sizeId:0, size:0, eoa: 0.0, ppm: '0'};

  constructor(private alertify: AlertifyService,
    private prod: ProductService,
    private vs: ValveService,
    private router: Router) { }


  ngOnInit(): void {
    this.uploader = new FileUploader({
    });

  }
  updatePhoto(photoUrl: string){
    this.vc.image = photoUrl;
  }



  updateProductDetails() {
    this.prod.saveDetails(this.vc).subscribe((next) => {
      this.povOut.emit(1);
    }, (error) => { console.log(error); });
  }
  addSize(){
    this.alertify.message("open the add window"); 
    this.showAdd = 1;
    this.alertify.message("opening window");
  }
  saveSize(){
     // close the add window
     this.showAdd = 0;
     this.valvesize.size = this.newsize;
     this.valvesize.eoa = this.neweoa;
     this.prod.addValveSize(this.vc.valveTypeId, this.valvesize).subscribe((next)=>{
          // get the changed valveType
      this.prod.getProductById(this.vc.valveTypeId).subscribe((next)=>{
        this.newsize = 0; 
        this.neweoa = 0.0;
        this.alertify.message("uploading size");
        this.vc = next;
      });
   
       
       

     })
     
  }
  deleteSize(id:number){
    this.prod.deleteValveSize(this.vc.valveTypeId, id).subscribe((next)=>{
      this.alertify.message("size removed ...");
      // get the changed valveType
      this.prod.getProductById(this.vc.valveTypeId).subscribe((next)=>{this.vc = next});
    })
   
  }

  displayAdd(){if(this.showAdd === 1){return true;}}

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
