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
import { DatePipe } from '@angular/common';
import { delay } from 'rxjs/operators';
declare var require: any

const pdfMake = require("pdfmake/build/pdfmake");
const pdfFonts = require("pdfmake/build/vfs_fonts");

pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-lister-bon-reception',
  templateUrl: './lister-bon-reception.component.html',
  styleUrls: ['./lister-bon-reception.component.scss']
})

export class ListerBonReceptionComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: any = MatPaginator;
  @ViewChild(MatSort) sort: any = MatSort;

  form = new FormGroup({ id: new FormControl(""), responsable: new FormControl(""), etat: new FormControl(""), type_be: new FormControl("") });

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  displayedColumns: string[] = ['modifier', 'id', "responsable", "etat", "type_Be", "id_Be", 'supprimer' ]; //les colonne du tableau 
  dataSource = new MatTableDataSource<table>();



  bonReception: any;


  constructor(private datePipe: DatePipe ,public router: Router, private _formBuilder: FormBuilder, private service: BonReceptionServiceService, private http: HttpClient) {
    this.chargementModel();
    this.modelePdfBase64();
  }
  Bon_Receptions() {
    this.service.Bon_Receptions().subscribe((data: any) => {
      this.bonReception = data;
      this.bonReception= this.bonReception.sort((a:any, b:any) => a.id > b.id ? -1 : 1);
      this.dataSource.data = data as table[];
    })
  }

  // temps d'attente pour le traitement de fonction 
  delai(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
   // conversion de modele de pdf  en base 64 
   async modelePdfBase64() {
    await this.delai(4000);
    const lecteur = new FileReader();
    lecteur.onloadend = () => {
      this.modeleSrc = lecteur.result;
      this.modeleSrc = btoa(this.modeleSrc);
      this.modeleSrc = atob(this.modeleSrc);
      this.modeleSrc = this.modeleSrc.replace(/^data:image\/[a-z]+;base64,/, "");
    }
    lecteur.readAsDataURL(this.modele);
  }
  // récupération de modele pour créer le pdf
  async chargementModel() {
    this.http.get('./../../../assets/images/ficheRecpetion.jpg', { responseType: 'blob' }).subscribe((reponse: any) => {
      this.modele = reponse;
      return this.modele;
    }, err => console.error(err))
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


  }

  Modifier_Bon(id: any) {
    this.router.navigate(['/Menu/WMS-Reception/Modifier/', id]);
  }
  



  filtre() {
     
      
    this.service.filtre("id", this.form.get('id')?.value, "responsable", this.form.get('responsable')?.value, "etat", this.form.get('etat')?.value, "type_be", this.form.get('type_be')?.value).subscribe((data) => {
      this.dataSource.data = data as table[];
    });
  }



  Source: any;
  Destination: any;
  modele: any;
  type_bon:any;
  nbSupport:any
  id:any
  source_bon:any;
  date_Creation:any;
  id_bon_source :any ;
  nom_bon_Source:any;
  tel_bon_source:any;
  src:any;
  tel_bon_Source:any;

  // generate pdf function 
  async pdf(id2: any) {
    this.id=id2
    this.getDetail()
    this.service.get_Bon_Reception_By_Id(id2).subscribe(data => {
      this.bonReception = data;
      this.type_bon = this.bonReception.type_Be;
      this.Destination = this.bonReception.local
      this.nbSupport = this.bonReception.nb_Support
      this.date_Creation =  this.bonReception.date_Creation
      if (this.type_bon == "Bon Entrée local") {
        this.service.get_Information_Bon_entree_Local( this.bonReception.id_Be).subscribe((data: any) => {
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
        this.service.get_Information_Bon_entree_Importation(this.bonReception.id_Be).subscribe((data: any) => {
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
        this.service.get_Information_Bon_transfert(this.bonReception.id_Be).subscribe((data: any) => {
          
          this.Destination = data.local_Destination
          this.source_bon= "Entrepôt"
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
        this.service.get_Information_Bon_retour(this.bonReception.id_Be).subscribe((data: any) => {
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
  }



  xmldata: any;
  obj_articles: any = [];
  supports: any = [];
  new_obj: any = {}
  sup: any = {}
  arraySupport: any = [];
  support:any={}

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

  // Get Detail bon reception 
  getDetail() {
    this.obj_articles=[]
    this.service.Detail_Bon_Reception(this.id).subscribe((detail: any) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        this.bonReception = reader.result;
        var parseString = require('xml2js').parseString;
        let data1;
        parseString(atob(this.bonReception.substr(28)), function (err: any, result: any) {
          data1 = result.Bon_Reception;

        })

           
        this.xmldata = data1
        for (let k = 0; k < this.xmldata.Liste_Supports[0].Support.length; k++) {
          this.arraySupport.push(this.ajouterligneSupport());
          this.arraySupport[k].Numero = this.xmldata.Liste_Supports[0].Support[k].Numero;
          this.arraySupport[k].typeSupport = this.xmldata.Liste_Supports[0].Support[k].typeSupport;
          this.arraySupport[k].poids = this.xmldata.Liste_Supports[0].Support[k].poids;
          this.arraySupport[k].hauteur = this.xmldata.Liste_Supports[0].Support[k].hauteur;
          this.arraySupport[k].largeur = this.xmldata.Liste_Supports[0].Support[k].largeur;
          this.arraySupport[k].longeur = this.xmldata.Liste_Supports[0].Support[k].longeur;
        }
        
        for (let i = 0; i < this.xmldata.Produits[0].Produit.length; i++) {

          this.new_obj = {}
          this.new_obj.id = this.xmldata.Produits[0].Produit[i].Id;
          this.new_obj.nom = this.xmldata.Produits[0].Produit[i].Nom;
          this.new_obj.fiche_Technique = this.xmldata.Produits[0].Produit[i].Fiche_Technique;
          this.new_obj.qte = this.xmldata.Produits[0].Produit[i].Qte;
          this.new_obj.famaille = this.xmldata.Produits[0].Produit[i].famaille;
          this.new_obj.sous_famaille = this.xmldata.Produits[0].Produit[i].sous_famaille;
          this.new_obj.total = this.xmldata.Produits[0].Produit[i].Total;

          this.supports = []
          for (let k = 0; k < this.arraySupport.length; k++) {
            this.support = {}
            this.support.id = k;
            this.support.qte = 0;
            this.supports.push(this.support);
          }

          if (this.xmldata.Produits[0].Produit[i].Supports[0].Support) {
            for (let h = 0; h < this.xmldata.Produits[0].Produit[i].Supports[0].Support.length; h++) {
              for (let z = 0; z < this.arraySupport.length; z++) {
                if (this.supports[z].id == this.xmldata.Produits[0].Produit[i].Supports[0].Support[h].Numero_Support) {
                  this.supports[z].qte = this.xmldata.Produits[0].Produit[i].Supports[0].Support[h].Qte
                }
              }

            }
          }
          this.new_obj.supports = this.supports;         
          this.new_obj.controle_qt = true;
          this.new_obj.controle_tech =true ;
        
          if(this.xmldata.Produits[0].Produit[i].Qte_Verifier== 'false'){
          this.new_obj.controle_qt = false;
          }          
          if(this.xmldata.Produits[0].Produit[i].Fiche_Technique_Verifier == 'false')
          {
            this.new_obj.controle_tech =false;
          }
          this.obj_articles.push(this.new_obj)
          
        }
      }
      
      reader.readAsDataURL(detail);
     
    })
    setTimeout(() => {
       
      this.generatePDF(this.id,this.date_Creation)
    
      
    }, 1000);
   
  }

  getDetail_telepcharger() {
    this.obj_articles=[]
    this.service.Detail_Bon_Reception(this.id).subscribe((detail: any) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        this.bonReception = reader.result;
        var parseString = require('xml2js').parseString;
        let data1;
        parseString(atob(this.bonReception.substr(28)), function (err: any, result: any) {
          data1 = result.Bon_Reception;

        })

           
        this.xmldata = data1
        for (let k = 0; k < this.xmldata.Liste_Supports[0].Support.length; k++) {
          this.arraySupport.push(this.ajouterligneSupport());
          this.arraySupport[k].Numero = this.xmldata.Liste_Supports[0].Support[k].Numero;
          this.arraySupport[k].typeSupport = this.xmldata.Liste_Supports[0].Support[k].typeSupport;
          this.arraySupport[k].poids = this.xmldata.Liste_Supports[0].Support[k].poids;
          this.arraySupport[k].hauteur = this.xmldata.Liste_Supports[0].Support[k].hauteur;
          this.arraySupport[k].largeur = this.xmldata.Liste_Supports[0].Support[k].largeur;
          this.arraySupport[k].longeur = this.xmldata.Liste_Supports[0].Support[k].longeur;
        }
        
        for (let i = 0; i < this.xmldata.Produits[0].Produit.length; i++) {

          this.new_obj = {}
          this.new_obj.id = this.xmldata.Produits[0].Produit[i].Id;
          this.new_obj.nom = this.xmldata.Produits[0].Produit[i].Nom;
          this.new_obj.fiche_Technique = this.xmldata.Produits[0].Produit[i].Fiche_Technique;
          this.new_obj.qte = this.xmldata.Produits[0].Produit[i].Qte;
          this.new_obj.famaille = this.xmldata.Produits[0].Produit[i].famaille;
          this.new_obj.sous_famaille = this.xmldata.Produits[0].Produit[i].sous_famaille;
          this.new_obj.total = this.xmldata.Produits[0].Produit[i].Total;

          this.supports = []
          for (let k = 0; k < this.arraySupport.length; k++) {
            this.support = {}
            this.support.id = k;
            this.support.qte = 0;
            this.supports.push(this.support);
          }

          if (this.xmldata.Produits[0].Produit[i].Supports[0].Support) {
            for (let h = 0; h < this.xmldata.Produits[0].Produit[i].Supports[0].Support.length; h++) {
              for (let z = 0; z < this.arraySupport.length; z++) {
                if (this.supports[z].id == this.xmldata.Produits[0].Produit[i].Supports[0].Support[h].Numero_Support) {
                  this.supports[z].qte = this.xmldata.Produits[0].Produit[i].Supports[0].Support[h].Qte
                }
              }

            }
          }
          this.new_obj.supports = this.supports;         
          this.new_obj.controle_qt = true;
          this.new_obj.controle_tech =true ;
        
          if(this.xmldata.Produits[0].Produit[i].Qte_Verifier== 'false'){
          this.new_obj.controle_qt = false;
          }          
          if(this.xmldata.Produits[0].Produit[i].Fiche_Technique_Verifier == 'false')
          {
            this.new_obj.controle_tech =false;
          }
          this.obj_articles.push(this.new_obj)
          
        }
      }
      
      reader.readAsDataURL(detail);
     
    })
    setTimeout(() => {
       
      this.telechargerpdf(this.id,this.date_Creation)
    
      
    }, 1000);
   
  }


 modeleSrc: any;
  //impression de la fiche recption
  body:any=[];
  async generatePDF(id: any, date_Creation: any) {

    await delay(1000);
    this.body=[];
   
    for (let i = 0; i < this.obj_articles.length; i++) {
      
      var obj = new Array();
      obj.push(this.obj_articles[i].id);
      obj.push(this.obj_articles[i].nom);
      obj.push(this.obj_articles[i].qte);
       
      this.body.push(obj);
    }
    let def = {
      pageMargins: [40, 250, 40, 180],
      info: {
        title: 'Fiche Bon Réception',
      },
      
      footer: function (currentPage:any, pageCount:any) {
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
        text: ' ' + this.id  ,
        fontSize: 10, 
        color: 'black',
        bold: true,
        relativePosition: {x:220, y:107}	  , 
         
      },
      {
        text: 'rochdi'  ,
        fontSize: 10, 
        color: 'black',
        bold: true,
        relativePosition: {x:390, y:96}	  , 
         
      },
      {
        text: ''+ this.datePipe.transform(date_Creation, 'dd/MM/yyyy')  ,
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
        relativePosition: {x:370, y:182}	 	       
      },
     ] ,
     
     
      background: [
       
        {
          image: 'data:image/jpeg;base64,' + this.modeleSrc, width: 600          
        } 
      ],
      
   
      content: [
        
        {
          layout: 'lightHorizontalLines',
          table: {          
            widths: [ 40, 455, 40 ],         
            body: this.body, 
          },      
          fontSize: 10, 
          margin: [-30, 0 , 10,300]     
        }
        
         
      ],
      
    };


    pdfMake.createPdf(def).open({ defaultFileName: 'FicheRecpetion.pdf' });
   // pdfMake.createPdf(def).open({ defaultFileName: 'FicheRecpetion.pdf' });
     

  }


  // telecharger pdf  
  async telechargerpdf(id: any,date_Creation: any) {
    this.body=[];
    await delay(1000);
    for (let i = 0; i < this.obj_articles.length; i++) {
      
      var obj = new Array();
      obj.push(this.obj_articles[i].id);
      obj.push(this.obj_articles[i].nom);
      obj.push(this.obj_articles[i].qte);
     
      this.body.push(obj);
    }
    let def = {
      pageMargins: [40, 250, 40, 180],
      info: {
        title: 'Fiche Bon Réception',
      },
      
      footer: function (currentPage:any, pageCount:any) {
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
        text: ' ' + this.id  ,
        fontSize: 10, 
        color: 'black',
        bold: true,
        relativePosition: {x:220, y:107}	  , 
         
      },
      {
        text: 'rochdi'  ,
        fontSize: 10, 
        color: 'black',
        bold: true,
        relativePosition: {x:390, y:96}	  , 
         
      },
      {
        text: ''+ this.datePipe.transform(date_Creation, 'dd/MM/yyyy')  ,
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
        relativePosition: {x:370, y:182}	  
      },
     ] ,
     
     
      background: [
       
        {
          image: 'data:image/jpeg;base64,' + this.modeleSrc, width: 600          
        } 
      ],
      
   
      content: [
        
        {
          layout: 'lightHorizontalLines',
          table: {          
            widths: [ 40, 455, 40 ],              
            body: this.body, 
          },      
          fontSize: 10, 
          margin: [-30, 0 , 10,300]     
        }
        
         
      ],
      
    };


    pdfMake.createPdf(def).download("Bon_Reception_"+this.id);
     this.obj_articles=[]
 
  }


  telecharger(id2: any) {
    this.id=id2
    this.getDetail()
    this.service.get_Bon_Reception_By_Id(id2).subscribe(data => {
      this.bonReception = data;
      this.type_bon = this.bonReception.type_Be;
      this.Destination = this.bonReception.local
      this.nbSupport = this.bonReception.nb_Support
      this.date_Creation =  this.bonReception.date_Creation
    }, error => console.log(error));
     
  //  this.telechargerpdf(this.id,this.date_Creation) ;
  }
}

export interface table {
  id: number;
  responsable: string
  etat: string;
  type_Be: string;
  id_Be: String;
}
