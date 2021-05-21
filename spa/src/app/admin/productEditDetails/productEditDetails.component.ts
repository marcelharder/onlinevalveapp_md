import { Component, Input, OnInit } from '@angular/core';
import { TypeOfValve } from 'src/app/_models/TypeOfValve';

@Component({
  selector: 'app-productEditDetails',
  templateUrl: './productEditDetails.component.html',
  styleUrls: ['./productEditDetails.component.css']
})
export class ProductEditDetailsComponent implements OnInit {
  @Input() prod:TypeOfValve;
  
  constructor() { }

  ngOnInit() {
  }

}
