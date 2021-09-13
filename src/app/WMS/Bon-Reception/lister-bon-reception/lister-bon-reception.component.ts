import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { BonReceptionServiceService } from '../bon-reception-service.service';

@Component({
  selector: 'app-lister-bon-reception',
  templateUrl: './lister-bon-reception.component.html',
  styleUrls: ['./lister-bon-reception.component.scss']
})
export class ListerBonReceptionComponent implements OnInit {
  bonReception: any;


  constructor(public router :Router ,private _formBuilder: FormBuilder, private service: BonReceptionServiceService, private http: HttpClient) {

  }
  Bon_Receptions() {
    this.service.Bon_Receptions().subscribe((data: any) => {
      this.bonReception = data;
    })
  }

  ngOnInit(): void {
    this.Bon_Receptions();
    //this.getAllBonReceptions();

  }
  Supprimer_Bon(id: any) {
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
  Modifier_Bon(id: any) {
    this.router.navigate(['/Menu/WMS-Reception/Modifier/',id]);
  }
  Select_Bon() { }

  /*  ListBonRecpetion(){
      this.service.ListBonReception().subscribe(data => {
       this.ListBonReception = data;
       console.log(data);
     });
   } */
  /* getAllBonReceptions() {
     this.service.getAllBonReceptions().subscribe((data: any) => {
       this.bonReception = data;
     })
   }
 
   SelectBR(id: any) {
     console.log(id)
   }
   modifierBon(id: any) {
     console.log("id: ",id);
     this.router.navigate(['Menu/reception/modifier-bon-recpetion',id]);
   }
   supprimerBon(id: number) {
     const swalWithBootstrapButtons = Swal.mixin({
       customClass: {
         confirmButton: 'btn btn-success',
         cancelButton: 'btn btn-danger'
       },
       buttonsStyling: false
     })
 
     swalWithBootstrapButtons.fire({
       title: 'Tu est sure?',
       text: "You won't be able to revert this!",
       icon: 'warning',
       showCancelButton: true,
       confirmButtonText: 'Oui, Supprimer!',
       cancelButtonText: 'Non, Annuler!',
       reverseButtons: true
     }).then((result) => {
       if (result.isConfirmed) {
         this.service.deleteBonReceptions(id).subscribe(data => {
           console.log(data);
           this.getAllBonReceptions();
 
         })
         swalWithBootstrapButtons.fire(
           'Suppresion Effecté!',
           'Bon De Reception Supprimé Avec Sucées.',
           'success'
         )
       }
     })
   }
   selectedOption: any;
 
   ListBonRecpetionFilter() {
     console.log(this.selectedOption)
 
     if (this.selectedOption == "id")
       this.service.ListBonReception().subscribe(
         data => this.ListBonReception = this.filterByID(data)
       )
     else if (this.selectedOption == "responsable")
 
       this.service.ListBonReception().subscribe(
         data => this.ListBonReception = this.filterByRespoansable(data)
       )
     else if (this.selectedOption == "etat")
 
       this.service.ListBonReception().subscribe(
         data => this.ListBonReception = this.filterByEtat(data)
       )
 
   }
 
   filterByID(ListBonReception: Bon_Reception[]) {
     return ListBonReception.filter((b) => {
       return b.id.toString().toLowerCase().includes(this.filters.keyword.toLowerCase());
     })
   }
   filterByEtat(ListBonReception: Bon_Reception[]) {
     return ListBonReception.filter((b) => {
       return b.etat.toString().toLowerCase().includes(this.filters.keyword.toLowerCase());
     })
   }
   filterByRespoansable(ListBonReception: Bon_Reception[]) {
     return ListBonReception.filter((b) => {
       return b.responsable.toString().toLowerCase().includes(this.filters.keyword.toLowerCase());
     })
   }
   filters = {
     keyword: ''
   }
   SelectBon(id: any) {
     console.log(id)
     const dialogRef = this.dialog.open(DetailBonRecption, {
       width: '650px',
       data: { id: id }
     });
     dialogRef.afterClosed().subscribe(result => {
 
 
     });
 
 
   }*/

}
