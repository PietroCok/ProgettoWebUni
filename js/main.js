// file principale

// giocatore attivo -> devo poterne avere accesso in tutti i file
let player;
// riferimento al piano corrente
// mi serve, in particolare, per attaccare i nemici
let piano;
// dimensioni tabella
let cell_size = 50;
let cell_spacing = 2;


// tiene traccia se c'è un partita attiva 
let game_active = false;

function pre_start() {
    // se c'è una partita in corso chiede all'utente di confermare 
    if(game_active){
        show_confirmation(null);
    }else{
        start_game();
    }
}

function start_game(){
    
    player = new Player("tmp");
    dim = document.querySelector(".input-dim").value;
    // creazione del campo di gioco
    piano = new Campo(dim, player);


    // dimensione dinamica del campo di gioco
    let general = document.querySelector(":root").style;
    
    
    general.setProperty('--tile-size', cell_size + 'px');
    general.setProperty('--tile-spacing', cell_spacing + 'px');
    let table_size = dim * cell_size + (dim-1) * cell_spacing;
    general.setProperty('--table-dynamic-width', table_size + 'px');
    
    // nasconde il campo di gioco (per sicurezza)
    hide_field();
    // console.log(document.querySelector(".campo-di-gioco"));
}

// gestisce le interazioni del giocatore
function interactions(cell, campo){
    // nemico 
    if(cell.classList.contains("enemy")){
        // scelta: attacco/mostra informazioni
        if(cell.classList.contains("open")){
            // trova il nemico selezionato
            let enemy = cell.classList;

            for(let i = 0; i < campo.enemies.length;i++){
                let e = campo.enemies[i];
                let id = "enemy_" + e.ID; 
                if(enemy.contains(id)){
                    campo.selected_enemy = i;
                    // console.log(campo.enemies[campo.selected_enemy]);
                }
            }

            campo.update_enemy_info();
            let near = false;
            if(cell.classList.contains("near")){
                near = true;
            }
            show_enemy_info(near);
        }
        
        return;
    }

    // movimento del giocatore
    if(cell.classList.contains("near")){
        // aggiunta classe di appoggio per trovare la cella target nella struttura di memorizzazione
        cell.classList.add("selected");
        //let target = document.querySelector(".selected");
        let target = campo.get_coords("selected");
        // muove il giocatore
        campo.move_player(target);
        return;
    }
}

function add_assign_points_events(){
    // NB: player ha il riferimento del giocatore

    // aggiunta eventi
    let remove_points = document.querySelectorAll(".creazione-giocatore .remove");
    for(let i = 0; i < remove_points.length;i++){
        remove_points[i].addEventListener('click', function(){
            player.remove_point(this.nextSibling);
        })
    }

    let add_points = document.querySelectorAll(".creazione-giocatore .add");
    for(let i = 0; i < add_points.length;i++){
        add_points[i].addEventListener('click', function(){
            player.add_point(this.previousSibling);
        })
    }

    let confirm = document.querySelector(".confirm");
    confirm.addEventListener('click',function(){
        player.proceed_tmp();
        game_active = true;
    })

    let back = document.querySelector(".back");
    back.addEventListener('click', function(){
        // nasconde il menù di assegnazione punti
        let pos = document.querySelector(".creazione-giocatore");
        pos.classList.add("hidden");

        // nasconde le statistiche del giocatore
        hide_player_stats();
    })
}

function hide_all_info(){
    document.querySelector(".settings").classList.add("hidden");
}

function display_settings(){
    document.querySelector(".settings").classList.remove("hidden");
    display_dim();
    display_difficulty();
}

function display_dim(){
    // funzione di utilità per visualizzare "live" la dimensione della griglia scelta
    document.querySelector(".input-visual").textContent = document.querySelector(".input-dim").value;
}

// nasconde tutta l'area di gioco
function hide_game(){
    hide_field();
    hide_player_stats();
}

// nasconde il campo di gioco
function hide_field(){
    document.querySelector(".campo-di-gioco").classList.add("hidden");
    document.querySelector(".floor").classList.add("hidden");
    document.querySelector(".info").classList.add("hidden");
}

// nascondel e statistiche del giocatore
function hide_player_stats(){
    document.querySelector(".player-stats").classList.add("hidden");
}

// mostra l'area di gioco
function show_game(){
    show_field();
    document.querySelector(".floor").classList.remove("hidden");
    document.querySelector(".info").classList.remove("hidden");

    show_player_stats();
}

// mostra il campo di gioco
function show_field(){
    document.querySelector(".campo-di-gioco").classList.remove("hidden");
}
// mostra le statistiche del giocatore
function show_player_stats(){
    document.querySelector(".player-stats").classList.remove("hidden");
}

// mostra le info del nemico selezionato
function show_enemy_info(near){
    document.querySelector(".enemy-info").classList.remove("hidden");

    // disable atk
    if(!near){
        document.querySelector(".enemy-info .buttons .attack").disabled = true;
    }else{
        document.querySelector(".enemy-info .buttons .attack").disabled = false;
    }
}

// nasconde le info del nemico selezionato
function hide_enemy_info(){
    document.querySelector(".enemy-info").classList.add("hidden");
}


// aggiorna le statistiche mostrate a schermo
function update_player_stats(){
    let actual_h = document.querySelector(".player-stats .actual-health");
    actual_h.textContent = player.health;

    let max_h = document.querySelector(".player-stats .max-health");
    max_h.textContent = player.max_health;

    // cambia colore alla salute in base al suo livello rispetto al massimo
    let health_perc = player.health / player.max_health;
    // console.log(health_perc);
    let color;
    if(health_perc > 0.6){
        color = 'lime';
    }else if(health_perc > 0.3){
        color = 'orange';
    }else{
        color = 'red';
    }
    
    let target = document.querySelector(":root").style
    // effettiva applicazione del nuovo colore
    target.setProperty('--health-color', color);
    // cambia la dimensione della barra della salute
    target.setProperty('--health-percent', health_perc*100 + '%');
    

    let d = document.querySelector(".armor span");
    d.textContent = player.def;

    let a = document.querySelector(".atk-power span")
    a.textContent = player.atk;
}

function display_difficulty(){
    // possibili difficoltà
    let possible_difficulties = ["Facile", "Media", "Difficile"];
    let diff = possible_difficulties[parseInt(document.querySelector(".input-diff").value)];
    document.querySelector(".game-difficulty .input-visual").textContent = diff;
}

function attack(){
    piano.player_attack();
}

function auto_attack() {
    piano.auto_attack();
}

// torna un numero random compreso tra min e max (compresi entrambi)
function random(min, max){
    max = max+1;
    return Math.floor(Math.random()*(max-min)+min);
}

// mostra/nasconde la finestra di conferma per lasciare la pagina durante una partita in corso
function show_confirmation(dest) {
    // mostra finestra di avviso
    document.querySelector(".confirm-leave").classList.remove("hidden");
    // aggiunge la destionazione corretta al tasto di conferma
    let b = document.querySelector(".confirm-leave .proceed");
    // console.log(b);
    b.onclick = () => {
        hide_confirmation();
        if(dest){
            window.location.href = dest;
        }else{
            // caso nuova partita -> non devo andare da nessun parte
            start_game();
        }
    }
}
function hide_confirmation() {
    document.querySelector(".confirm-leave").classList.add("hidden");
}


// gestiste lo spostamento nelle altre pagine controllando se c'è una partita in corso
// se così fosse avvisa l'utente che continuando perderà i progressi attuali
function destination(dest) {
    if(game_active){
        show_confirmation(dest);
    }else{
        window.location.href = dest;
    }
}


// aggiunge eventi menù asseganzione punti
add_assign_points_events();