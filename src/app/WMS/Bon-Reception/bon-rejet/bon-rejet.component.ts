import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { BonReceptionServiceService } from '../bon-reception-service.service';

@Component({
  selector: 'app-bon-rejet',
  templateUrl: './bon-rejet.component.html',
  styleUrls: ['./bon-rejet.component.scss']
})
export class BonRejetComponent implements OnInit {
  bonRejet: any;


  constructor(public router :Router ,private _formBuilder: FormBuilder, private service: BonReceptionServiceService, private http: HttpClient) {

  }
  Bon_rejet() {
    this.service.Bon_rejet().subscribe((data: any) => {
      this.bonRejet = data;
    })
  }

  ngOnInit(): void {
    this.Bon_rejet();   

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
      text: " Suppression de Bon  Rejet N° " + id,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: ' Supprimer ',
      cancelButtonText: ' Annuler ',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.Supprimer_Bon_rejet(id).subscribe(data => {

          this.Bon_rejet();

        })
        swalWithBootstrapButtons.fire(
          'Suppression',
          'Bon Rejet N° ' + id + ' Supprimé Avec Sucées.',
          'success'
        )
      }
    })
  }

}
