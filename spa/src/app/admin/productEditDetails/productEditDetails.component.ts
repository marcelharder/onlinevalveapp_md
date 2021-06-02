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
  valvesize: valveSize = { sizeId: 0, size: 0, eoa: 0.0, ppm: '0' };
  newSizeToken = 0;

  constructor(private alertify: AlertifyService, private pro: ProductService) { }

  ngOnInit() { }

  deleteSize(SizeId: number) {
    this.pro.deleteValveSize(this.prod.no, SizeId).subscribe((next) => {
      if (next === 1) {
        this.alertify.message("deleted");
        // remove it from the local array
        let index = this.prod.valve_size.findIndex(d => d.sizeId === SizeId); //find index in your array
        this.prod.valve_size.splice(index, 1);//remove element from array
      }
    });

  }

  addNewSize() {
    // get the latest prod details
    this.pro.getProductById(this.prod.no).subscribe((next) => {
      this.prod = next;
      // zero everything
      this.valvesize.sizeId = 0;
      this.valvesize.size = 0;
      this.valvesize.eoa = 0;

      this.newSizeToken = 1;

    });




  }

  displayNewSize() { if (this.newSizeToken === 1) { return true; } }

  addNewSizeNow() {
    // add this size to the backend first  
    this.pro.addValveSize(this.prod.no, this.valvesize).subscribe((next) => {
      this.valvesize = next; // get the new valve size from the backend
      this.prod.valve_size.push(this.valvesize);

      this.newSizeToken = 0;

    })
  }

  backToList() {
    // go back to list
    this.backTo.emit("1");
  }



}
