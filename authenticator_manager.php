
<!-- Gestione autenticazione e registrazione dell'utente -->
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
    <title>Autenticazione</title>
</head>
<body>
    <?php
    // controllo l'input
    $type = $_POST['form'];

    // L'utente ha deciso di fare il logout dal suo account
    if($type == 'logout'){
        // unsetto le variabili di login dell'utente
        unset($_SESSION['user']);
        unset($_SESSION['logged']);  
        session_destroy();
        // torno alla pagina principale
        exit(header("Location:index.html"));
    }


    // gestione autenticazione 
    
    $dbhost = DBHOST;
    $dbname = DBNAME;
    $dbuser = DBUSER;
    $dbpass = DBPASS;

    // error messages
    $err_msg = [    'Incorrect username or password',           // 0 - tentativo di login con utente inesistente o password errata
                    'Incorrect confirmation password',          // 1 - tentativo di registrazione con password di conferma errata
                    'Invalid username',                         // 2 - username non valido
                    'Invalid password',                         // 3 - password non valida          
                ];

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

    // torna indietro e elimina i dati salvati se presenti
    if($type == 'back'){
        if(isset($_SESSION['score'])){
            unset($_SESSION['score']);
        }
        if(isset($_SESSION['killed'])){
            unset($_SESSION['killed']);
        }
        if(isset($_SESSION['login_after'])){
            unset($_SESSION['login_after']);
        }
        exit(header("Location:index.html"));
    }

    // L'utente ha scelto di fare il login
    if($type == 'login'){
        // get username
        $username = $_POST['username'];

        // cleaner input
        $username = check_input("user", $username);

        $result = get_db_data($username, $pdo, $err_msg);

        $correct_password = $result['password'];
        if (password_verify($_POST["password"], $correct_password)) {
            // salvo che l'utente è loggato e il suo username
            $_SESSION['user'] = "$username";
            $_SESSION['logged'] = true;
            // torno alla pagine principale
            conditional_go_back();
        }else{
            // password errata
            exit(header("Location:login.php?error=$err_msg[0]"));
        }
    }

    // L'utente ha scelto di registrarsi
    if($type == 'signup'){
        // get username
        $username = $_POST['username'];

        // cleaner input
        $username = check_input("user", $username);

        // serach db for user
        $result = get_db_data($username, $pdo, $err_msg);
        // user already registered
        if($result){
            exit(header("Location:signup.php?error=$err_msg[2]"));
        }

        $pass = $_POST['password'];
        $confirm_pass = $_POST['confirm'];
        // wrong confirmation password
        if($pass !== $confirm_pass){
            exit(header("Location:signup.php?error=$err_msg[1]"));
        }
        $pass = check_input("password", $pass);
        $hashed_password = password_hash($pass ,PASSWORD_BCRYPT);

        // inserisco l'utente e relativa password nel database
        $sql = "insert into user(username, password) values('$username', '$hashed_password')";
        $pdo->query($sql);
        // salvo che l'utente è loggato e il suo username
        $_SESSION['user'] = "$username";
        $_SESSION['logged'] = true;
        conditional_go_back();
    }

    // L'utente ha scelto di cancellare il suo account
    if($type == 'delete'){
        // rimuovi l'utente dal database
        if(!isset($_SESSION['logged'])){
            exit(header("Location:account.php?msg=usernotlogged"));
        }
        $username = $_SESSION['user'];

        $sql = "delete from user where username = '$username'";
        $pdo->query($sql);

        // unsetto le variabili di login dell'utente
        unset($_SESSION['user']);
        unset($_SESSION['logged']);  
        session_destroy();
        exit(header("Location:index.html?deleted"));
    }


    function get_db_data($username, $pdo, $err_msg){
        // check if user exists
        $sql = "select * from user where username = '$username' ";
        $query_result = $pdo->query($sql)->fetch();
        
        return $query_result;
    }


    function conditional_go_back(){
        if(isset($_SESSION['login_after'])){
            // il giocatore ha loggato a fine partita
            unset($_SESSION['login_after']);
            exit(header("Location:account.php"));
        }else{
            // semplice autenticazione
            exit(header("Location:index.html"));
        }
    }

    function check_input($type, $input){
        $valid = true;

        // rimozione spazi inizio e fine stringa
        $input = trim($input);

        // input vuoto
        if($input == ""){
            $valid = false;
        }

        // controlla se l'input è formato da più parole, cercando la presenza di spazi
        if(preg_match('/\s/', $username)){
            $valid = false;
        }


        if(!$valid){
            if($type == "user"){
                exit(header("Location:end_game.php?error=$err_msg[2]"));
            }else{
                exit(header("Location:end_game.php?error=$err_msg[3]"));
            }
        }

        return $input;
    }
    
    
    /* close connection to the DB */
    try{
        $pdo = null;
    }
    catch (PDOException $e){
        die($e->getMessage());
    }
    ?>


    <script src="js/server.js"></script>
</body>
</html>