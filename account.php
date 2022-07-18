
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
    <title>Account manager</title>
    <link rel="stylesheet" href="css/style_server.css">
</head>
<body>

    <?php
    // detect game finished
    if(isset($_POST['score']) || isset($_SESSION['score'])){
        $score;
        $killed;
        if(isset($_POST['score'])){
            $score = $_POST['score'];
            $killed = $_POST['killed'];
        }else{
            $score = $_SESSION['score'];
            $killed = $_SESSION['killed'];
        }

        ?>
        <div class="end-game-stats container">
            <h4>Partita conclusa</h4>
            <h5>Riepilogo</h5>
            <p>Punteggio: 
                <span class="value"> 
                <?php
                    echo $score;
                ?>
                </span>
            </p>
            <p>Nemici uccisi: 
                <span class="value">
                <?php
                    echo $killed;
                ?>
                </span>
            </p>
            <!-- indietro -->
            <form action="authenticator_manager.php" method="post">
                <button class="back" name="form" type="submit" value="back">Indietro</button>
            </form>
        </div>
        <?php


        // detect player not logged
        if(!isset($_SESSION['user'])){
            // salva le statistiche della partita preventivamente
            // se l'utente non sceglie di loggare verrano distrutte

            if(!isset($_SESSION['score']) && !isset($_SESSION['killed'])){
                $_SESSION['score'] = $_POST['score'];
                $_SESSION['killed'] = $_POST['killed'];
            }
            
            $_SESSION['login_after'] = true;
            ?>
            <div class="container">
                <p>Utente non loggato</p>
                <p>Per salvare le statistiche della partita è necessario eseguire il login</p>


                <a href="login.php">Log In</a>
                <a href="signup.php">Registrazione</a>
            </div>
            <?php
        }else{
            // player logged 
            // update database
            $dbhost = DBHOST;
            $dbname = DBNAME;
            $dbuser = DBUSER;
            $dbpass = DBPASS;

            // stats are saved in $score and $killed
            $user = $_SESSION['user'];

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

            // aggiorno le statistiche del giocatore
            $sql = "call update_stats('$user', $killed, $score)";
            $pdo->query($sql);

            /* close connection to the DB */
            try{
                $pdo = null;
            }
            catch (PDOException $e){
                die($e->getMessage());
            }
        }
    }else{
        // "simple" account management

        // utente loggato
        if(isset($_SESSION['user'])){
            ?>
            <!-- Finestra di gestione dell'account -->
            <div class="account-manager-container container">
            <?php
                echo "<div class='username'> Ciao<span> " .$_SESSION['user'] . "</span></div>";
            ?>
                <form action="authenticator_manager.php" method="post">
                    <button name="form" type="submit" value="logout">Log Out</button>
                </form>
                <button class="delete" onclick="show_delete_confirmation()">Cancella account</button>
                <!-- indietro -->
                <form action="authenticator_manager.php" method="post">
                    <button class="back" name="form" type="submit" value="back">Indietro</button>
                </form>
            </div>

            <!-- Conferma cancellazione account -->
            <div class="delete-confirmation container hidden">
                <p>Sei sicuro di voler cancellare il tuo account?</p>
                <p>Questa è un'operazione irreversibile</p>
                <form action="authenticator_manager.php" method="post">
                    <button name="form" type="submit" value="delete">si, cancella il mio account</button>
                </form>
                <button onclick="hide_delete_confirmation()">No</button>
            </div>

            
            <?php
        }else{
            ?>
            <div class="logger container">
                <p>Utente non loggato</p>
                <a href="login.php">Log In</a>
                <a href="signup.php">Registrazione</a>
                <!-- indietro -->
                <a class="back" href="index.html">indietro</a>
            </div>
            <?php
        }
    }

    ?>




    
    <script src="js/server.js"></script>
</body>
</html>