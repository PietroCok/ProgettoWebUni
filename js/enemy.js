// classe nemico
class Enemy{
    constructor(x, y, lvl = 0, id){
        this.type;
        // punti da assegnare in base al tipo di nemico
        this.type_points = [
            ['light', [1, 3, 1]],
            ['medium', [2, 2, 1]],
            ['heavy', [2, 1, 2]]
        ]
        // Enemy stats
        this.max_health = 50;
        this.health = 50;
        this.atk = 10;
        this.def = 0;
        // level increase with floors and add one point to a random stats
        this.level = lvl; 
        this.base_mul = {
            health: 50,
            atk: 5,
            def: 10
        }
        // first time they see a player they do nothing
        // if they saw the player they attack immediatly as soon the player is near enough
        this.player_seen = false;

        // Identificatore del nemico
        this.ID = id;

        // posizione del nemico
        this.x = x;
        this.y = y;

        this.assign_stats();
    }

    assign_stats(){
        // Randomly choose the enemy type
        let t = random(0, 2);
        this.type = this.type_points[t][0];

        // assign stats based on the enemy type

        // get base points from type
        let base_points;
        for(let i = 0; i < this.type_points.length;i++){
            if(this.type_points[i][0] == this.type){
                base_points = this.type_points[i][1];
            }
        }

        // randomly assign points based on enemy type
        if(this.level > 0){
            this.assign_more_points(t);
        }
    }



    assign_more_points(type){
        // get the probability of assign points to a particular stat
        // based on unit type
        let health_p = this.type_points[type][1][0] / this.level *100;
        let atk_p = this.type_points[type][1][1] / this.level *100;
        let def_p = this.type_points[type][1][2] / this.level *100;

        let points_left = this.level;

        while(points_left >= 0){
            let a = Math.floor(Math.random()* 100 + health_p);
            let b = Math.floor(Math.random()* 100 + atk_p);
            let c = Math.floor(Math.random()* 100 + def_p);

            let max_value = Math.max(a, b, c);
            switch(max_value){
                case a:
                    this.health += this.base_mul.health;
                    this.max_health = this.health;
                    break;
                case b:
                    this.atk += this.base_mul.atk;
                    break;
                case c:
                    this.def += this.base_mul.def;
                    // massima difesa possibile
                    if(this.def > 90){
                        this.def = 90;
                        points_left++;
                    }
                    break;
            }

            points_left--;
        }
    }
}