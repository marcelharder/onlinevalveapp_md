import { Component, Input, OnInit } from '@angular/core';
import { TypeOfValve } from 'src/app/_models/TypeOfValve';

@Component({
  selector: 'app-productDetailsCard',
  templateUrl: './productDetailsCard.component.html',
  styleUrls: ['./productDetailsCard.component.scss']
})
export class ProductDetailsCardComponent implements OnInit {
  @Input() cd: TypeOfValve;

  constructor() { }

  ngOnInit() {
  }

}
