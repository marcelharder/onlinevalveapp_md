import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Vendor } from 'src/app/_models/Vendor';

@Component({
  selector: 'app-vendorDetailsCard',
  templateUrl: './vendorDetailsCard.component.html',
  styleUrls: ['./vendorDetailsCard.component.css']
})
export class VendorDetailsCardComponent implements OnInit {
  @Input() cd: Vendor;
  @Output() details = new EventEmitter<String>();

  constructor() { }

  ngOnInit() {
  }

  showDetails(id:string){
    this.details.emit(id);}

}


