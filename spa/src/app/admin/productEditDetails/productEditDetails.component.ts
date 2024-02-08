import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TypeOfValve } from 'src/app/_models/TypeOfValve';
import { valveSize } from 'src/app/_models/valveSize';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ProductService } from 'src/app/_services/product.service';

@Component({
  selector: 'app-productEditDetails',
  templateUrl: './productEditDetails.component.html',
  styleUrls: ['./productEditDetails.component.css']
})
export class productEditDetailsComponent implements OnInit {
  @Input() prod: TypeOfValve;
  @Output() backTo = new EventEmitter<String>();
  listOfSizes: Array<valveSize> = [];
  valvesize: valveSize = {
    SizeId: 0,
    Size: 0,
    EOA: 0,
    PPM: '',
    VTValveTypeId: 0
  };
  newSizeToken = 0;

  constructor(private alertify: AlertifyService, private pro: ProductService) { }

  ngOnInit() { }

  deleteSize(SizeId: number) {
    this.pro.deleteValveSize(SizeId).subscribe((next) => {
      if (next === 1) {
        this.alertify.message("deleted");
        // remove it from the local array
        let index = this.prod.Valve_size.findIndex(d => d.SizeId === SizeId); //find index in your array
        this.prod.Valve_size.splice(index, 1);//remove element from array
      }
    });
  }

  addNewSize() {
    // get the latest prod details
    this.pro.getProductById(this.prod.No).subscribe((next) => {
      this.prod = next;
      // zero everything
      this.valvesize.SizeId = 0;
      this.valvesize.Size = 0;
      this.valvesize.EOA = 0;
      this.valvesize.PPM = '';
      this.valvesize.VTValveTypeId = 0;

      this.newSizeToken = 1;

    });




  }

  displayNewSize() { if (this.newSizeToken === 1) { return true; } }

  addNewSizeNow() {
    // add this size to the backend first  
    this.pro.addValveSize(this.prod.No, this.valvesize).subscribe((next) => {
      this.valvesize = next; // get the new valve size from the backend
      this.prod.Valve_size.push(this.valvesize);

      this.newSizeToken = 0;

    })
  }

  backToList() {
    // go back to list
    this.backTo.emit("1");
  }



}
