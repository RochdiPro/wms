import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
 
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormArray } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { StockageService } from '../../stockage.service';
declare var require: any
@Component({
  selector: 'app-entree-bon-reception',
  templateUrl: './entree-bon-reception.component.html',
  styleUrls: ['./entree-bon-reception.component.scss']
})
export class EntreeBonReceptionComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: any = MatPaginator;
  @ViewChild(MatSort) sort: any = MatSort;

  form = new FormGroup({ id: new FormControl(""), responsable: new FormControl(""), etat: new FormControl(""), type_be: new FormControl("") });

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  displayedColumns: string[] = ['id', "responsable", "etat", "type_Be", "id_Be", 'entree']; //les colonne du tableau 
  dataSource = new MatTableDataSource<table>();



  bonReception: any;


  constructor(public router: Router, private _formBuilder: FormBuilder, private service: StockageService, private http: HttpClient) {
  
  }
  Bon_Receptions() {
    this.service.Bon_Receptions().subscribe((data: any) => {
      this.bonReception = data;
      this.dataSource.data = data as table[];
    })
  }

  
   
  ngOnInit(): void {
    this.Bon_Receptions();
  }

  filtre() {
     
     console.log( this.form.get('type_be')?.value)
    this.service.filtrereception("id", this.form.get('id')?.value, "responsable", this.form.get('responsable')?.value, "etat", this.form.get('etat')?.value, "type_be", this.form.get('type_be')?.value).subscribe((data) => {
      this.dataSource.data = data as table[];
    });
  }

  Source: any;
  Destination: any;
  modele: any;
  type_bon:any;
  nbSupport:any
  id:any
  date_Creation:any;
  
}

export interface table {
  id: number;
  responsable: string
  etat: string;
  type_Be: string;
  id_Be: String;
}
