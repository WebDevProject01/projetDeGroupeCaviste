// Variables globales

let compteur = 0; // Compteur qui permettra de savoir sur quelle slide nous sommes
let timer, elements, slides, slideWidth;

const apiURL = 'https://cruth.phpnet.org/epfc/caviste/public/index.php/api';        
const picturesURL = 'http://localhost/WebDevProject01/Caviste/images/pics/';
let wines;

    window.onload = () => {
        // On récupère le conteneur principal du diaporama
        const diapo = document.querySelector(".diapo");

        // On récupère le conteneur de tous les éléments
        elements = document.querySelector(".elements");

        // On récupère un tableau contenant la liste des diapos
        slides = Array.from(elements.children);

        // On calcule la largeur visible du diaporama
        slideWidth = diapo.getBoundingClientRect().width;

        // On récupère les deux flèches
        let next = document.querySelector("#nav-droite");
        let prev = document.querySelector("#nav-gauche");

        // On met en place les écouteurs d'évènements sur les flèches
        next.addEventListener("click", slideNext);
        prev.addEventListener("click", slidePrev);

        // Automatiser le diaporama
        timer = setInterval(slideNext, 4000);

        // Gérer le survol de la souris
        diapo.addEventListener("mouseover", stopTimer);
        diapo.addEventListener("mouseout", startTimer);

        // Mise en oeuvre du "responsive"
        window.addEventListener("resize", () => {
            slideWidth = diapo.getBoundingClientRect().width;
            slideNext();
        })
    

    /**
     * Cette fonction fait défiler le diaporama vers la droite
     */
    function slideNext(){
        // On incrémente le compteur
        compteur++;

        // Si on dépasse la fin du diaporama, on "rembobine"
        if(compteur == slides.length){
            compteur = 0;
        }

        // On calcule la valeur du décalage
        let decal = -slideWidth * compteur;
        elements.style.transform = `translateX(${decal}px)`;
    }

    /**
     * Cette fonction fait défiler le diaporama vers la gauche
     */
    function slidePrev(){
        // On décrémente le compteur
        compteur--;

        // Si on dépasse le début du diaporama, on repart à la fin
        if(compteur < 0){
            compteur = slides.length - 1;
        }

        // On calcule la valeur du décalage
        let decal = -slideWidth * compteur;
        elements.style.transform = `translateX(${decal}px)`;
    }

    /**
     * On stoppe le défilement
     */
    function stopTimer(){
        clearInterval(timer);
    }

    /**
     * On redémarre le défilement
     */
    function startTimer(){
        timer = setInterval(slideNext, 4000);
    }

        const options = {
            'method':'GET'
        };
        
        fetch(apiURL + '/wines', options).then(function(response) {
            if(response.ok) {
                response.json().then(function(data){
                    wines = data;
                    
                    //Afficher la liste des vins dans UL liste
                    showListe(wines);
                });
            }
        });

        const xhr = new XMLHttpRequest();       
        
        xhr.onreadystatechange = function() {
            if(xhr.readyState==4 && xhr.status==200) {
                let data = xhr.responseText;        
                
                wines = JSON.parse(data);  			
                
                //Afficher la liste des vins dans UL liste
                showListe(wines);
            }     
        };
        
        xhr.open('GET','js/wines.json',true);
        xhr.send();
        

        //Configuration des boutons
        let btSearch = document.getElementById('btSearch');
        btSearch.addEventListener('click', search); 
        
        let btNewWine = document.getElementById('btNewWine');
        btNewWine.addEventListener('click', newWine);
        
        /* let btSave = document.getElementById('btSave');
        btSave.addEventListener('click', saveWine); */
        
        let btDelete = document.getElementById('btDelete');
        btDelete.addEventListener('click', deleteWine);
        
        let btImgChange = document.getElementById('btImgChange');
        btImgChange.addEventListener('click', chgImg);   

        /* let btnFiltre = document.getElementById('btnFiltre');
        btnFiltre.addEventListener('click', getWine); */

        let btLike = document.getElementById('btLike');
        btLike.addEventListener('click', like);

        let btnLike = document.getElementById('btnLike');
        btLike.addEventListener('click', nonLike);   
        
        let btCountry = document.getElementById('liste');
        btCountry.addEventListener('click', showCountry);
};
   
  //Fonction pour charger l'image->chImg()
function chgImg(){
	let pictureFile = document.getElementById('pictureFile');
	pictureFile.click(); 
} 

//Afficher la liste des vins->showListe()
function showListe(wines) {
    //Sélectionner la liste des vins
    let listeUL = document.getElementById('liste');
    let strLIs = '';
       
    //Pour chaque vin, créer un LI
    wines.forEach(function(wine) {
        let idWine = wine.id;

        strLIs += '<li data-id="'+idWine+'" class="list-group-item">'+wine.name+'</li>';
    });


    //Insérer tous les LIs dans la liste UL des vins
    listeUL.innerHTML = strLIs;

    //Récupérer tous les LIs
    let nodeLIs = listeUL.getElementsByTagName('li');

    //Ajouter un gestionnaire d'événement sur chaque LI
    for(let li of nodeLIs) {
        li.addEventListener('click',function() { 
            getWine(this.dataset.id, wines, false);            

            //Affichage nom wine dans courbe stat
            let nom = document.querySelector('h5.bt-wine');
            let nomAff  = document.getElementById('name'); 
            nom.innerHTML = nomAff.value;
            
            //Affichage img wine dans courbe stat
            let imgWine = document.getElementsByClassName('img-courbe');
            let imgAff =  document.getElementsByClassName('img-win');
            imgWine[0].src = imgAff[0].src;

            //Affichage de la description
            let desriOut = document.querySelector('div#nav-44518-content-1');
            let descriIN = document.getElementById('description');
            desriOut.innerHTML = descriIN.value;

            
            //Retrouver les comments d'un vin par son Id
            
                const commeId = document.getElementById('idWine').value;
                const options = {
                    'method': 'GET',
                    'mode': 'cors',
                    'headers': {
                        'content-type': 'application/json; charset=utf-8',
                    }
                };
                
                const fetchURL = '/wines/'+commeId+'/comments';
                
                let comments = fetch(apiURL + fetchURL, options).then(function(response) {
                    if(response.ok) {
                        response.json().then(function(data){
                            console.log(data);
                        });
                    }
                });
                Object.values(comments).forEach(function(c){
                    let comments = c.content;
                })
                console.log(comments);

                let affComments = document.querySelector('div#nav-44518-content-2');
                affComments.innerText = getWine(commeId, comments);
        });
    }  
}

//getWine()
function getWine(id, wines) {
    let wine = wines.find(wine => wine.id == id);
    
    let input = document.getElementById('idWine');
    input.value = wine.id;

    input = document.getElementById('name');
    input.value = wine.name;

    input = document.getElementById('grapes');
    input.value = wine.grapes;

    input = document.getElementById('country');
    input.value = wine.country;

    input = document.getElementById('region');
    input.value = wine.region;

    input = document.getElementById('year');
    input.value = wine.year;

    input = document.getElementById('description');
    input.value = wine.description;
	
	input = document.getElementById('price');
    input.value = wine.price;
	
	input = document.getElementById('capacity');
    input.value = wine.capacity;
	
	input = document.getElementById('color');
    input.value = wine.color;
	
	input = document.getElementById('extra');
    input.value = wine.extra;

    let imgWine = document.getElementById('picture');	
    imgWine.src = wine.picture!='' ? picturesURL + wine.picture : 'images/pics/No_picture_available.png';	
    imgWine.alt = wine.picture;	
}

//Afficher les pays -> showListePays
/* function showListPays(){
    let pays = fetch('https://cruth.phpnet.org/epfc/caviste/public/index.php/api/wines/countries')
	  .then(response => response.json())
      .then(json => console.log(json))
      
      let listPays = '';
      pays.forEach(function(p) {
        console.log(p[0]);
      })
}
showListPays(); */

//Rechercher un vin dans la liste->search()
function search(){
    let inputKeyword = document.getElementById('keyword');
    let keyword = inputKeyword.value;
    let reg = new RegExp(keyword, 'i');

    let filteredWines = Object.values(wines).forEach(function(wine){
        if(wine.name.search(reg) != -1 ){
            return (wine.name);
        }
       else if(wine.year.search(reg) != -1 && (wine.year.length === 4)){
            return (wine.name);
        }
        else if(wine.id.search(reg) != -1){
            return (wine.name);
        }
    })
    showListe(filteredWines);

} 
/* function search() {
    let inputKeyword = document.getElementById('keyword');
    let keyword = inputKeyword.value;   
    
    //Filtrer la liste des vins sur base du keyword
    const regex = new RegExp(keyword, 'i');
    let filteredWines = wines.filter(wine => wine.name && wine.name.search(regex)!=-1);

    //Afficher les vins dans le UL liste
    showListe(filteredWines);			
} */

//Rechercher un vin dans la liste par son Id->searchId()
function searchId() {
    const recheId = document.getElementById('keyword').value;
	const options = {
        'method': 'GET',	
        'mode': 'cors',
        'headers': {
            'content-type': 'application/json; charset=utf-8',	
        }
    };
    
    const fetchURL = '/wines/'+recheId;
    
    let vin = fetch(apiURL + fetchURL, options).then(function(response) {
        if(response.ok) {
            response.json().then(function(data){
                console.log(data);
            });
        }
    });
    getWine(recheId, vin)
}

//Liste des pays
let listPays = '';
      Object.values(pays).forEach(function(p) {
        console.log(p[0]);
      })

//Ajouter un vin->newWine()
function newWine() {
    //Vider le formulaire
    let input = document.getElementById('idWine');
    input.value = '';

    let inputName = document.getElementById('name');
    inputName.value = '';

    input = document.getElementById('grapes');
    input.value = '';

    input = document.getElementById('country');
    input.value = '';

    input = document.getElementById('region');
    input.value = '';

    input = document.getElementById('year');
    input.value = '';
	
	input = document.getElementById('price');
    input.value = '';
	
	input = document.getElementById('color');
    input.value = '';

    input = document.getElementById('capacity');
    input.value = '';
	
	input = document.getElementById('extra');
    input.value = '';
	
	input = document.getElementById('description');
    input.value = '';

    let imgWine = document.getElementById('picture');
    imgWine.src = 'images/pics/generic.jpg';
    
    //Mettre le curseur dans le champ name
    inputName.focus();
}

//Sauver une modification->saveWine()
function saveWine() {
    //Création d'un objet wine
    let wine = {};
    
    //Récupérer les données du formulaire et les transférer à l'objet wine
    let input = document.getElementById('idWine');
    wine.id = input.value;
	
    input = document.getElementById('name');
    wine.name = input.value;

    input = document.getElementById('grapes');
    wine.grapes = input.value;

    input = document.getElementById('country');
    wine.country = input.value;

    input = document.getElementById('region');
    wine.region = input.value;

    input = document.getElementById('year');
    wine.year = input.value;

    input = document.getElementById('description');
    wine.description = input.value;

    input = document.getElementById('price');
    wine.price = input.value;
	
	input = document.getElementById('capacity');
    wine.capacity = input.value;
	
	input = document.getElementById('color');
    wine.color = input.value;
	
	input = document.getElementById('extra');
    wine.extra = input.value;
	
	let imgWine = document.getElementById('picture');
    wine.picture = imgWine.src;
	
    console.log(wine.picture);
	
    //Envoyer l'objet wine à l'API en POST ou en PUT
    let method = (wine.id=='') ?'POST':'PUT';
 	
    const options = {
        'method': method,
        'body': JSON.stringify(wine),
        'mode': 'cors',
        'headers': {
            'content-type': 'application/json; charset=utf-8'
        }
    };
    console.log(options.method);
	
    const fetchURL = method=='PUT' ? '/wines':'/wines/'+wine.id; 
    
	console.log(fetchURL);
    
	fetch(apiURL + fetchURL, options).then(function(response) {        
		
		console.log(response.ok);
		
		if(response.ok) {
            response.json().then(function(data){
                console.log(data);
                
                //Mettre à jour la liste des vins (soit ajouter, soit modifier)
                wines = wines.filter(wine => wine.id != wine.id);
                
                if(method=='POST') {
                    //Récupérer l'id du vin créé
                    wine.id = data.id;

                    //Afficher l'id du nouveau vin dans le formulaire
                    let input = document.getElementById('idWine');
                    input.value = wine.id;
                }
                
                //Ajouter le nouveau vin dans la liste
                wines.push(wine);
                
                //Réafficher la liste des vins
                showListe(wines);
            });
			
			console.log("OK");
			
        }else{
			console.log("NOT OK");
			console.log(wine);
		}
    });
}


//Supprimer un vin->deleteWine()
function deleteWine() {
    //Récupérer les données du formulaire et les transférer l'objet wine
    let idWine = document.getElementById('idWine').value;
 
    const options = {
        'method': 'DELETE',
        'mode': 'cors',
        'headers': {
            'content-type': 'application/json; charset=utf-8'
        }
    };
    
    const fetchURL = '/wines/'+idWine;
    
    fetch(apiURL + fetchURL, options).then(function(response) {
        if(response.ok) {
            response.json().then(function(data){
                console.log(data);
                
                //Mettre à jour la liste des vins
                wines = wines.filter(wine => wine.id != idWine);
                
                //Réafficher la liste des vins
                showListe(wines);
                
                //Réinitialiser le formulaire
                newWine();
            });
        }
    });
}   

//Afficher la liste des pays->showCountry()
function showCountry(wines) {
    //Sélectionner la liste des vins
    let listePays = document.getElementById('liste');
    let paysLIs = '';
           
    //Pour chaque vin, créer un LI des pays
    wines.forEach(function(wine) {
        let idWine = wine.id;
        
        paysLIs += '<li data-id="'+idWine+'" class="list-group-item">'+wine.name+'=>'+wine.country+'</li>';

    });
    
         //Insérer tous les LIs dans la liste UL des vins
         listeUL.innerHTML = paysLIs;
}
//Liker un vin
function like(){
    const likeId = document.getElementById('idWine').value;
	const options = {
        'method': 'PUT',
        'body': { "like" : true},	
        'mode': 'cors',
        'headers': {
            'content-type': 'application/json; charset=utf-8',
            'Authorization': 'Basic '+btoa('alain:epfc')	
        }
    };
    
    const fetchURL = '/wines/'+wineId+'/likeId';
    
    fetch(apiURL + fetchURL, options).then(function(response) {
        if(response.ok) {
            response.json().then(function(data){
                console.log(data);
            });
        }
    });
}

//Non Liker un vin
function nonLike(){
    const nLikeId = document.getElementById('idWine').value;
	const options = {
        'method': 'PUT',
        'body': { "like" : false},	
        'mode': 'cors',
        'headers': {
            'content-type': 'application/json; charset=utf-8',
            'Authorization': 'Basic '+btoa('alain:epfc')	
        }
    };
    
    const fetchURL = '/wines/'+wineId+'/nLikeId';
    
    fetch(apiURL + fetchURL, options).then(function(response) {
        if(response.ok) {
            response.json().then(function(data){
                console.log(data);
            });
        }
    });
}
 
