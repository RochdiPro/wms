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
import { BonReceptionServiceService } from '../bon-reception-service.service';
declare var require: any

const pdfMake = require("pdfmake/build/pdfmake");
const pdfFonts = require("pdfmake/build/vfs_fonts");

pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-bon-rejet',
  templateUrl: './bon-rejet.component.html',
  styleUrls: ['./bon-rejet.component.scss']
})
export class BonRejetComponent implements OnInit {
  bonRejet: any;

  @ViewChild(MatPaginator) paginator: any = MatPaginator;
  @ViewChild(MatSort) sort: any = MatSort;

  form = new FormGroup({ id: new FormControl(""), responsable: new FormControl(""), type_Bon: new FormControl(""), id_Be: new FormControl("") });

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  displayedColumns: string[] = ['id', "responsable", "type_Be", "id_Be", 'reclamation', 'supprimer'  ]; //les colonne du tableau 
  dataSource = new MatTableDataSource<table>();


  constructor( private datePipe: DatePipe  ,public router: Router, private _formBuilder: FormBuilder, private service: BonReceptionServiceService, private http: HttpClient) {
    this.chargementModel2();
    this.modelePdfBase642();
    sessionStorage.setItem('Utilisateur', "rochdi");

  }


  telecharger(id2: any) {
    this.obj_articles=[]
    this.id = id2
    this.getDetail()
  
    this.service.get_Bon_Rejet_By_Id(id2).subscribe(data => {
      this.bonRejet = data;
      this.type_bon = this.bonRejet.type_Bon;
      this.Destination = this.bonRejet.local
      this.reclamation = this.bonRejet.reclamation
      this.date_Creation = this.bonRejet.date_Creation

      if (this.type_bon == "Bon Entr??e local") {
        this.service.get_Information_Bon_entree_Local( this.bonRejet.id_Bon).subscribe((data: any) => {
          this.Source = data.id_Fr
          this.Destination = data.local      
          this.source_bon= "Fournisseur"
          this.id_bon_source = data.local_Source
          this.service.fournisseur(data.id_Fr).subscribe((data2) =>
          {
            this.src=data2;
            this.nom_bon_Source=this.src.nom_Fournisseur;
            this.tel_bon_Source=this.src.tel1;
          }) 
        });
      }
      else if (this.type_bon == "Bon Importation") {
        this.service.get_Information_Bon_entree_Importation(this.bonRejet.id_Bon).subscribe((data: any) => {
          this.Source = data.id_Fr
          this.Destination = data.local
          this.source_bon= "Fournisseur"
          this.id_bon_source = data.local_Source
          this.service.fournisseur(data.id_Fr).subscribe((data2) =>
          {
            this.src=data2;
            this.nom_bon_Source=this.src.nom_Fournisseur;
            this.tel_bon_Source=this.src.tel1;
          })
  
        });
      }
      else if (this.type_bon == "Bon Transfert") {
        this.service.get_Information_Bon_transfert(this.bonRejet.id_Bon).subscribe((data: any) => {
          
          this.Destination = data.local_Destination
          this.source_bon= "Entrep??t"
          this.nom_bon_Source= data.local_Source
          this.service.Filtre_Fiche_Local(data.local_Source).subscribe((data2) =>
          {
            this.src=data2;
            
            this.nom_bon_Source=this.src[0].nom_Local;
            this.tel_bon_Source=this.src[0].tel;
            this.id_bon_source=this.src[0].id_Local
            this.Source = this.src[0].id_Local
          })
        });
        
      }
      else if (this.type_bon == "Bon Retour") {
        this.service.get_Information_Bon_retour(this.bonRejet.id_Bon).subscribe((data: any) => {
          this.Source = data.id_Clt
          this.Destination = data.local
          this.source_bon= "Client"
          this.id_bon_source = data.local_Source
          this.service.Client(data.id_Clt).subscribe((data2) =>
          {
            this.src=data2;
            this.nom_bon_Source=this.src.nom_Client;
            this.tel_bon_Source=this.src.tel1;
          })
        });
      }

    }, error => console.log(error));
   
    setTimeout(() => {
       
      this.telechargerPDF(this.id, this.date_Creation)
    
      
    }, 500);
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

  source_bon:any;
  id_bon_source :any ;
  nom_bon_Source:any;
  tel_bon_source:any;
  src:any;
  id_Bon:any;
  tel_bon_Source:any;



  pdf(id2: any) {
    this.obj_articles=[]
    this.id = id2
    this.getDetail()
  
    this.service.get_Bon_Rejet_By_Id(id2).subscribe(data => {
      this.bonRejet = data;
      this.type_bon = this.bonRejet.type_Bon;
      this.Destination = this.bonRejet.local
      this.reclamation = this.bonRejet.reclamation
      this.date_Creation = this.bonRejet.date_Creation
      this.id_Bon = this.bonRejet.id_Bon;

      if (this.type_bon == "Bon Entr??e local") {
        this.service.get_Information_Bon_entree_Local( this.bonRejet.id_Bon).subscribe((data: any) => {
          this.Source = data.id_Fr
          this.Destination = data.local      
          this.source_bon= "Fournisseur"
          this.id_bon_source = data.local_Source
          this.service.fournisseur(data.id_Fr).subscribe((data2) =>
          {
            this.src=data2;
            this.nom_bon_Source=this.src.nom_Fournisseur;
            this.tel_bon_Source=this.src.tel1;
          }) 
        });
      }
      else if (this.type_bon == "Bon Importation") {
        this.service.get_Information_Bon_entree_Importation(this.bonRejet.id_Bon).subscribe((data: any) => {
          this.Source = data.id_Fr
          this.Destination = data.local
          this.source_bon= "Fournisseur"
          this.id_bon_source = data.local_Source
          this.service.fournisseur(data.id_Fr).subscribe((data2) =>
          {
            this.src=data2;
            this.nom_bon_Source=this.src.nom_Fournisseur;
            this.tel_bon_Source=this.src.tel1;
          })
  
        });
      }
      else if (this.type_bon == "Bon Transfert") {
        this.service.get_Information_Bon_transfert(this.bonRejet.id_Bon).subscribe((data: any) => {
          
          this.Destination = data.local_Destination
          this.source_bon= "Entrep??t"
          this.nom_bon_Source= data.local_Source
          this.service.Filtre_Fiche_Local(data.local_Source).subscribe((data2) =>
          {
            this.src=data2;
            
            this.nom_bon_Source=this.src[0].nom_Local;
            this.tel_bon_Source=this.src[0].tel;
            this.id_bon_source=this.src[0].id_Local
            this.Source = this.src[0].id_Local
          })
        });
        
      }
      else if (this.type_bon == "Bon Retour") {
        this.service.get_Information_Bon_retour(this.bonRejet.id_Bon).subscribe((data: any) => {
          this.Source = data.id_Clt
          this.Destination = data.local
          this.source_bon= "Client"
          this.id_bon_source = data.local_Source
          this.service.Client(data.id_Clt).subscribe((data2) =>
          {
            this.src=data2;
            this.nom_bon_Source=this.src.nom_Client;
            this.tel_bon_Source=this.src.tel1;
          })
        });
      }

    }, error => console.log(error));
   
    setTimeout(() => {
      console.log('sleep');
      this.generatePDF(this.id,this.date_Creation)
    
      
    }, 500);
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
  // r??cup??ration de modele pour cr??er le pdf
  async chargementModel2() {
    this.http.get('./../../../assets/images/Bon_Rejet.jpg', { responseType: 'blob' }).subscribe((reponse: any) => {
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
    var obj = new Array();
    obj.push(" ");     
    obj.push(" ");
    obj.push(" ");
    body.push(obj);
    let date_edit = this.datePipe.transform(new Date(), 'dd/MM/yyyy  | HH:MM');

    for (let i = 0; i < this.obj_articles.length; i++) {
      var obj = new Array();
      obj.push(this.obj_articles[i].id);
      obj.push(this.obj_articles[i].nom);     
      let ch = "";      
      if (this.obj_articles[i].controle_tech) {
      }
      else {
        ch = ch + " Caract??ristique technique non conforme"
      }
      if (this.obj_articles[i].controle_qt) {

      }
      else { ch = ch + " Quantite non Verifier :  " + this.obj_articles[i].total + " < " + this.obj_articles[i].qte }
      obj.push( ch)      
      body.push(obj);
    }
    var def = {
      
      
      defaultStyle: {
        // alignment: 'justify'
      },
      pageMargins: [40, 250, 40, 180],
      info: {
        title: 'Fiche Bon Rejet',
      },
      footer: function (currentPage:any, pageCount:any) {
        return {
          margin: 35,
          columns: [
            {
              fontSize: 9,
              text: [
  
                {
                  text: currentPage.toString() + '/' + pageCount+"                                           ??diter le  "+date_edit,
                }
              ],
              relativePosition: {x:250, y: 130}	
            } 
          ]
        };
      },
      header:[ 
      {
        text: ' ' + this.type_bon  ,
        fontSize: 10, 
        color: 'black',
        bold: true,
        relativePosition: {x:80, y:107}	  , 
         
      },
      {
        text: ' ' + this.id_Bon ,
        fontSize: 10, 
        color: 'black',
        bold: true,
        relativePosition: {x:220, y:107}	  , 
         
      },
      {
        text: sessionStorage.getItem('Utilisateur')  ,
        fontSize: 10, 
        color: 'black',
        bold: true,
        relativePosition: {x:390, y:96}	  , 
         
      },
      {
        text: ''+ this.datePipe.transform(date, 'dd/MM/yyyy')  ,
        fontSize: 10, 
        color: 'black',
        bold: true,
        relativePosition: {x:520, y:96}	  , 
         
      },
      
      {
        text: '' + this.Destination + '\n\n',
        fontSize: 10, 
        color: 'black',
        bold: true,
        relativePosition: {x:65, y:131}	       
      },
      {
        text: '' + this.source_bon + '\n\n',
        fontSize: 10, 
        color: 'black',
        bold: true,
        relativePosition: {x:69, y:154	 }      
      },
      {
        text: '' + this.nom_bon_Source + '\n\n',
        fontSize: 10, 
        color: 'black',
        bold: true,
        relativePosition: {x:180, y:154	 }      
      }
      ,
      {
        text: '' + this.Source + '\n\n',
        fontSize: 10, 
        color: 'black',
        bold: true,
        relativePosition: {x:200, y:179	 }      
      },
      
      {
        text: '' + this.tel_bon_Source + '\n\n',
        fontSize: 10, 
        color: 'black',
        bold: true,
        relativePosition: {x:64, y:179}	       
      },
      {
        text: '' + id + '\n\n',
        fontSize: 15, 
        color: 'black',
        bold: true,
        relativePosition: {x:370, y:180}	  
      },
      {
        text: ' ' +this.reclamation ,
        fontSize: 10, 
        color: 'black',            
        relativePosition: {x: 60, y:665}	       
      },  
     ] ,
      background: [
        {
          image: 'data:image/jpeg;base64,' + this.modeleSrc2, width: 600
        }
      ],

      content: [
       
        {
          layout: 'lightHorizontalLines',
          table: {          
            widths: [ 50, 240, 236 ],         
            body: body, 
          },      
          fontSize: 10, 
          margin: [-16, -19 , 10,300]        
        }
        
         
      ],
      
    };
    pdfMake.createPdf(def).open({ defaultFileName: 'BonRejet.pdf' });
  }

  //impression de la fiche recption
  telechargerPDF(id: any, date: any) {

    var body = [];    
    var obj = new Array();
    obj.push(" ");     
    obj.push(" ");
    obj.push(" ");
    body.push(obj);
    let date_edit = this.datePipe.transform(new Date(), 'dd/MM/yyyy  | HH:MM');

    for (let i = 0; i < this.obj_articles.length; i++) {
      var obj = new Array();
      obj.push(this.obj_articles[i].id);
      obj.push(this.obj_articles[i].nom);     
      let ch = "";      
      if (this.obj_articles[i].controle_tech) {
      }
      else {
        ch = ch + " Caract??ristique technique non conforme"
      }
      if (this.obj_articles[i].controle_qt) {

      }
      else { ch = ch + " Quantite non Verifier :  " + this.obj_articles[i].total + " < " + this.obj_articles[i].qte }
      obj.push( ch)      
      body.push(obj);
    }
    var def = {
      
      
      defaultStyle: {
        // alignment: 'justify'
      },
      pageMargins: [40, 250, 40, 180],
      info: {
        title: 'Fiche Bon Rejet',
      },
      footer: function (currentPage:any, pageCount:any) {
        return {
          margin: 35,
          columns: [
            {
              fontSize: 9,
              text: [
  
                {
                  text: currentPage.toString() + '/' + pageCount+"                                           ??diter le  "+date_edit,
                }
              ],
              relativePosition: {x:250, y: 130}	
            } 
          ]
        };
      },
      header:[ 
      {
        text: ' ' + this.type_bon  ,
        fontSize: 10, 
        color: 'black',
        bold: true,
        relativePosition: {x:80, y:107}	  , 
         
      },
      {
        text: ' ' + this.id_Bon ,
        fontSize: 10, 
        color: 'black',
        bold: true,
        relativePosition: {x:220, y:107}	  , 
         
      },
      {
        text: sessionStorage.getItem('Utilisateur')  ,
        fontSize: 10, 
        color: 'black',
        bold: true,
        relativePosition: {x:390, y:96}	  , 
         
      },
      {
        text: ''+ this.datePipe.transform(date, 'dd/MM/yyyy')  ,
        fontSize: 10, 
        color: 'black',
        bold: true,
        relativePosition: {x:520, y:96}	  , 
         
      },
      
      {
        text: '' + this.Destination + '\n\n',
        fontSize: 10, 
        color: 'black',
        bold: true,
        relativePosition: {x:65, y:131}	       
      },
      {
        text: '' + this.source_bon + '\n\n',
        fontSize: 10, 
        color: 'black',
        bold: true,
        relativePosition: {x:69, y:154	 }      
      },
      {
        text: '' + this.nom_bon_Source + '\n\n',
        fontSize: 10, 
        color: 'black',
        bold: true,
        relativePosition: {x:180, y:154	 }      
      }
      ,
      {
        text: '' + this.Source + '\n\n',
        fontSize: 10, 
        color: 'black',
        bold: true,
        relativePosition: {x:200, y:179	 }      
      },
      
      {
        text: '' + this.tel_bon_Source + '\n\n',
        fontSize: 10, 
        color: 'black',
        bold: true,
        relativePosition: {x:64, y:179}	       
      },
      {
        text: '' + id + '\n\n',
        fontSize: 15, 
        color: 'black',
        bold: true,
        relativePosition: {x:370, y:180}	  
      },
      {
        text: ' ' +this.reclamation ,
        fontSize: 10, 
        color: 'black',            
        relativePosition: {x: 60, y:665}	       
      },  
     ] ,
      background: [
        {
          image: 'data:image/jpeg;base64,' + this.modeleSrc2, width: 600
        }
      ],

      content: [
       
        {
          layout: 'lightHorizontalLines',
          table: {          
            widths: [ 50, 240, 236 ],         
            body: body, 
          },      
          fontSize: 10, 
          margin: [-16, -19 , 10,300]        
        }
        
         
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
    this.service.Detail_Bon_Rejet(this.id).subscribe((detail: any) => {
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

    setTimeout(() => {
       
      this.generatePDF(this.id,this.date_Creation)
    
      
    }, 1000);

  }



  filtre() {
    this.service.filtre_bon_rejet("id", this.form.get('id')?.value, "responsable", this.form.get('responsable')?.value, "type_bon", this.form.get('type_Bon')?.value).subscribe((data) => {
      this.dataSource.data = data as table[];
    });
  }

  Bon_rejet() {
    this.service.Bon_rejet().subscribe((data: any) => {
      this.bonRejet = data;
      this.bonRejet= this.bonRejet.sort((a:any, b:any) => a.id > b.id ? -1 : 1);
      this.dataSource.data = data as table[];
    })
  }

  ngOnInit(): void {
    this.Bon_rejet();

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
      text: " Suppression de Bon  Rejet N?? " + id,
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
          'Bon Rejet N?? ' + id + ' Supprim?? Avec Suc??es.',
          'success'
        )
      }
    })
  }



}
export interface table {
  id: number;
  responsable: string
  etat: string;
  type_Be: string;
  id_Be: String;
}