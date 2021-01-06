
	let persoUser; // nom du héros rentré par l'utilisateur
	//var powers;
	var ListPowers=[];
	var listePowersTeam1=[];
	var listePowersTeam2=[];
	var nbentries;
	let winner;
	let nbHeroes = 0;
	console.log("api.js linked ");
	const proxyurl = "https://cors-anywhere.herokuapp.com/";
	const url = "https://superheroapi.com/api/";
	var start = document.querySelector('.boutonStart button');
	start.disabled=false;

	// Ajouter un superhéro dans l'input
	function GetInput($this) {
		console.log("in getinput !");
		  var txt;
		  // récupére la valeur de l'input
		  persoUser = $this.previousElementSibling.value;
		  /* récupére le nom des classes du container parent le plus proche de classe "team" de l'input */
		  var team = $this.closest(".team").className; 
		  console.log(team);
		  if (persoUser == null || persoUser == "") {
		    txt = alert("no input");
		  } else {
		    //txt = alert("Your search is about " + persoUser);
		  }
		  //lancement de la recherche dans l'API
		  const responseAPI = userAction(persoUser, team);
	}

	// Vider l'input du menu
	function EmptyInput(team){
		if(team == "team team1 close" || team == "team team1"){
			document.querySelector(".team1 input").value = "";
		}
		else{
			document.querySelector(".team2 input").value = "";
		}
	}

	function DeleteHero($this){
		$this.previousElementSibling.remove();
		$this.remove();
	}

	// Appel de l'API
	async function userAction(query, team) {
		const token = '882791785790879';
		let obj;
		let search = "/search/";
		let options =  search + query;
		
	    const response = await fetch(url + token + options)
	  	const myJson = await response.json()
	  						.then((response) => {
  													obj = response.results;
													Isinteger = false;
													console.log('success!', response);
													if(response.response == "error"){
														alert("Nom de superhéros inconnu, essayez un autre nom.");
														EmptyInput(team);
													}
													else{
														showPersos(obj, team);
													}
					 							})
							.catch((e) => {
					 								console.log('some error happened', e);
					 						});
	}


	PowersSomme = (perso) => {
		var powers = perso.powerstats;
		var sommePowers = 0;
		for(var value in powers)
		{
			var conversion = parseInt(powers[value]);
			sommePowers = sommePowers + conversion;
		}
		console.log("somme des pouvoirs : " + sommePowers);

		perso.sommePowers = sommePowers;
		return perso;
	}

	// Détermine la team gagnante selon la somme des pouvoirs de chaque héros de la team
	PowersFight = (listTeam1, listTeam2) => {
		var winner;
		var total1 = 0;
		var total2 = 0;
		for(var i=0;i<listTeam1.length;i++){
			total1 = total1 + listTeam1[i].sommePowers;
			console.log(listTeam1[i].sommePowers);
		}
		for(var i=0;i<listTeam2.length;i++){
			total2 = total2 + listTeam2[i].sommePowers;
			console.log(listTeam2[i].sommePowers);
		}
		if(total1 > total2){
			winner = listTeam1;
		}
		else{
			winner = listTeam2;
		}
		return winner;
	}

	showPersos = (persos, team) => {
		let charactersContainer; 
		let numeroTeam;
		ListPowers=[];
		// détermine de quelle équipe vient l'ajout du héros
		if(team == "team team1 close" || team=="team team1"){
			console.log("team1");
			 charactersContainer= document.querySelector('.team1 .heroes_name');
			 numeroTeam = "team1";
			 ListPowers = listePowersTeam1;
		}
	    else{
	    	console.log("team2");
	    	charactersContainer = document.querySelector('.team2 .heroes_name');
	    	numeroTeam = "team2";
	    	ListPowers = listePowersTeam2;
	    }
	    
	  	
	  	/* L'API renvoie un tableau de un ou plusieurs héros selon la recherche */
  		persos.forEach(perso => {
  			/*si le nom du superhero rentré par l'utilisateur est strictement identique à un des noms du tableau de résultat alors affiche-le */
  			if(perso.name.toLowerCase() == persoUser.toLowerCase()){
  				
  				/* div dans le menu qui contiendra le nom du héro (h4) et un bouton supprimer (button)*/ 
			    const characterDiv = document.createElement('div');
			    const characterh4 = document.createElement('h4');
			    /* création du classe générale "name" et d'une seconde numérotée selon le nombre de héros ajoutés */
			    characterh4.className = "name name"+ nbHeroes;
			    const characterbutton = document.createElement('button');
			    characterbutton.innerHTML = '+';
			    characterbutton.className = "button"+nbHeroes;
			    // supprime un superhéros de la liste lors du click sur la petite croix dans le menu 
			    characterbutton.onclick = function(){
			    	
					var index = this.className.slice(-1);
					console.log("image"+index);
					document.querySelector(".image"+index).remove();
					var team = this.closest(".team").className;
					if(team.includes("team1")){
						for(perso in listePowersTeam1){
							if(listePowersTeam1[perso].name == this.previousElementSibling.innerHTML){
								
								var deleteElement= listePowersTeam1.splice(perso, 1);
								console.log(listePowersTeam1);
							}else{ console.log(listePowersTeam1[perso].name + " " + this.previousElementSibling.innerHTML)}
						}
					}
					else if(team.includes("team2")){
						for(perso in listePowersTeam2){
							if(listePowersTeam2[perso].name == this.previousElementSibling.innerHTML){
								var deleteElement= listePowersTeam2.splice(perso, 1);
								console.log(listePowersTeam2);
							}else{ console.log(listePowersTeam2[perso].name + " " + this.previousElementSibling.innerHTML)}
						}
					}
					this.previousElementSibling.remove();
					this.remove();
			    };

			    charactersContainer.append(characterDiv);
			    characterDiv.append(characterh4);
			    characterDiv.append(characterbutton);

  				persoUser = "";
  				EmptyInput(team);
  				perso.team = numeroTeam;
  				// on insère dans le menu le nom du héros sélectionné
  				document.querySelector('.'+numeroTeam+' .name'+ nbHeroes).innerHTML = perso.name;
  				
  				// on ajoute l'image du héros dans le champs de combat
  				const characterBattleField = document.querySelector('#combat_'+numeroTeam + ' .images');
			    const characterImage = document.createElement('img');
			    characterImage.className = "heroesImg";
			    characterImage.setAttribute('src', perso.image.url);
				characterImage.setAttribute('alt', 'image du héros '+perso.name);
				characterImage.className = "heroesImg image"+nbHeroes;
			    characterBattleField.append(characterImage);
			    //on ajoute dans le tableau des pouvoirs de l'équipe la somme des pouvoirs de chaque héros
			    nbentries = ListPowers.push(PowersSomme(perso));
			    // ajout d'une limite de superhéros dans une équipe
			    if(ListPowers.length >= 3)
			    {
			    	document.querySelector('.'+numeroTeam + ' input').disabled=true;
			    	document.querySelector('.'+numeroTeam + ' input').value="Limite de héros atteinte";
			    	document.querySelector('.'+numeroTeam + ' .formButton').disabled=true;
			    }
			    nbHeroes = nbHeroes + 1;
			}else{
				console.log("nom pas strictement égal : " + perso.name);
			}
	  	});
	
  	}
		
	// Appui sur le bouton "LANCER LE MATCH"
	start.addEventListener('click', function(){
		
		if(!listePowersTeam2[0] || !listePowersTeam1[0]){
			alert("Vous n'avez pas sélectionné de héros pour une des/les team(s)");
		}
	    else{
		console.log(listePowersTeam1);
		console.log(listePowersTeam2);
		winner = PowersFight(listePowersTeam1, listePowersTeam2);
		for(var i=0;i<winner.length;i++){
			console.log(winner[i].name);
		}
		// sélection des barres de vie de chaque team
		var lifebarG = document.querySelector('.lifebar.child.gauche');
		var lifebarD = document.querySelector('.lifebar.child.droit');
		var battlefield = document.querySelector('.combat');

		// mise en place de l'animation des barres de vie selon la team gagnante
		if(winner[0].team == "team2"){
		    lifebarD.style.transition = 'transform ' + 7 +'s linear';
		    lifebarD.style.transform = 'scaleX(0)';
		    lifebarG.style.transition = 'transform ' + 5 +'s linear';
		    lifebarG.style.transform = 'scaleX(0)';
		    /* lorsque l'animation de la barre de la team perdante se termine
		    alors celle de la team gagnante s'arrête là où elle est */
		    lifebarG.addEventListener('transitionend', function(e) {
		    	console.log("stop lifebarD");
			  	lifebarD.style.transform = 'scaleX('+ 2/7 +')';
			  	// affichage de la team victorieuse : création d'une balise img + transition
			  	const WinnerImage = document.createElement('img');
			    WinnerImage.className = "winnerImg";
			    WinnerImage.setAttribute('src', './image/Team2Win.png');// IMAGE À CHANGER !!!! 
				WinnerImage.setAttribute('alt', winner[0].team+' gagnante');
				battlefield.append(WinnerImage);
				// lancement de la function avec un délai de 200ms
			  	setTimeout(function(){
					WinnerImage.style.transform = 'scale(0.8)';
					start.disabled=true;
				}, 200);
			});
		}
		else{
			lifebarG.style.transition = 'transform ' + 7 +'s linear';
		    lifebarG.style.transform = 'scaleX(0)';
		    lifebarD.style.transition = 'transform ' + 5 +'s linear';
		    lifebarD.style.transform = 'scaleX(0)';
		    lifebarD.addEventListener('transitionend', function(e) {
		    	console.log("stop lifebarG");
			  	lifebarG.style.transform = 'scaleX('+ 2/7 +')';
			  	// affichage de la team victorieuse : création d'une balise img + transition
			  	const WinnerImage = document.createElement('img');
			    WinnerImage.className = "winnerImg";
			    WinnerImage.setAttribute('src', './image/Team1Win.png'); // IMAGE À CHANGER !!!!
				WinnerImage.setAttribute('alt', winner[0].team+' gagnante');
				battlefield.append(WinnerImage);
				// lancement de la function avec un délai de 200ms
			  	setTimeout(function(){
					WinnerImage.style.transform = 'scale(0.8)';
					start.disabled=true;
					start.style.animation = 'none';
					document.querySelector('.btnReset').style.animation = '1s linear 2s infinite bouing';
				}, 200);
			});
		}}
	},false); 

	function UnfoldMenu(){
		console.log("menuu");
		document.querySelector('.arrow_indication').classList.add('close');
		document.querySelector('.menu').classList.toggle('down');
		setTimeout(function(){
			document.querySelector('.team1').classList.toggle('close');
			document.querySelector('.team2').classList.toggle('close');
			document.querySelector('.boutonStart').classList.toggle('close');
			document.querySelector('.menu').classList.toggle('resize');
		}, 400);

	}

	//Appui sur le bouton Reset du jeu pour actualiser la page 
	document.querySelector(".btnReset").addEventListener('click', function(){
		window.location.reload();
	})


	//-------------------------------------

function autocomplete(inp, arr, submit, length) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("div");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");

      var siblingElement = document.querySelector('#'+submit);
      /*append the DIV element as a child of the autocomplete container:*/
      //this.parentNode.appendChild(a);
      this.parentNode.insertBefore(a, siblingElement);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
      	if(val.length >= length){
	        /*check if the item starts with the same letters as the text field value:*/
	        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
	          /*create a DIV element for each matching element:*/
	          b = document.createElement("DIV");
	          /*make the matching letters bold:*/
	          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
	          b.innerHTML += arr[i].substr(val.length);
	          /*insert a input field that will hold the current array item's value:*/
	          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
	          /*execute a function when someone clicks on the item value (DIV element):*/
	          b.addEventListener("click", function(e) {
	              /*insert the value for the autocomplete text field:*/
	              inp.value = this.getElementsByTagName("input")[0].value;
	              /*close the list of autocompleted values,
	              (or any other open lists of autocompleted values:*/
	              closeAllLists();
	          });
	          a.appendChild(b);
	        }
	    }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
}

/*An array containing all the country names in the world:*/
	var superheroes = ["A-Bomb", "Abe Sapien", "Abin Sur", "Abomination", "Abraxas", "Absorbing Man", "Adam Monroe", "Adam Strange", "Agent Bob", "Agent Zero", "Air-Walker", "Ajax", "Alan Scott", "Alex Mercer", "Alfred Pennyworth", "Alien", "Amazo", "Angel", "Angel", "Angel Dust", "Angel Salvadore", "Animal Man", "Annihilus", "Ant-Man", "Ant-Man II", "Anti-Monitor", "Anti-Venom", "Apocalypse", "Aquababy", "Aqualad", "Aquaman", "Arachne", "Archangel", "Arclight", "Ardina", "Ares", "Ariel", "Armor", "Atlas", "Atlas", "Atom Girl", "Atom II", "Aurora", "Azazel", "Azrael", "Bane", "Banshee", "Bantam", "Batgirl", "Batgirl IV", "Batgirl VI", "Batman", "Batman", "Batman II", "Battlestar", "Batwoman V", "Beast", "Beast Boy", "Ben 10", "Beta Ray Bill", "Beyonder", "Big Barda", "Big Daddy", "Big Man", "Bill Harken", "Bionic Woman", "Bird-Brain", "Bishop", "Bizarro", "Black Adam", "Black Bolt", "Black Canary", "Black Canary", "Black Cat", "Black Flash", "Black Knight III", "Black Lightning", "Black Mamba", "Black Manta", "Black Panther", "Black Widow", "Blackout", "Blackwing", "Blackwulf", "Blade", "Bling!", "Blink", "Blizzard II", "Blob", "Bloodaxe", "Bloodhawk", "Blue Beetle III", "Boba Fett", "Boom-Boom", "Box IV", "Brainiac", "Brainiac 5", "Brundlefly", "Buffy", "Bullseye", "Bumblebee", "Bushido", "Cable", "Callisto", "Cameron Hicks", "Cannonball", "Captain America", "Captain Atom", "Captain Britain", "Captain Cold", "Captain Hindsight", "Captain Marvel", "Captain Marvel", "Captain Marvel II", "Captain Planet", "Carnage", "Catwoman", "Century", "Chamber", "Chameleon", "Changeling", "Cheetah", "Cheetah III", "Chuck Norris", "Citizen Steel", "Claire Bennet", "Cloak", "Clock King", "Colossus", "Copycat", "Cottonmouth", "Crystal", "Cyborg", "Cyborg Superman", "Cyclops", "Dagger", "Daphne Powell", "Daredevil", "Darkhawk", "Darkman", "Darkseid", "Darkstar", "Darth Maul", "Darth Vader", "Dash", "Data", "Dazzler", "Deadman", "Deadpool", "Deadshot", "Deathlok", "Deathstroke", "Demogoblin", "Destroyer", "Diamondback", "DL Hawkins", "Doc Samson", "Doctor Doom", "Doctor Fate", "Doctor Octopus", "Doctor Strange", "Domino", "Donatello", "Doomsday", "Doppelganger", "Dormammu", "Dr Manhattan", "Drax the Destroyer", "Ego", "Elastigirl", "Electro", "Elektra", "Elle Bishop", "Elongated Man", "Emma Frost", "Enchantress", "Ethan Hunt", "Etrigan", "Evil Deadpool", "Evilhawk", "Exodus", "Falcon", "Fallen One II", "Faora", "Feral", "Fin Fang Foom", "Firebird", "Firelord", "Firestar", "Firestorm", "Firestorm", "Flash", "Flash II", "Flash III", "Flash IV", "Forge", "Franklin Richards", "Franklin Storm", "Frenzy", "Galactus", "Gambit", "Gamora", "Gary Bell", "General Zod", "Ghost Rider", "Giganta", "Gladiator", "Goblin Queen", "Godzilla", "Gog", "Goku", "Gorilla Grodd", "Gravity", "Greedo", "Green Arrow", "Green Goblin", "Green Goblin II", "Groot", "Guy Gardner", "Hal Jordan", "Han Solo", "Hancock", "Harley Quinn", "Harry Potter", "Havok", "Hawk", "Hawkeye", "Hawkeye II", "Hawkgirl", "Heat Wave", "Hela", "Hellboy", "Hellcat", "Hercules", "Hit-Girl", "Hope Summers", "Hulk", "Human Torch", "Huntress", "Husk", "Hybrid", "Hydro-Man", "Hyperion", "Iceman", "Impulse", "Indiana Jones", "Indigo", "Ink", "Invisible Woman", "Iron Fist", "Iron Man", "Iron Monger", "Isis", "Jack of Hearts", "Jack-Jack", "James Bond", "James T. Kirk", "Jar Jar Binks", "Jason Bourne", "Jean Grey", "Jean-Luc Picard", "Jennifer Kale", "Jessica Cruz", "Jessica Jones", "Jim Powell", "JJ Powell", "John Constantine", "John Wraith", "Joker", "Jolt", "Jubilee", "Judge Dredd", "Juggernaut", "Junkpile", "Justice", "Kang", "Kathryn Janeway", "Katniss Everdeen", "Kevin 11", "Kick-Ass", "Kid Flash", "Killer Croc", "Killer Frost", "Kilowog", "King Kong", "King Shark", "Kingpin", "Klaw", "Kool-Aid Man", "Kraven II", "Kraven the Hunter", "Krypto", "Kyle Rayner", "Kylo Ren", "Lady Deathstrike", "Leader", "Leech", "Legion", "Leonardo", "Lex Luthor", "Light Lass", "Lightning Lad", "Lightning Lord", "Living Brain", "Living Tribunal", "Lizard", "Lobo", "Loki", "Longshot", "Luke Cage", "Luke Skywalker", "Luna", "Mach-IV", "Machine Man", "Magneto", "Magog", "Magus", "Man of Miracles", "Man-Bat", "Man-Thing", "Man-Wolf", "Mandarin", "Mantis", "Martian Manhunter", "Marvel Girl", "Master Chief", "Match", "Matt Parkman", "Maverick", "Maxima", "Maya Herrera", "Medusa", "Meltdown", "Mephisto", "Mera", "Metallo", "Metron", "Micah Sanders", "Michelangelo", "Micro Lad", "Mimic", "Misfit", "Miss Martian", "Mister Fantastic", "Mister Freeze", "Mister Knife", "Mister Mxyzptlk", "Mister Sinister", "Mister Zsasz", "Mockingbird", "MODOK", "Molten Man", "Monica Dawson", "Moon Knight", "Moonstone", "Morlun", "Moses Magnum", "Mr Immortal", "Mr Incredible", "Ms Marvel II", "Multiple Man", "Mysterio", "Mystique", "Namor", "Namora", "Namorita", "Naruto Uzumaki", "Nebula", "Negasonic Teenage Warhead", "Nick Fury", "Nightcrawler", "Nightwing", "Niki Sanders", "Nina Theroux", "Northstar", "Nova", "Nova", "Odin", "Offspring", "One Punch Man", "One-Above-All", "Onslaught", "Oracle", "Osiris", "Ozymandias", "Parademon", "Paul Blart", "Penguin", "Phantom Girl", "Phoenix", "Plantman", "Plastic Man", "Plastique", "Poison Ivy", "Polaris", "Power Girl", "Predator", "Professor X", "Professor Zoom", "Psylocke", "Punisher", "Purple Man", "Pyro", "Q", "Question", "Quicksilver", "Quill", "Ra's Al Ghul", "Rachel Pirzad", "Rambo", "Raphael", "Raven", "Ray", "Red Arrow", "Red Hood", "Red Hulk", "Red Mist", "Red Robin", "Red Skull", "Red Tornado", "Rey", "Rhino", "Rick Flag", "Riddler", "Rip Hunter", "Robin", "Robin II", "Robin III", "Robin V", "Robin VI", "Rocket Raccoon", "Rogue", "Ronin", "Rorschach", "Sabretooth", "Sage", "Sandman", "Sasquatch", "Sauron", "Savage Dragon", "Scarecrow", "Scarlet Spider", "Scarlet Spider II", "Scarlet Witch", "Scorpia", "Scorpion", "Sebastian Shaw", "Sentry", "Shadow King", "Shadow Lass", "Shadowcat", "Shang-Chi", "Shatterstar", "She-Hulk", "She-Thing", "Shocker", "Shriek", "Sif", "Silk", "Silver Surfer", "Silverclaw", "Simon Baz", "Sinestro", "Siren", "Siryn", "Skaar", "Snowbird", "Sobek", "Solomon Grundy", "Songbird", "Space Ghost", "Spawn", "Spectre", "Speedy", "Spider-Girl", "Spider-Gwen", "Spider-Man", "Spider-Woman", "Spider-Woman III", "Spock", "Spyke", "Star-Lord", "Stardust", "Starfire", "Stargirl", "Static", "Steel", "Stephanie Powell", "Steppenwolf", "Storm", "Stormtrooper", "Sunspot", "Superboy", "Superboy-Prime", "Supergirl", "Superman", "Swamp Thing", "Swarm", "Sylar", "Synch", "T-1000", "T-800", "T-850", "T-X", "Taskmaster", "Tempest", "Thanos", "The Cape", "The Comedian", "Thing", "Thor", "Thor Girl", "Thunderbird", "Thunderstrike", "Thundra", "Tiger Shark", "Tigra", "Tinkerer", "Toad", "Toxin", "Toxin", "Triplicate Girl", "Triton", "Two-Face", "Ultragirl", "Ultron", "Utgard-Loki", "Vanisher", "Vegeta", "Venom", "Venom II", "Venom III", "Venompool", "Vibe", "Vindicator", "Violet Parr", "Vision", "Vixen", "Vulture", "Walrus", "War Machine", "Warlock", "Warp", "Warpath", "Wasp", "Watcher", "White Canary", "Wildfire", "Winter Soldier", "Wolfsbane", "Wolverine", "Wonder Girl", "Wonder Man", "Wonder Woman", "Wyatt Wingfoot", "X-23", "X-Man", "Yellowjacket", "Yellowjacket II", "Ymir", "Yoda", "Zatanna", "Zoom"]

/*initiate the autocomplete function on the "myInput" element, and pass along the superheroes array as possible autocomplete values:*/
autocomplete(document.getElementById("input1"), superheroes, "submit1", 3);
autocomplete(document.getElementById("input2"), superheroes, "submit2", 1);

document.getElementById("input2").addEventListener('click', function(){
	console.log("hello");
})



