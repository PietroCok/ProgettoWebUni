// classe giocatore
let base_health = 50;
let base_atk = 10;
let base_def = 0;
class Player{
    constructor(name){
        this.name = name;
        // salute massima
        this.max_health = base_health;
        // salute attuale
        this.health = this.max_health;
        // livello
        // determina il numero totale di punti assegnati ad un giocatore
        this.level = 5;
        // attacco
        this.atk = base_atk;
        // difesa
        // riduzione %  del danno, ancora da decidere
        this.def = base_def; 
        this.max_def = 10;   
        // punti disponibili
        this.points_left = 0;
        // moltiplicatori punti->valori delle statistiche
        this.base_mul = {
            health: 40,
            atk: 10,
            def: 5
        }
        // permette al giocatore di distribuire i punti alle varie statistiche
        this.assign_points();

        // mi serve poi per le statistiche del giocatore
        this.killed_enemies = 0;
    }
    

    get_assigned_points(){
        // calcolo dei punti assegnati ad ogni statistica
        let health_p = (this.max_health - base_health) / this.base_mul.health;
        let atk_p = (this.atk - base_atk) / this.base_mul.atk;
        let def_p = (this.def - base_def) / this.base_mul.def;

        let points = {
            health: health_p,
            atk: atk_p,
            def: def_p 
        }

        // console.log(points);
        // console.log(this.level);
        return points;
    }


    assign_points(n = 0){

        // permette al giocatore di distribuire un certo numero di punti tra le varie statistiche
        this.level += n;
        this.points_left = n;
        if(n == 0){
            this.points_left = this.level;
            // resetta i valori dei campi 
            this.reset_stats();
        }

        // recupero elemento "finestra" per l'assegnazione punti
        let pos = document.querySelector(".creazione-giocatore");

        // scopro il menu di assegnazione punti
        pos.classList.remove("hidden");

        // se punti > 0 non mi trovo nella scelta iniziale quindi nascondo il tasto back (che non serve a nulla)
        let back_button = document.querySelector(".creazione-giocatore .back");
        if(n == 0){
            back_button.classList.remove("hidden");
        }else{
            back_button.classList.add("hidden");
        }

        this.update_points_left(null);
    }

    remove_point(stat){
        let val = parseInt(stat.textContent);
        if(val <= 0 || this.points_left == player.level){
            return;
        }

        // trovo la statistica che sto modificando
        let real_stat = stat.parentNode.parentNode;

        if(real_stat.classList.contains("health")){
            player.max_health -= player.base_mul.health;
        }else if(real_stat.classList.contains("atk")){
            player.atk -= player.base_mul.atk;
        }else{
            player.def -= player.base_mul.def;
        }

        this.update_points_left('-');
        stat.textContent = val - 1;
    }

    add_point(stat){
        // recupero il valore a schermo (rende la modificaa schermo di tale valore più semplice)
        let val = parseInt(stat.textContent);
        if(val >= player.level || this.points_left == 0){
            return;
        }

        // trovo la statistica che sto modificando
        let real_stat = stat.parentNode.parentNode;

        if(real_stat.classList.contains("health")){
            player.max_health += player.base_mul.health;
        }else if(real_stat.classList.contains("atk")){
            player.atk += player.base_mul.atk;
        }else{
            player.def += player.base_mul.def;
        }
        

        // gestione caso in cui l'armatura sia maggiore di quella consentita
        if(real_stat.classList.contains("def")){
            if(player.def > player.max_def){
                player.def = player.max_def;
                alert("Hai raggiunto il valore massimo della statistica " + real_stat.classList);
                return;
            }

        }

        this.update_points_left('+');
        stat.textContent = val + 1;
    }
    update_points_left(direction){
        if(direction == '-'){
            this.points_left += 1;
        }else if(direction == '+'){
            this.points_left -= 1;
        }

        // aggiorno i punti rimanenti
        let target = document.querySelector(".points-left");
        target.textContent = this.points_left;
    }

    proceed_tmp(){
        if(this.points_left > 0){
            // punti ancora disponibili
            alert("Assegna tutti i punti disponibili prima di procedere!")
        }else{
            // prende i punti assegnati alle varie statistiche
            let assigned_points = this.get_assigned_points();
            // li trasforma e aggiunge al giocatore
            this.update_stat(assigned_points.health, assigned_points.atk, assigned_points.def);
            
            // azzero i valori
            this.reset_stats();

            // recupero elemento "finestra" per l'assegnazione punti
            let pos = document.querySelector(".creazione-giocatore");
            // nasconde il menù di assegnazione punti
            pos.classList.add("hidden");


            // console.log(player);


            // rimostro il campo di gioco
            show_game();
        }
    } 

    reset_stats(){
        // modifica i valori della finestra di assegnazione punti con i valori posseduti dal giocatore
        document.querySelector(".health .value").textContent = 0;
        document.querySelector(".atk .value").textContent = 0;
        document.querySelector(".def .value").textContent = 0;
    }

    update_stat(health_points = 0, atk_points = 0, def_points = 0){
        // aggiorno le statistiche del giocatore sulla base dei punti assegnati
        this.max_health = base_health + this.base_mul.health * health_points;
        this.health = this.max_health;
        this.atk = base_atk + this.base_mul.atk * atk_points;
        this.def = base_def + this.base_mul.def * def_points;

        update_player_stats();
    }
}