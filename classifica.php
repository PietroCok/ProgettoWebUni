
<!-- Gestione classifiche -->

<?php
    session_start();


    // define DB infos
    define('DBHOST', 'localhost');
    define('DBNAME', 'mydatabase');
    define('DBUSER', 'root');
    define('DBPASS', '');
?>

<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Classifiche</title>

    <link rel="stylesheet" href="css/style_classifica.css">
</head>
<body>
    <script src="js/server.js"></script>

    <nav>
        <form method="post" class="interazioni">
                <button name="form-classifica" value="max-score" class="max-score">Punteggio massimo</button>
                <button name="form-classifica" value="played-games" class="game-played">Partite giocate</button>
                <button name="form-classifica" value="max-kills" class="max-killed">Uccisioni massime</button>
                <button name="form-classifica" value="total-kills" class="total-kills">Uccisioni totali</button>
                <!-- <button name="form-classifica" value="test" class="test">Test only</button> -->
        </form>        
    <?php
        // default scoreboard
        $tipo = 'Punteggio massimo';
        if(isset($_POST['form-classifica'])){
            $tipo = $_POST['form-classifica'];
            switch($tipo){
                case 'max-score':
                    $tipo = 'Punteggio massimo';
                    break;
                case 'played-games':
                    $tipo = 'Partite giocate';
                    break;
                case 'max-kills':
                    $tipo = 'Uccisioni massime';
                    break;
                case 'total-kills':
                    $tipo = 'Uccisioni totali';
                    break;
                default:
                    $tipo = "test";
            }
        }
        echo "<h2 class='tipo-classifica'>".$tipo."</h2>";

    ?>
        
    </nav>

    <?php
        echo "<div class='classifica-container'>";

        // elemento tabella
        echo "<table class='classifica'>";

        // prima riga
        echo "<tr>";
        echo "<th> Posizione </th>";
        echo "<th> Giocatore </th>";
        echo "<th> Punteggio </th>";
        echo "</tr>";
       
        $dbhost = DBHOST;
        $dbname = DBNAME;
        $dbuser = DBUSER;
        $dbpass = DBPASS;
        /* DB open connection*/
        try{
            $connString = "mysql:host=$dbhost;dbname=$dbname";
        
            // database connection
            $pdo = new PDO($connString, $dbuser, $dbpass);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        }
        catch (PDOException $e){
            // errors connecting to the database
            die($e->getMessage());
        }
        $stat;
        // recupero la statistica che mi interessa
        switch($tipo){
            case 'Partite giocate':
                $stat = 'gameplayed';
                break;
            case 'Uccisioni massime':
                $stat = 'maxkilled';
                break;
            case 'Uccisioni totali':
                $stat = 'totalkilled';
                break;
            default:
                $stat = 'maxscore'; 
        }
        $sql = "call get_scoreboard('$stat')";
        $result = $pdo->query($sql);

        for($i = 1; $i <= 100; $i++){
            $row = $result->fetch();
            if(!$row){
                // "debug" for many columns
                if($tipo == 'test'){
                    echo "<tr><td>".$i."</td><td>dummy username</td><td>dummy score</td></tr>";
                    continue;
                }
                break;
            }
            $logged = false;
            if(isset($_SESSION['user']) && $row['username'] == $_SESSION['user']){
                $logged = true;
            }

            // identifico la riga del giocatore attualmente loggato
            if($logged){
                echo "<tr class='player'>";
            }else{
                echo "<tr>";
            }
            
            echo "<td>".$i."</td>";
            echo "<td>".$row['username']."</td>";
            echo "<td>".$row["$stat"]."</td>";
            echo "</tr>";
        }


        // chiusura elemento tabella
        ?>
        </table>
    </div>

    <footer>
        <a href="index.html">Indietro</a>
    </footer>
    <?php
        if(isset($_POST['form-back'])){
            exit(header("Location:index.html"));
        }

        /* close connection to the DB */
        try{
            $pdo = null;
        }
        catch (PDOException $e){
            die($e->getMessage());
        }
    ?>

</body>
</html>