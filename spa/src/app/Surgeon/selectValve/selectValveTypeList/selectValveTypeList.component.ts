import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { TypeOfValve } from 'src/app/_models/TypeOfValve';
import { ProductService } from 'src/app/_services/product.service';

@Component({
  selector: 'app-selectValveTypeList',
  templateUrl: './selectValveTypeList.component.html',
  styleUrls: ['./selectValveTypeList.component.css']
})
export class SelectValveTypeListComponent implements OnInit {
  
  @Input() pro:TypeOfValve[];
  @Output() selout: EventEmitter<number> = new EventEmitter();

  constructor(private prod:ProductService) { }

  ngOnInit() {
  }

  SearchD(id: number){
    this.selout.emit(id);}

  
}
