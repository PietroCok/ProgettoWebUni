<?php
    session_start();
?>

<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign up</title>
    <link rel="stylesheet" href="css/style_server.css">
</head>
<body>
    
    <!-- Finestra di registrazione -->
    <div class="signup-container container">
        <form action="authenticator_manager.php" method="post">
            <label for="username">Username:</label>
            <input type="text" required name="username" id="username">
            
            <label for="password">Password: </label>
            <input type="password" required name="password" id="password">

            <div class="pass-eff"></div>
            <div class="tip hidden">
                Suggerimento: 
                <div class="pass-tips"></div>
            </div>

            <label for="confirm-password">Confirm password: </label>
            <input type="password" required name="confirm" id="confirm-password">
            
            <?php
            if(isset($_GET['error'])){
                echo "<p class='error'>";
                $err = $_GET['error'];
                echo $err;
                echo "</p>";
            }
            ?>

            <button type="submit" value="signup"  name="form">Registrati</button>
            <a class="back" href="account.php">Indietro</a>
        </form>
    </div>

    <script src="js/server.js"></script>
    <script>
        check_password(".signup-container");
    </script>
</body>
</html>