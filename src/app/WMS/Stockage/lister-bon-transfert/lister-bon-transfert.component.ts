import { DatePipe } from '@angular/common';
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
  selector: 'app-lister-bon-transfert',
  templateUrl: './lister-bon-transfert.component.html',
  styleUrls: ['./lister-bon-transfert.component.scss']
})
export class ListerBonTransfertComponent implements OnInit {

  transfert: any;

  @ViewChild(MatPaginator) paginator: any = MatPaginator;
  @ViewChild(MatSort) sort: any = MatSort;

  form = new FormGroup({ id: new FormControl(""), src: new FormControl(""), des: new FormControl("") });

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  displayedColumns: string[] = ['id', "responsable", "src", 'des', 'supprimer']; //les colonne du tableau 
  dataSource = new MatTableDataSource<table>();


  constructor(private datePipe: DatePipe, public router: Router, private _formBuilder: FormBuilder, private service: StockageService, private http: HttpClient) {
    this.chargementModel2();
    this.modelePdfBase642();
  }


  telecharger(id: any) {
    this.id = id
    this.getDetail()

    this.service.get_Bon_transfert_By_Id(id).subscribe(data => {
      this.transfert = data;
      this.des = this.transfert.local_Destination;
      this.src = this.transfert.local_Source
      this.reclamation = this.transfert.reclamation
      this.date_Creation = this.transfert.date_Creation
    }, error => console.log(error));
    setTimeout(() => {
      this.telechargerPDF(this.id, this.date_Creation)
    }, 500);

  }

  modeleSrc2: any;
  des: any;
  src: any;
  modele2: any;
  type_bon: any;
  nbSupport: any
  id: any
  date_Creation: any;
  reclamation: any





  pdf(id2: any) {
    this.id = id2
    this.getDetail()
    this.service.get_Bon_transfert_By_Id(id2).subscribe(data => {
      this.transfert = data;
      this.des = this.transfert.local_Destination;
      this.src = this.transfert.local_Source
      this.reclamation = this.transfert.reclamation
      this.date_Creation = this.transfert.date_Creation
    }, error => console.log(error));
    setTimeout(() => {

      this.generatePDF(this.id, this.date_Creation)
    }, 1000);

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
    this.http.get('./../../../assets/images/FicheTransfert.jpg', { responseType: 'blob' }).subscribe((reponse: any) => {
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

  ch: any
  //impression de la fiche transfert
  generatePDF(id: any, date: any) {


    var body = [];

    for (let i = 0; i < this.obj_articles.length; i++) {
      var obj = new Array();
      obj.push(this.obj_articles[i].id);
      obj.push(this.obj_articles[i].nom);
      obj.push(this.obj_articles[i].qte);
      this.ch = ""
      if (this.obj_articles[i].type == 'serie') {

        for (let j = 0; j < this.obj_articles[i].detail.length; j++) {
          this.ch = this.ch + "N_Série : " + this.obj_articles[i].detail[j].ns + "\n"
          this.ch = this.ch + " ----------------------  \n"
        }


      }
      else if (this.obj_articles[i].type == '4g') {

        for (let j = 0; j < this.obj_articles[i].detail.length; j++) {
          this.ch = this.ch + "N_Série : " + this.obj_articles[i].detail[j].ns + "\n"
          this.ch = this.ch + "E1 : " + this.obj_articles[i].detail[j].e1 + "\n"
          this.ch = this.ch + "E2 : " + this.obj_articles[i].detail[j].e2 + "\n"
          this.ch = this.ch + " ----------------------  \n"

        }


      }
      obj.push(this.ch)
      body.push(obj);
    }

    var def = {


      defaultStyle: {
        // alignment: 'justify'
      },
      pageMargins: [40, 250, 40, 180],
      info: {
        title: 'Fiche Bon Transfert',
      },
      footer: function (currentPage: any, pageCount: any) {
        return {
          margin: 35,
          columns: [
            {
              fontSize: 9,
              text: [

                {
                  text: currentPage.toString() + '/' + pageCount,
                }
              ],
              relativePosition: { x: 250, y: 130 }
            }
          ]
        };
      },
      header: [
        {
          text: '' + id + '\n\n',
          fontSize: 15,
          color: 'black',
          bold: true,
          relativePosition: { x: 365, y: 181 }
        },
        {
          text: ' ' + this.src,
          fontSize: 10,
          color: 'black',
          bold: true,
          relativePosition: { x: 110, y: 107 },

        },

        {
          text: 'rochdi',
          fontSize: 10,
          color: 'black',
          bold: true,
          relativePosition: { x: 390, y: 96 },

        },
        {
          text: '' + this.datePipe.transform(date, 'dd/MM/yyyy'),
          fontSize: 10,
          color: 'black',
          bold: true,
          relativePosition: { x: 520, y: 96},

        },
       

        {
          text: ' ' + this.reclamation,
          fontSize: 10,
          color: 'black',
          relativePosition: { x: 80, y: 665 }
        },
        {
          text: ' ' + this.des,
          fontSize: 10,
          color: 'black',
          bold: true,
          relativePosition: { x: 110, y: 131 }
        },
        {
          text: 'rochdi' ,
          fontSize: 10,
          color: 'black',
          bold: true,
          relativePosition: { x: 110, y: 154 }
        },
        {
          text: '' + this.datePipe.transform(date, 'dd/MM/yyyy'),
          fontSize: 10,
          color: 'black',
          bold: true,
          relativePosition: { x: 65, y: 179 }
        },
      ],
      background: [
        {
          image: 'data:image/jpeg;base64,' + this.modeleSrc2, width: 600
        }
      ],

      content: [

        {
          layout: 'lightHorizontalLines',
          table: {
            widths: [40, 270, 20, 180],
            body: body,
          },
          fontSize: 10,
          margin: [-30, 0, 10, 300]
        }


      ],

    };


    pdfMake.createPdf(def).open({ defaultFileName: 'BonRejet.pdf' });
  }

  //impression de la fiche transfert
  telechargerPDF(id: any, date: any) {
    var body = [];

    for (let i = 0; i < this.obj_articles.length; i++) {
      var obj = new Array();
      obj.push(this.obj_articles[i].id);
      obj.push(this.obj_articles[i].nom);
      obj.push(this.obj_articles[i].qte);
      this.ch = ""
      if (this.obj_articles[i].type == 'serie') {

        for (let j = 0; j < this.obj_articles[i].detail.length; j++) {
          this.ch = this.ch + "N_Série : " + this.obj_articles[i].detail[j].ns + "\n"
          this.ch = this.ch + " ----------------------  \n"
        }


      }
      else if (this.obj_articles[i].type == '4g') {

        for (let j = 0; j < this.obj_articles[i].detail.length; j++) {
          this.ch = this.ch + "N_Série : " + this.obj_articles[i].detail[j].ns + "\n"
          this.ch = this.ch + "E1 : " + this.obj_articles[i].detail[j].e1 + "\n"
          this.ch = this.ch + "E2 : " + this.obj_articles[i].detail[j].e2 + "\n"
          this.ch = this.ch + " ----------------------  \n"

        }


      }
      obj.push(this.ch)
      body.push(obj);
    }

    var def = {


      defaultStyle: {
        // alignment: 'justify'
      },
      pageMargins: [40, 250, 40, 180],
      info: {
        title: 'Fiche Bon Transfert',
      },
      footer: function (currentPage: any, pageCount: any) {
        return {
          margin: 35,
          columns: [
            {
              fontSize: 9,
              text: [

                {
                  text: currentPage.toString() + '/' + pageCount,
                }
              ],
              relativePosition: { x: 250, y: 130 }
            }
          ]
        };
      },
      header: [
        {
          text: '' + id + '\n\n',
          fontSize: 15,
          color: 'black',
          bold: true,
          relativePosition: { x: 365, y: 181 }
        },
        {
          text: ' ' + this.src,
          fontSize: 10,
          color: 'black',
          bold: true,
          relativePosition: { x: 110, y: 107 },

        },

        {
          text: 'rochdi',
          fontSize: 10,
          color: 'black',
          bold: true,
          relativePosition: { x: 390, y: 96 },

        },
        {
          text: '' + this.datePipe.transform(date, 'dd/MM/yyyy'),
          fontSize: 10,
          color: 'black',
          bold: true,
          relativePosition: { x: 520, y: 96},

        },
       

        {
          text: ' ' + this.reclamation,
          fontSize: 10,
          color: 'black',
          relativePosition: { x: 80, y: 665 }
        },
        {
          text: ' ' + this.des,
          fontSize: 10,
          color: 'black',
          bold: true,
          relativePosition: { x: 110, y: 131 }
        },
        {
          text: 'rochdi' ,
          fontSize: 10,
          color: 'black',
          bold: true,
          relativePosition: { x: 110, y: 154 }
        },
        {
          text: '' + this.datePipe.transform(date, 'dd/MM/yyyy'),
          fontSize: 10,
          color: 'black',
          bold: true,
          relativePosition: { x: 65, y: 179 }
        },
      ],
      background: [
        {
          image: 'data:image/jpeg;base64,' + this.modeleSrc2, width: 600
        }
      ],

      content: [

        {
          layout: 'lightHorizontalLines',
          table: {
            widths: [40, 270, 20, 180],
            body: body,
          },
          fontSize: 10,
          margin: [-30, 0, 10, 300]
        }


      ],

    };
    pdfMake.createPdf(def).download("Bon_transfert" + this.id);

  }


  xmldata: any;
  obj_articles: any = [];
  supports: any = [];
  new_obj: any = {}
  sup: any = {}
  arraySupport: any = [];
  support: any = {}
  // Get Detail bon reception 
  xml: any;
  detail: any = [];
  ns: any = {};
  getDetail() {
    this.obj_articles = []
    this.service.Detail_Bon_Transfert(this.id).subscribe((detail: any) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.xml = reader.result;
        var parseString = require('xml2js').parseString;
        let data1;
        parseString(atob(this.xml.substr(28)), function (err: any, result: any) {
          data1 = result.Bon_Transfert;
        })
        this.xmldata = data1

        if (this.xmldata.Produits[0].Produits_Simples[0].Produit != undefined) {
          for (let i = 0; i < this.xmldata.Produits[0].Produits_Simples[0].Produit.length; i++) {

            this.new_obj = {}
            this.new_obj.type = "simple"
            this.new_obj.id = this.xmldata.Produits[0].Produits_Simples[0].Produit[i].Id;
            this.new_obj.nom = this.xmldata.Produits[0].Produits_Simples[0].Produit[i].Nom;
            this.new_obj.qte = this.xmldata.Produits[0].Produits_Simples[0].Produit[i].Qte;
            this.obj_articles.push(this.new_obj)

          }
        }
        if (this.xmldata.Produits[0].Produits_4gs[0].Produit != undefined) {
          for (let i = 0; i < this.xmldata.Produits[0].Produits_4gs[0].Produit.length; i++) {

            this.new_obj = {}
            this.new_obj.type = "4g"
            this.new_obj.id = this.xmldata.Produits[0].Produits_4gs[0].Produit[i].Id;
            this.new_obj.nom = this.xmldata.Produits[0].Produits_4gs[0].Produit[i].Nom;
            this.new_obj.qte = this.xmldata.Produits[0].Produits_4gs[0].Produit[i].Qte;
            this.detail = []
            for (let j = 0; j < this.xmldata.Produits[0].Produits_4gs[0].Produit[i].Produit_4gs[0].Produit_4g.length; j++) {
              this.ns = {}
              this.ns.ns = this.xmldata.Produits[0].Produits_4gs[0].Produit[i].Produit_4gs[0].Produit_4g[j].N_Serie
              this.ns.e1 = this.xmldata.Produits[0].Produits_4gs[0].Produit[i].Produit_4gs[0].Produit_4g[j].E1
              this.ns.e2 = this.xmldata.Produits[0].Produits_4gs[0].Produit[i].Produit_4gs[0].Produit_4g[j].E2
              this.detail.push(this.ns)
            }
            this.new_obj.detail = this.detail
            this.obj_articles.push(this.new_obj)

          }
        }
        if (this.xmldata.Produits[0].Produits_Series[0].Produit != undefined) {
          for (let i = 0; i < this.xmldata.Produits[0].Produits_Series[0].Produit.length; i++) {

            this.new_obj = {}
            this.new_obj.type = "serie"
            this.new_obj.id = this.xmldata.Produits[0].Produits_Series[0].Produit[i].Id;
            this.new_obj.nom = this.xmldata.Produits[0].Produits_Series[0].Produit[i].Nom;
            this.new_obj.qte = this.xmldata.Produits[0].Produits_Series[0].Produit[i].Qte;
            this.detail = []
            for (let j = 0; j < this.xmldata.Produits[0].Produits_Series[0].Produit[i].N_Series.length; j++) {
              this.ns = {}
              this.ns.ns = this.xmldata.Produits[0].Produits_Series[0].Produit[i].N_Series[j].N_Serie

              this.detail.push(this.ns)
            }
            this.new_obj.detail = this.detail

            this.obj_articles.push(this.new_obj)

          }
        }
      }
      reader.readAsDataURL(detail);
    })


  }

  filtre() {
    this.service.filtre_transfert("id_Bon_Transfert", this.form.get('id')?.value, "local_Source", this.form.get('src')?.value, "local_Destination", this.form.get('des')?.value).subscribe((data) => {
      this.dataSource.data = data as table[];
    });
  }


  ngOnInit(): void {
    this.Bon_transfert();

  }

  Bon_transfert() {
    this.service.Bon_transfert().subscribe((data: any) => {
      this.transfert = data;
      this.transfert = this.transfert.sort((a: any, b: any) => a.id_Bon_Transfert > b.id_Bon_Transfert ? -1 : 1);

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
      text: " Suppression de Bon transfert N° " + id,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: ' Supprimer ',
      cancelButtonText: ' Annuler ',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.Supprimer_Bon_transfert(id).subscribe(data => {

          this.Bon_transfert();

        })
        swalWithBootstrapButtons.fire(
          'Suppression',
          'Bon Transfert N° ' + id + ' Supprimé Avec Sucées.',
          'success'
        )
      }
    })
  }



}
export interface table {
  id: number;
  responsable: string
  src: string;
  des: string;


}