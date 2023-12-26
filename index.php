<?php

// function load_environment_variables()
// {
//     $env = parse_ini_file(".env");
//     foreach ($env as $key => $value)
//         $_ENV[$key] = $value;
// }

// load_environment_variables();



class Database
{
    public static function query($sql, $parameters = [])
    {
        $host = "sql3.freemysqlhosting.net";
        $dbname = "sql3672960";
        $user = "sql3672960";
        $password = "js882XlMI2";
        $dsn = "mysql:host=$host;dbname=$dbname";

        try {
            $pdo = new PDO($dsn, $user, $password);
            $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            $stmt = $pdo->prepare($sql);
            $success = $stmt->execute($parameters); // Returns true on succcess, false on fail
            $data = $stmt->fetchAll();
            $stmt = null;
            $pdo = null; // Close connection
            return $data;
        } catch (PDOException $e) {
            // alert($e->getMessage());
            echo $e->getMessage();
        }
    }
}

// Columns: id, psid, officer, email, password, first, last, discord
// $sql = "INSERT INTO members (psid, officer, email, password, first, last, discord) VALUES (?, ?, ?, ?, ?, ?, ?)";
// Database::query($sql, [
//     2204169,
//     false,
//     "test@email.com",
//     "password",
//     "John",
//     "Doe",
//     "discord",
// ]);
var_dump(Database::query("SELECT * FROM members"));

