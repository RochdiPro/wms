import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-ajouter-bon-reception',
  templateUrl: './ajouter-bon-reception.component.html',
  styleUrls: ['./ajouter-bon-reception.component.scss']
})
export class AjouterBonReceptionComponent implements OnInit {

  firstFormGroup:any= FormGroup;
  secondFormGroup:any= FormGroup;

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
