import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as moment from 'moment';
import Swal from 'sweetalert2';
 
import { StockageService } from '../stockage.service';

declare var require: any

const pdfMake = require("pdfmake/build/pdfmake");
const pdfFonts = require("pdfmake/build/vfs_fonts");

pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-lister-bon-sortie',
  templateUrl: './lister-bon-sortie.component.html',
  styleUrls: ['./lister-bon-sortie.component.scss']
})
export class ListerBonSortieComponent implements OnInit {

  bonRejet: any;

  @ViewChild(MatPaginator) paginator: any = MatPaginator;
  @ViewChild(MatSort) sort: any = MatSort;

  form = new FormGroup({ id: new FormControl(""), responsable: new FormControl(""), local: new FormControl("") });

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  displayedColumns: string[] = ['id', "responsable", "local", 'reclamation', 'supprimer', 'Voir_pdf', 'exporter_pdf']; //les colonne du tableau 
  dataSource = new MatTableDataSource<table>();


  constructor(public router: Router, private _formBuilder: FormBuilder, private service: StockageService, private http: HttpClient) {
    this.chargementModel2();
    this.modelePdfBase642();
  }


  telecharger(id: any) {
    this.id = id
    this.getDetail()

    this.service.get_Bon_Sortie_By_Id(id).subscribe(data => {
      this.bonRejet = data;
      this.type_bon = this.bonRejet.type_Bon;
      this.Destination = this.bonRejet.local
      this.reclamation = this.bonRejet.reclamation
      this.date_Creation = this.bonRejet.date_Creation
    }, error => console.log(error));
    this.telechargerPDF(this.id, this.date_Creation)
  }

  modeleSrc2: any;
  Source: any;
  Destination: any;
  modele2: any;
  type_bon: any;
  nbSupport: any
  id: any
  date_Creation: any;
  reclamation: any





  pdf(id2: any) {
    this.id = id2
    this.getDetail()
    console.log(this.obj_articles)
    this.service.get_Bon_Sortie_By_Id(id2).subscribe(data => {
      this.bonRejet = data;
      this.type_bon = this.bonRejet.type_Bon;
      this.Destination = this.bonRejet.local
      this.reclamation = this.bonRejet.reclamation
      this.date_Creation = this.bonRejet.date_Creation
    }, error => console.log(error));
    this.generatePDF(this.id, this.date_Creation)

  }

  async modelePdfBase642() {
    await this.delai(4000);
    const lecteur = new FileReader();
    lecteur.onloadend = () => {
      this.modeleSrc2 = lecteur.result;
      this.modeleSrc2 = btoa(this.modeleSrc2);
      this.modeleSrc2 = atob(this.modeleSrc2);
      this.modeleSrc2 = this.modeleSrc2.replace(/^data:image\/[a-z]+;base64,/, "");
    }
    lecteur.readAsDataURL(this.modele2);
  }

  delai(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  // récupération de modele pour créer le pdf
  async chargementModel2() {
    this.http.get('./../../../assets/images/ficheRejet.jpg', { responseType: 'blob' }).subscribe((reponse: any) => {
      this.modele2 = reponse;
      return this.modele2;
    }, err => console.error(err),
      () => console.log(this.modele2))
  }
  convertBlobFichier = (theBlob: Blob, fileName: string): File => {
    var b: any = theBlob;
    b.lastModifiedDate = new Date();
    b.name = fileName;
    return <File>theBlob;
  }

  //impression de la fiche recption
  generatePDF(id: any, date: any) {
    var body = [];
    var titulos = new Array('Id Article', 'Article', 'Fiche_Technique', 'Vérification', 'Quantite', 'vérification', 'Reclmation');

    body.push(titulos);
    var tabArt: any = [];

    for (let i = 0; i < this.obj_articles.length; i++) {
      var fila = new Array();





      let ch = "";
      if (this.obj_articles[i].controle_qt) {

      }
      else { ch = ch + " Quantite non Verifier :  " + this.obj_articles[i].total + " < " + this.obj_articles[i].qte }
      if (this.obj_articles[i].controle_tech) {

      }
      else {
        ch = ch + " Fiche Technique non Verifier "
      }


      fila.push(this.obj_articles[i].id);
      fila.push(this.obj_articles[i].nom);
      fila.push(this.obj_articles[i].fiche_Technique);
      if (this.obj_articles[i].fiche_Technique = 'true') { fila.push("oui"); } else { fila.push("non"); }
      fila.push(this.obj_articles[i].qte);
      if (this.obj_articles[i].controle_qt = 'true') { fila.push("oui"); } else { fila.push("non"); }
      fila.push(ch);

      body.push(fila);

    }
    console.log(body)


    var def = {
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        tableExample: {
          margin: [0, 5, 0, 15]
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black'
        }
      },
      defaultStyle: {
        // alignment: 'justify'
      },
      pageMargins: [40, 120, 40, 60],


      info: {
        title: 'Fiche Rejet Marchandise',

      },
      background: [
        {
          image: 'data:image/jpeg;base64,' + this.modeleSrc2, width: 600
        }
      ],

      content: [
        {
          text: 'Bon Rejet N°' + id + '\n\n',
          fontSize: 10,
          alignment: 'left',

          color: 'black',
          bold: true
        },

        {
          columns: [

            {
              text:
                'Responsable :' + '\t' + 'User'
                + '\n\n' +
                'Id Bon  :' + '\t' + id

              ,

              fontSize: 10,

              alignment: 'left',

              color: 'black'
            },
            {
              text:
                'Date :' + '\t' + (moment(date)).format('DD-MM-YYYY')
                + '\n\n' + 'Local :' + this.Destination
                + '\n\n' + 'Type Bon :' + this.type_bon + '\t'
              ,

              fontSize: 10,

              alignment: 'left',

              color: 'black'
            },


          ]
        },

        {

          text: '\n\n' + 'Liste des Article :' + '\t\n',
          fontSize: 12,
          alignment: 'Center',
          color: 'black',
          bold: true
        },
        {
          table: {

            alignment: 'right',
            body: body
          }
        },
        {

          text: '\n\n' + 'Reclamation :' + '\t\n\n\n' + this.reclamation,
          fontSize: 12,
          alignment: 'Center',
          color: 'black',
          bold: true
        },
      ],
    };

    pdfMake.createPdf(def).open({ defaultFileName: 'BonRejet.pdf' });
  }

  //impression de la fiche recption
  telechargerPDF(id: any, date: any) {
    var body = [];
    var titulos = new Array('Id Article', 'Article', 'Fiche_Technique', 'Vérification', 'Quantite', 'vérification', 'Reclmation');

    body.push(titulos);
    var tabArt: any = [];

    for (let i = 0; i < this.obj_articles.length; i++) {
      var fila = new Array();





      let ch = "";
      if (this.obj_articles[i].controle_qt) {

      }
      else { ch = ch + " Quantite non Verifier :  " + this.obj_articles[i].total + " < " + this.obj_articles[i].qte }
      if (this.obj_articles[i].controle_tech) {

      }
      else {
        ch = ch + " Fiche Technique non Verifier "
      }


      fila.push(this.obj_articles[i].id);
      fila.push(this.obj_articles[i].nom);
      fila.push(this.obj_articles[i].fiche_Technique);
      if (this.obj_articles[i].fiche_Technique = 'true') { fila.push("oui"); } else { fila.push("non"); }
      fila.push(this.obj_articles[i].qte);
      if (this.obj_articles[i].controle_qt = 'true') { fila.push("oui"); } else { fila.push("non"); }
      fila.push(ch);

      body.push(fila);

    }
    console.log(body)


    var def = {
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        tableExample: {
          margin: [0, 5, 0, 15]
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black'
        }
      },
      defaultStyle: {
        // alignment: 'justify'
      },
      pageMargins: [40, 120, 40, 60],


      info: {
        title: 'Fiche Rejet Marchandise',

      },
      background: [
        {
          image: 'data:image/jpeg;base64,' + this.modeleSrc2, width: 600
        }
      ],

      content: [
        {
          text: 'Bon Rejet N°' + id + '\n\n',
          fontSize: 10,
          alignment: 'left',

          color: 'black',
          bold: true
        },

        {
          columns: [

            {
              text:
                'Responsable :' + '\t' + 'User'
                + '\n\n' +
                'Id Bon  :' + '\t' + id

              ,

              fontSize: 10,

              alignment: 'left',

              color: 'black'
            },
            {
              text:
                'Date :' + '\t' + (moment(date)).format('DD-MM-YYYY')
                + '\n\n' + 'Local :' + this.Destination
                + '\n\n' + 'Type Bon :' + this.type_bon + '\t'
              ,

              fontSize: 10,

              alignment: 'left',

              color: 'black'
            },


          ]
        },

        {

          text: '\n\n' + 'Liste des Article :' + '\t\n',
          fontSize: 12,
          alignment: 'Center',
          color: 'black',
          bold: true
        },
        {
          table: {

            alignment: 'right',
            body: body
          }
        },
        {

          text: '\n\n' + 'Reclamation :' + '\t\n\n\n' + this.reclamation,
          fontSize: 12,
          alignment: 'Center',
          color: 'black',
          bold: true
        },
      ],
    };
    pdfMake.createPdf(def).download("BonRejet" + this.id);

  }
  // Ajouter une ligne dans le tableau du support  
  ajouterligneSupport(): FormGroup {
    return this._formBuilder.group({
      typeSupport: new FormControl({ value: 'Pallette', disabled: false }, Validators.required),
      poids: new FormControl({ value: '1', disabled: false }, Validators.required),
      hauteur: new FormControl({ value: '1', disabled: false }, Validators.required),
      largeur: new FormControl({ value: '1', disabled: false }, Validators.required),
      longeur: new FormControl({ value: '1', disabled: false }, Validators.required),
    });
  }


  xmldata: any;
  obj_articles: any = [];
  supports: any = [];
  new_obj: any = {}
  sup: any = {}
  arraySupport: any = [];
  support: any = {}
  // Get Detail bon reception 
  xmlbonrejet: any;
  getDetail() {
    this.service.Detail_Bon_Sortie(this.id).subscribe((detail: any) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        this.xmlbonrejet = reader.result;
        var parseString = require('xml2js').parseString;
        let data1;
        parseString(atob(this.xmlbonrejet.substr(28)), function (err: any, result: any) {
          data1 = result.Bon_Rejet;

        })

        this.xmldata = data1


        for (let i = 0; i < this.xmldata.Produits[0].Produit.length; i++) {

          this.new_obj = {}
          this.new_obj.id = this.xmldata.Produits[0].Produit[i].Id;
          this.new_obj.nom = this.xmldata.Produits[0].Produit[i].Nom;
          this.new_obj.fiche_Technique = this.xmldata.Produits[0].Produit[i].Fiche_Technique;

          this.new_obj.qte = this.xmldata.Produits[0].Produit[i].Qte;
          this.new_obj.famaille = this.xmldata.Produits[0].Produit[i].famaille;
          this.new_obj.sous_famaille = this.xmldata.Produits[0].Produit[i].sous_famaille;
          this.new_obj.total = this.xmldata.Produits[0].Produit[i].Total;


          this.obj_articles.push(this.new_obj)

        }
      }

      reader.readAsDataURL(detail);
    })


  }

  filtre() {
    this.service.filtre("id", this.form.get('id')?.value, "responsable", this.form.get('responsable')?.value, "local", this.form.get('local')?.value).subscribe((data) => {
      this.dataSource.data = data as table[];
    });
  }


  ngOnInit(): void {
   this.Bon_sortie();

  }

  Bon_sortie() {
    this.service.Bon_Sortie().subscribe((data: any) => {
      this.bonRejet = data;
      this.dataSource.data = data as table[];
    })
  }
  supprimer(id: any) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Tu est sure?',
      text: " Suppression de Bon Sortie N° " + id,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: ' Supprimer ',
      cancelButtonText: ' Annuler ',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.Supprimer_BBon_Sortie(id).subscribe(data => {

          this.Bon_sortie();

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
export interface table {
  id: number;
  responsable: string
  local: string;

}