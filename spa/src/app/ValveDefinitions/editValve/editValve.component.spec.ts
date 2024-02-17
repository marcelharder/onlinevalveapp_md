/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EditValveComponent } from './editValve.component';

describe('EditValveComponent', () => {
  let component: EditValveComponent;
  let fixture: ComponentFixture<EditValveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditValveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditValveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
