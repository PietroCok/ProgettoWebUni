// classe che gestisce il campo di gioco
class Campo{
    constructor(dimensione, player){
        // posizione del giocatore
        this.player_x = 0;
        this.player_y = 0;

        // lunghezza del lato dell'esagono
        this.side = dimensione;
        // matrice di elementi di tipo cella
        this.matrix = [];
        
        // Livello del piano
        // aumenta di 1 ogni volta che il giocatore trova l'uscita
        // ogni 10 piani aumenta la dimensione del piano di 1 se non già al massimo
        this.level = 0;

        // posizione uscita
        this.exit_x;
        this.exit_y;

        this.difficulty;

        // nemici
        this.enemies = [];
        // nemico selezionato (indice del'array precendente)
        this.selected_enemy;

        // crea la struttura di cui sopra
        // this.create_grid();
        this.field_set_up();

    }
    field_set_up(){
        this.create_grid();
        let c = this;

        // attivazione click event
        for(let i = 0; i < c.matrix.length;i++){
            for(let j = 0; j < c.matrix[i].length;j++){
                let cell = c.matrix[i][j].ref;

                // movimento + attacco del giocatore
                cell.addEventListener("click",function () {
                    interactions(this, c);
                })

            }
        }

        // se lo schermo lo necessita, centra il campo di gioco
        let body = document.querySelector("body");
        body = getComputedStyle(body);

        if(parseInt(body.width) < 600){
            // schermo troppo poco largo
            let field = document.querySelector(".campo-di-gioco");
            field.style.left = '50%';
            field.style.top = '50%';
        }else if(parseInt(body.height) < 800){
            // schermo troppo poco alto
            let field = document.querySelector(".campo-di-gioco");
            field.style.left = '70%';
            field.style.top = '80%';
        }
    }

    create_grid(){
        // resetta la vecchia griglia
        this.delete_grid();

        // sceglie randomicamente l'uscita
        do{
            this.exit_x = random(0,this.side-1),
            this.exit_y =  random(0,this.side-1)
            // impoedisce che l'uscita sia posizionata all'ingresso
        }while((this.exit_x+this.exit_y) == 0);
        
        
        // seleziono la posizione in cui aggiungere il numero del piano
        let target = document.querySelector(".campo-container");

        // aggiorno l'indicatore del piano
        let floor_n = document.querySelector(".floor");
        floor_n.textContent = "Piano: " + this.level;

        // posizione del campo di gioco
        target = document.querySelector(".campo-di-gioco");


        // numero di nemici
        this.difficulty = document.querySelector(".game-difficulty input").value;
        // console.log("Difficoltà selezionata: " + this.difficulty);
        let number_of_enemies = Math.floor(this.side / 2) + 1;
        if(this.difficulty == 1){
            number_of_enemies = Math.floor(number_of_enemies*1.5);
        }else if(this.difficulty == 2){
            number_of_enemies = Math.floor(number_of_enemies*2);
        }
        // creazione dei nemici
        this.create_enemies(number_of_enemies);
        // console.log("Numero di nemici creati: " + number_of_enemies);
        // console.log("Informazioni sui nemici:")
        // console.log(this.enemies);

        
        // creazione degli elementi del campo di gioco
        for(let i = 0; i < this.side;i++){
            this.matrix.push(new Array());
            let col = document.createElement("tr");
            target.appendChild(col);
            for(let j = 0; j < this.side;j++){
                let elem = document.createElement("td");
                let c = new Cell(i, j, elem);
                this.matrix[i].push(c);
                c.ref.classList.add("tile");
                col.appendChild(elem);

                if(i == 0 && j == 0){
                    // entrata
                    // aggiungo l'immagine
                    this.add_img(c.ref, "images/stairs/up/stair_up_left.png", "enter");
                }

                if(i == this.exit_x && j == this.exit_y){
                    //uscita
                    // aggiungo l'immagine
                    this.add_img(c.ref, "images/stairs/down/stair_down_right.png", "exit");
                    //console.log("Posizione dell'uscita: " + i + ', ' + j);
                }

                // posizionamento dei nemici
                for(let e = 0; e < this.enemies.length;e++){
                    if(this.enemies[e].x == i && this.enemies[e].y == j){
                        // NB: gli assi sono invertiti
                        //console.log("posizione nemico: " + j + ', ' + i);
                        c.ref.classList.add("enemy");
                        // aggiungo come classe anche l'id del nemico
                        let en_id = "enemy_" + this.enemies[e].ID;
                        c.ref.classList.add(en_id);

                        // aggiungo l'immagine del nemico
                        this.add_img(c.ref, "images/units/enemy.png", null, "sprite");

                        // barra della salute
                        let bar_bg = document.createElement("div")
                        c.ref.appendChild(bar_bg);
                        bar_bg.classList.add("enemy-health-bar-bg");
                        let bar = document.createElement("div");
                        bar_bg.appendChild(bar);
                        bar.classList.add("enemy-health-bar");

                    }
                }
                
                // copro le celle
                if(!(i == 0 && j == 0)){
                    c.ref.appendChild(document.createElement("div"));
                    c.ref.lastChild.classList.add("clouds");
                }
            }
        }

        // posizionamento iniziale del giocatore
        this.player_x = 0;
        this.player_y = 0;
        this.move_player(this.get_cell(0, 0));
    }

    //cancella la griglia (campo di gioco)
    delete_grid(){
        // lasci la tabella ma cancello tutti i suoi elementi
        let target = document.querySelector(".campo-di-gioco");
        while(target.firstChild){
            target.firstChild.remove();
        }

        // svuotamento rozzo della matrice
        this.matrix = [];
    }

    add(cell){
        // aggiunge una cella agli indici cell.x, cell.y
        this.matrix[cell.x].set(cell.y, cell.ref)
    }

    // c1: classe dell'elemento padre
    // c2: classe elemento immagine aggiunto
    add_img(cell, source, c1 = null, c2 = null){
        let tmp = document.createElement("img")
        cell.appendChild(tmp);
        if(c1)
            cell.classList.add(c1);
        if(c2)
            tmp.classList.add(c2);
        let i = cell.lastChild;
        i.setAttribute("src", source);
    }

    get_cell(x, y){
        // check inputs
        if(x < 0 || y < 0 || x >= this.side || y >= this.side){
            return null;
        }
        return this.matrix[x][y];
    }

    get_coords(cl){
        // scorro la matrice e ritorno l'elemento della matrice con la classe in input (cl)
        for(let i = 0; i < this.matrix.length;i++){
            for(let j = 0; j < this.matrix[i].length;j++){
                let c = this.matrix[i][j];
                if(c.ref.classList.contains(cl)){
                    return c;
                }
            }
        }
        return null;
    }

    move_player(cell){
        // cell deve essere un oggetto di tipo cell
        // console.log(cell);

        // mi serve la vecchia posizione nel caso debba trovare la direzione del movimento
        let old_x = this.player_x;
        let old_y = this.player_y;
        
        // ottengola vecchia posizione del giocatore
        let old_pos = this.matrix[this.player_x][this.player_y];
        // e allo stesso tempo rimuovo anche la classe near dalle celle vicine a tale posizione
        this.near(false);
        // rimozione giocatore
        old_pos.ref.classList.remove("player");
        // rimozione immagine
        if(old_pos.ref.lastChild.nodeName == 'IMG'){
            old_pos.ref.lastChild.remove();
        }
        
        // se la cella selezionata è quella dell'uscita
        if(cell.ref.classList.contains("exit")){
            this.next_floor();
            return;
        }

        // riaggiunta del giocatore nella nuova posizione
        cell.ref.classList.add("player");
        // riaggiunta immagine
        this.add_img(cell.ref, "images/units/player.png");
        
        // rimozione selezione cella
        cell.ref.classList.remove("selected");

        // aggiorno la sua posizione
        this.player_x = cell.x;
        this.player_y = cell.y;


        // caso campo di gioco più grande dello schermo disponibile
        let body = document.querySelector("body");
        body = getComputedStyle(body);
        // console.log(body.width, body.height);
        if(parseInt(body.width) < 600 || parseInt(body.height) < 800){
            // trovo la direzione del movimento (assi sono invertiti)
            let y_dir = this.player_x - old_x;
            let x_dir = this.player_y - old_y;
            // console.log(x_dir, y_dir);

            if(y_dir != 0 || x_dir != 0){
                let field = document.querySelector(".campo-di-gioco");
                let field_comp = getComputedStyle(field);
                // console.log(field_comp.left);
                field.style.left = parseInt(field_comp.left) - x_dir*(cell_size+cell_spacing/2) + 'px';
                field.style.top = parseInt(field_comp.top) - y_dir*(cell_size+cell_spacing/2) + 'px';
                // console.log(field.style.left);  
            }
        }
        

    
        //scopro le celle circostanti
        this.near(true);

        //attacco dei nemici che possono attaccare
        this.enemy_attack();

        // aggiornamento variabile 'seen'
        this.update_enemy_state();
    }

    next_floor(){
        // aumento il livello del piano
        this.level++;

        // ricreo un nuovo piano
        this.field_set_up();

        
        // do al giocatore 1 punto da assegnare alle statistiche
        player.assign_points(player.points_left+1);

        
    }

    // aggiunge la classe near alle solo celle intorno al giocatore ( e rimuove dalle altre)
    near(add){
        // coordinate relative delle celle vicine
        let n = [
            [-1, -1],
            [-1, 0],
            [-1, 1],

            [0, -1],
            [0, 1],

            [1, -1],
            [1, 0],
            [1, 1]
        ]

        // scorro le celle intorno al giocatore
        for(let i = 0; i < n.length;i++){
            let cell = this.get_cell(this.player_x + n[i][0], this.player_y + n[i][1]);
            
            // faccio cose solo se la cella esiste
            if(cell){
                // se add == true aggiungo
                if(add){
           
                    // aggiungo la classe near e open
                    // near indica le celle vicine al giocatore
                    // open indica le celle scoperte
                    cell.ref.classList.add("near", "open");
                
                }else{
                    // altimenti tolgo
                    cell.ref.classList.remove("near");
                    // lascio la classe .open perchè non voglio ricoprire le celle già visitate
                }
            }
        }    
    }

    create_enemies(n){
        // svuota l'array di nemici e lo ripopola
        this.enemies = [];
        for(let i = 0; i < n;i++){
            // creo una nuova posizione
            let x, y;
            do{
                x = random(0, this.side-1);
                y = random(0, this.side-1);
                // console.log("Trying on position: " + x + ", " + y);
            // ricreo nuove coordinate finchè non trovo una posizione valida
            }while(!this.check_enemy_pos(x, y));

            // livello dei nemici in base alla difficoltà
            let level = this.level;
            if(this.difficulty == 1){
                level = this.level*2;
            }else if(this.difficulty == 2){
                level = this.level*3;
            }

            this.enemies.push(new Enemy(x, y, level, i));
        }

    }


    // return false: posizione già occupata
    // return true: posizione valida
    check_enemy_pos(x, y){
        // entrata
        if(x+y == 0){
            return false
        }

        // uscita
        if(x == this.exit_x && y == this.exit_y){
            return false;
        }

        // altro nemico nella stessa posizione
        for(let i = 0; i < this.enemies.length;i++){
            if(x == this.enemies[i].x && y == this.enemies[i].y){
                return false;
            }
        }

        return true;
    }


    update_enemy_state(){
        // aggiorna la variabile 'seen'
        // se un nemico è nelle vicinanze di un giocatore il valore della variabile passa a true

        for(let i = 0; i < this.enemies.length;i++){
            if(!this.enemies[i].player_seen){
                let cell = this.get_cell(this.enemies[i].x,this.enemies[i].y).ref
                if(cell.classList.contains("near")){
                    this.enemies[i].player_seen = true;
                    let prep = ".enemy_" + this.enemies[i].ID;
                    document.querySelector(prep).classList.add("seen");
                }
            }
        }
    }

    update_enemy_info(){
        
        // trova il nemico selezionato
        let enemy = this.enemies[this.selected_enemy];
        
        // document.querySelector(".enemy-info .type .value").textContent = e.type;
        document.querySelector(".enemy-info .health .value").textContent = enemy.health; 
        document.querySelector(".enemy-info .atk .value").textContent = enemy.atk; 
        document.querySelector(".enemy-info .def .value").textContent = enemy.def;
        
        
    }

    enemy_attack(){
        for(let i = 0; i < this.enemies.length;i++){
            let cell = this.get_cell(this.enemies[i].x,this.enemies[i].y).ref
            if(cell.classList.contains("near")){
                if(cell.classList.contains("seen")){
                    // togliamo al giocatore x salute dove x è il danno del nemico
                    // console.log(player);
                    let dmg = this.enemies[i].atk - this.enemies[i].atk*(player.def/100);
                    player.health -= dmg;
                    // console.log("Subiti " + dmg + " danni dal nemico(ID:" + this.enemies[i].ID + ")!");

                    // output visivo dei danni subiti
                    this.display_dmg(dmg);

                    // fine partita (temporaneo)
                    if(player.health <= 0){

                        // fake form submission to send data to the php page
                        let data = document.querySelector(".fake-form>form");
                        // moltiplica il livello del piano in base alla difficoltà per ottenere il punteggio finale
                        let points = this.level;
                        if(this.difficulty == 1){
                            points *= 1.5;
                        }else if(this.difficulty == 2){
                            points += 2;
                        }
                        data.children[0].value = this.level;
                        data.children[1].value = player.killed_enemies;

                        data.submit();
                    }

                    update_player_stats();
                }
            }
        }
    }

    player_attack(){
        let enemy = this.enemies[this.selected_enemy];
        // calcolo danni
        let dmg = player.atk - (player.atk * (enemy.def/100));
        // console.log("Inflitti " + dmg + " danni al nemico!");
        enemy.health -= dmg;

        // aggiornamento barra della salute del nemico
        let target = ".enemy_" + enemy.ID + " .enemy-health-bar";
        let enemy_health_bar = document.querySelector(target);
        let perc = enemy.health / enemy.max_health * 100;
        enemy_health_bar.style.width = perc + "%";

        if(enemy.health <= 0){
            // eliminazione nemico
            // dall'array
            this.enemies.splice(this.selected_enemy, 1);
            // console.log(this.enemies);
            // dal campo di gioco
            let ref = this.matrix[enemy.x][enemy.y].ref;
            ref.classList.remove("enemy");
            let enemy_id = "enemy_" + enemy.ID;
            ref.classList.remove(enemy_id);
            // eliminazione parte grafica
            let ref_array = ref.children
            // scorro gli elementi della cella
            for(let i = 0;i < ref_array.length;i++){
                let a = ref_array[i];
                // identifico l'immagine del nemico e la parte che mostra la sua salute
                if(a.classList.contains("sprite") || a.classList.contains("enemy-health-bar-bg")){ 
                    a.remove();
                    // quando rimuovo un elemento l'array si riaggiusta quindi devo modificare anche l'indice
                    i--;
                }
            }

            this.selected_enemy = null;


            // il giocatore guadagna un punto da spendere al superamento del livello
            player.points_left++;

            // aumento il contatore
            player.killed_enemies++;
        }

        // chiusura finestra
        hide_enemy_info();

        //attacco dei nemici che possono attaccare
        this.enemy_attack();
    }



    display_dmg(dmg){
        // crea un elemento 
        let box = document.createElement("div");
        box.classList.add("danno-subito");
        box.textContent = '-' + dmg;
        document.querySelector("body").appendChild(box);
        
        // console.log(box);

        // usato per provare a separare istanze di danno multiple (più nemici che attaccano in contemporanea)
        setTimeout(() => {
            box.classList.add("moving");
        }, Math.floor(Math.random()*1000));


        // elimino l'elemento creato, ormai non mi serve più
        setTimeout(() => {
            box.remove();
        }, 2000);
    }

    auto_attack(){
        // attacco automatico finchè non muore il giocatore o il nemico
        // non serve controllare se il giocatore muore perchè mi sposto in automatico su un'altra pagina
        while(this.selected_enemy != null){
            this.player_attack();
        }
    } 
}

class Cell{
    constructor(x, y, obj){
        // coordinate della cella
        this.x = x;
        this.y = y;

        // riferimento all'elemento nel documento html
        // gestione delle classi
        this.ref = obj;
    }
}