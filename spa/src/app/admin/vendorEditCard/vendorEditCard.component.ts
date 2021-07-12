import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Vendor } from 'src/app/_models/Vendor';

@Component({
  selector: 'app-vendorEditCard',
  templateUrl: './vendorEditCard.component.html',
  styleUrls: ['./vendorEditCard.component.css']
})
export class VendorEditCardComponent implements OnInit {
  @Input() vendor: Vendor;
  @Output() backTo = new EventEmitter<String>();

  constructor() { }

  ngOnInit() {
  }

  backToList() {
    // go back to list
    this.backTo.emit("1");
  }


}
