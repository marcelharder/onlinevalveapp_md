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
  avsize = 0;
  baseUrl = environment.apiUrl;
  showAdd = 0; newsize = 0; neweoa = 0.0;
  valveSizes:Array<valveSize> = [];
  valvesize: valveSize = {
    SizeId: 0,
    Size: 0,
    EOA: 0,
    PPM: '',
    VTValveTypeId: 0
  };

  constructor(private alertify: AlertifyService,
    private prod: ProductService,
    private vs: ValveService,
    private router: Router) { }


  ngOnInit(): void {
   
    this.uploader = new FileUploader({
    });

  }
  updatePhoto(photoUrl: string){
    if(photoUrl !== undefined && photoUrl !== ""){ this.vc.image = photoUrl;}
   
  }

  sizesAvailable(){if(this.avsize === 1){return true;} else {return false;}}

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
     this.valvesize.Size = this.newsize;
     this.valvesize.EOA = this.neweoa;
     this.prod.addValveSize(this.vc.ValveTypeId, this.valvesize).subscribe((next) => {
      this.alertify.message("Size added ...");
      this.newsize = 0; 
      this.neweoa = 0.0;
     }, error => {}, () => {
      this.valveSizes.push(this.valvesize);
      // sort on valve size from small to big
      this.valveSizes.sort((a,b) => a.Size - b.Size);
     })
     //this.prod.addValveSize(this.vc.ValveTypeId, this.valvesize).subscribe((next)=>{
     // get the list of valveSizes
     /*  this.prod.getValveSizes(this.vc.ValveTypeId).subscribe((next)=>{
        this.valveSizes = next;
        this.newsize = 0; 
        this.neweoa = 0.0;
        this.alertify.message("uploading size");
        
      });
    */
       
       

    // })
     
  }
  deleteSize(id:number){
    this.prod.deleteValveSize(id).subscribe((next)=>{
      this.alertify.message("size removed ...");
     
    }, error => {
      this.alertify.message(error);
    }, () => {
      this.valveSizes.filter(x => x.SizeId === id);
      
    })
   
  }

  displayAdd(){if(this.showAdd === 1){return true;}}

  cancel() {
    this.povOut.emit(1);
  }
  deleteProduct() {
    this.alertify.confirm('Are you sure ?', () => {
      this.prod.deleteProduct(this.vc.ValveTypeId).subscribe((next)=>{
        this.router.navigate(['/home']); // to force the list to be renewed
      });

      this.povOut.emit(1);
    });

  }
  getSizes(){
    this.prod.getValveSizes(this.vc.ValveTypeId).subscribe((next)=>{
      this.valveSizes = next;
      this.avsize = 1;
      // sort on valve size from small to big
      this.valveSizes.sort((a,b) => a.Size - b.Size);
    });
  }

}
