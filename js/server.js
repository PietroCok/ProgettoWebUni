// mostra/nasconde le opzioni di gestione dell'account
function show_account_manager(){
    document.querySelector(".account-manager-container").classList.remove("hidden");
}
function hide_account_manager(){
    document.querySelector(".account-manager-container").classList.add("hidden");
}

// mostra la finestra di conferma cancellazione account
function show_delete_confirmation(){
    document.querySelector(".delete-confirmation").classList.remove("hidden");
    hide_account_manager();
}
function hide_delete_confirmation(){
    document.querySelector(".delete-confirmation").classList.add("hidden");
    show_account_manager();
}

// controllo input nei form di login e registrazione
function check_password(type){
    let target = type + " input[type='password']"
    let pass = document.querySelector(target);
    // console.log(pass);

    // valori di valutazione efficacia della password
    const numbers = /[0-9]/;
    const uppercaseletter = /[A-Z]/;
    const character = /[a-z]/;
    const numberofcharacter = 8;

    let tip = document.querySelector(".pass-tips");
    // tip.parentNode.classList.remove("hidden");


    let tip_visible = document.querySelector(".tip");
    pass.onfocusout = () => {
        if(pass.value == ""){
            // nasconde i suggerimenti quando l'utente toglie il focus dal campo password e tale campo è vuoto
            tip_visible.classList.add("hidden");
        }
    }

    // ogni volta che l'utente preme un tasto controllo lo stato della password
    pass.onkeyup = () =>{
        let p = pass.value;
        let eff = 0;

        if(p != ""){
            tip_visible.classList.remove("hidden");
        }

        if(!p.match(character)){
            // password non contiene caratteri "normali"
            // console.log("Password senza caratteri normali!");
            tip.textContent = "inserisci un carattere";
        }else{
            eff++;    
        }

        if(!p.match(uppercaseletter)){
            // password non contiene caratteri maiuscoli
            // console.log("Password senza lettere maiuscole!");
            tip.textContent = "inserisci una lettera maiuscola";
        }else{
            eff++;  
        }

        if(!p.match(numbers)){
            // password non contiene numeri
            // console.log("Password senza caratteri!");
            tip.textContent = "inserisci un numero";
        }else{
            eff++;
        }

        if(p.length < numberofcharacter){
            // password corta
            // console.log("Passwrod corta!");
            tip.textContent = "inserisci almeno 8 caratteri";
        }else{
            eff++;
        }



        let size = 0;
        let color = "red";
        switch(eff){
            case 1:
                size = 40;
                break;
            case 2:
                size = 80;
                color = "orange";
                break;
            case 3:
                size = 120
                color = "yellow";
                break;
            case 4:
                size = 170;
                color = "lime";
                tip.parentNode.classList.add("hidden");
                break;
        }
        size += 'px';

        // console.log(size);
        let eff_bar = document.querySelector(".pass-eff").style;
        eff_bar.width = size;
        eff_bar.backgroundColor = color;
    }
}













