<?php
    session_start();
?>

<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Log in</title>
    <link rel="stylesheet" href="css/style_server.css">
</head>
<body>
    
    <!-- "Finestra di login" -->
    <div class="login-container container">
        <form action="authenticator_manager.php" method="post">
             
            <label for="l-username">Username:</label>
            <input type="text" required name="username" id="l-username">
            
            <label for="l-password">Password: </label>
            <input type="password" required name="password" id="l-password">

            <?php
            if(isset($_GET['error'])){
                echo "<p class='error'>";
                $err = $_GET['error'];
                echo $err;
                echo "</p>";
            }
            ?>
            <button  type="submit" value="login"  name="form">log in</button>
            <a class="back" href="account.php">Indietro</a>
        </form>
    </div>

</body>
</html>