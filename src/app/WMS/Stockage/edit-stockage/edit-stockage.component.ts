import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-edit-stockage',
  templateUrl: './edit-stockage.component.html',
  styleUrls: ['./edit-stockage.component.scss']
})
export class EditStockageComponent implements OnInit {
  
  constructor(private elementRef: ElementRef) { }
 
  ngOnInit(): void {
  }
  
  option1 = false;
  option2 = false;
  option3 = false;
  option4 = false;
  option5 = false;
  option6 = false;
  option7 = false;

  fnoption1( ) {
    this.option1 = true;
    this.option2 = false       
    this.option3 = false;
    this.option4 = false;
    this.option5 = false;
    this.option6 = false;
    this.option7 = false;
  }
  fnoption2( ) {
    this.option2 = true;
    this.option1 = false;
    this.option3 = false;
    this.option4 = false;
    this.option5 = false;
    this.option6 = false;
    this.option7 = false;
   
  }
  fnoption3( ) {
    this.option2 = false;
    this.option1 = false;
    this.option3 = true;
    this.option4 = false;
    this.option5 = false;
    this.option6 = false;
    this.option7 = false;
   
  }
  fnoption4( ) {
    this.option2 = false;
    this.option1 = false;
    this.option3 = false;
    this.option4 = true;
    this.option5 = false;
    this.option6 = false;
    this.option7 = false;
   
  }
  fnoption5( ) {
    this.option2 = false;
    this.option1 = false;
    this.option3 = false;
    this.option4 = false;
    this.option5 = true;
    this.option6 = false;
    this.option7 = false;
   
  }
  fnoption6( ) {
    this.option2 = false;
    this.option1 = false;
    this.option3 = false;
    this.option4 = false;
    this.option5 = false;
    this.option6 = true;
    this.option7 = false;
   
  }
  fnoption7( ) {
    this.option2 = false;
    this.option1 = false;
    this.option3 = false;
    this.option4 = false;
    this.option5 = false;
    this.option6 = false;
    this.option7 = true;
   
  }
   
}
