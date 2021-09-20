import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { BonReceptionServiceService } from '../bon-reception-service.service';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormArray } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-lister-bon-reception',
  templateUrl: './lister-bon-reception.component.html',
  styleUrls: ['./lister-bon-reception.component.scss']
})

export class ListerBonReceptionComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: any = MatPaginator;
  @ViewChild(MatSort) sort: any = MatSort;

  form = new FormGroup({ id: new FormControl("")  ,responsable: new FormControl("") , etat: new FormControl(""), type_Be: new FormControl("") ,id_Be: new FormControl("")});
 
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  displayedColumns: string[] = [ 'modifier','id' ,"responsable" ,"etat","type_Be","id_Be",'supprimer','Voir_pdf','exporter_pdf'  ]; //les colonne du tableau 
  dataSource = new MatTableDataSource<table>();
 
   

  bonReception: any;


  constructor(public router: Router, private _formBuilder: FormBuilder, private service: BonReceptionServiceService, private http: HttpClient) {

  }
  Bon_Receptions() {
    this.service.Bon_Receptions().subscribe((data: any) => {
      this.bonReception = data;
      this.dataSource.data = data as table[];
    })
  }
pdf(id :any )
{

}
telecharger(id:any)
{

}

supprimer(id:any)
{
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
  })

  swalWithBootstrapButtons.fire({
    title: 'Tu est sure?',
    text: " Suppression de Bon  Réception N° " + id,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: ' Supprimer ',
    cancelButtonText: ' Annuler ',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      this.service.Supprimer_Bon_Reception(id).subscribe(data => {

        this.Bon_Receptions();

      })
      swalWithBootstrapButtons.fire(
        'Suppression',
        'Bon Reception N° ' + id + ' Supprimé Avec Sucées.',
        'success'
      )
    }
  })
}
  ngOnInit(): void {
    this.Bon_Receptions();
    //this.getAllBonReceptions();

  }
  
  Modifier_Bon(id: any) {
    this.router.navigate(['/Menu/WMS-Reception/Modifier/', id]);
  }
  Select_Bon() { }



  filtrerid() { 
   /* this.service.fltreListeproduit("nom_produit", this.form.get('nom_Produit').value, "nom_emballage", this.form.get('nom_Emballage').value, "type_emballage", this.form.get('type_Emballage').value).subscribe((data) => {
      this.dataSource.data = data as tableColisage[];
    });*/
  }

  filtreresponsable() { }

  filtrerdate() { }

  filtreretat() { }

  filtrertype() { }

  filtrerancienid() { }


}

export interface table {
  id: number;  
  responsable:string
  etat:string;
  type_Be:string;
  id_Be:String ;
}
 