import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DropItem } from 'src/app/_models/dropItem';
import { TypeOfValve } from 'src/app/_models/TypeOfValve';
import { DropService } from 'src/app/_services/drop.service';
import { ProductService } from 'src/app/_services/product.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

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


  constructor(private drop: DropService, private prodService: ProductService, private alertify: AlertifyService) { }

  ngOnInit() { this.loadDrops(); }

  updateProductDetails() {
    this.prodService.saveDetails(this.vc).subscribe((next) => {
      this.alertify.message('Product saved ...');
      this.povOut.emit(1);
    });
  }
  cancel() { this.povOut.emit(1); }


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
