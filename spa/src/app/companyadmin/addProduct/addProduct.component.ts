import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DropItem } from 'src/app/_models/dropItem';
import { TypeOfValve } from 'src/app/_models/TypeOfValve';
import { DropService } from 'src/app/_services/drop.service';
import { ProductService } from 'src/app/_services/product.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { valveSize } from 'src/app/_models/valveSize';

@Component({
  selector: 'app-addProduct',
  templateUrl: './addProduct.component.html',
  styleUrls: ['./addProduct.component.css']
})
export class AddProductComponent implements OnInit {
  @Input() vc: TypeOfValve;
  @Output() povOut: EventEmitter<number> = new EventEmitter();
  typeOfValve: Array<DropItem> = [];
  implantLocation: Array<DropItem> = [];
  ValveCodeSizes:Array<valveSize>=[];
  newsize = 0; neweoa = 0.0; showAdd = 0;
  valvesize: valveSize = {sizeId:0, size:0, eoa: 0.0, ppm:'0'};


  constructor(private drop: DropService, private prodService: ProductService, private alertify: AlertifyService) { }

  ngOnInit() { 
    
    this.prodService.getValveSizes(this.vc.ValveTypeId).subscribe((next)=>{
      this.ValveCodeSizes = next;
    });
    
   this.loadDrops(); }

  updateProductDetails() {
    this.prodService.saveDetails(this.vc).subscribe((next) => {
      this.alertify.message('Product saved ...');
      this.povOut.emit(1);
    });
  }
  cancel() { this.povOut.emit(1); }
  addSize(){
    // open the add window
    this.showAdd = 1;
    this.alertify.message("opening window");
  }
  saveSize(){
     // close the add window
     this.showAdd = 0;
     this.valvesize.size = this.newsize;
     this.valvesize.eoa = this.neweoa;
     this.prodService.addValveSize(this.vc.ValveTypeId, this.valvesize).subscribe((next)=>{
       this.ValveCodeSizes.push(next);
       this.newsize = 0; 
       this.neweoa = 0.0;
       this.alertify.message("uploading size");
     })
     
  }
  deleteSize(id:number){
    this.prodService.deleteValveSize(this.vc.ValveTypeId, id).subscribe((next)=>{
      this.alertify.message("size removed ...");
      var index = this.ValveCodeSizes.findIndex(a => a.sizeId === id);
       this.ValveCodeSizes.splice[index];
    })
   
  }
  displayAdd(){if(this.showAdd === 1){return true;}}

  loadDrops() {
    if (localStorage.options_valve_type === undefined) {
      this.drop.getValveTypeOptions().subscribe((next) => {
        this.typeOfValve = next;
        localStorage.setItem('options_valve_type', JSON.stringify(next));
      });
    } else {
      this.typeOfValve = JSON.parse(localStorage.options_valve_type);
    }

    if (localStorage.implant_location === undefined) {
      this.drop.getValveLocationOptions().subscribe((next) => {

        this.implantLocation = next;
        localStorage.setItem('implant_location', JSON.stringify(next));
      });
    } else {

      this.implantLocation = JSON.parse(localStorage.implant_location);
    }

  }







}
