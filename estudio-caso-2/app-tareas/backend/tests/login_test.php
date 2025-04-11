<?php
require('C:/Users/User/OneDrive - Universidad Fidélitas/Documentos/GitHub/TrabajosEnClase/sc502-1c2025-GersonChacon-trabajoenclase/Semana11/app-tareas/backend/login.php');

if (login("user1@gmail.com", "123456")) {
    echo 'Login exitoso' . PHP_EOL;
} else {
    echo 'Login incorrecto' . PHP_EOL;
}


if (login("asdadad", "asdads")) {
    echo 'Login exitoso' . PHP_EOL;
} else {
    echo 'Login incorrecto' . PHP_EOL;
}