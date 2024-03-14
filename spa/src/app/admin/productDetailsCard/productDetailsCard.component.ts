import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TypeOfValve } from 'src/app/_models/TypeOfValve';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-productDetailsCard',
  templateUrl: './productDetailsCard.component.html',
  styleUrls: ['./productDetailsCard.component.scss']
})
export class ProductDetailsCardComponent implements OnInit {
  @Input() cd: TypeOfValve;
  @Output() details = new EventEmitter<String>();

  constructor(private alertify:AlertifyService) { }

  ngOnInit() {
    
  }

  showDetails(id:number){this.details.emit(id.toString());}

}
