import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatStepper } from "@angular/material/stepper";

 
 
 
@Component({
  selector: 'app-bon-sortie',
  templateUrl: './bon-sortie.component.html',
  styleUrls: ['./bon-sortie.component.scss']
})
export class BonSortieComponent implements OnInit {
  isLinear = false;
  firstFormGroup:any= FormGroup;
  secondFormGroup:any= FormGroup;
  @ViewChild('stepper') private myStepper: any = MatStepper;
  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit() {
    
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });


    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

}