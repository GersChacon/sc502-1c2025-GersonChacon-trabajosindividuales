<?php
require('db.php');

function createComment($taskId, $comment)
{
    global $pdo;
    try {
        $sql = "INSERT INTO comments (task_id, comment) VALUES (:task_id, :comment)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'task_id' => $taskId,
            'comment' => $comment
        ]);
        return $pdo->lastInsertId();
    } catch (Exception $e) {
        echo $e->getMessage();
        return 0;
    }
}

function getCommentByTask($taskId)
{
    global $pdo;
    try {
        $stmt = $pdo->prepare("SELECT * FROM comments WHERE task_id = :task_id");
        $stmt->execute(['task_id' => $taskId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $ex) {
        echo "Error al obtener los comentarios: " . $ex->getMessage();
        return [];
    }
}

function editComment($id, $comment)
{
    global $pdo;
    try {
        $sql = "UPDATE comments SET comment = :comment WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'comment' => $comment,
            'id' => $id
        ]);
        return $stmt->rowCount() > 0;
    } catch (Exception $e) {
        echo $e->getMessage();
        return false;
    }
}

function deleteComment($id)
{
    global $pdo;
    try {
        $sql = "DELETE FROM comments WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(["id" => $id]);
        return $stmt->rowCount() > 0;
    } catch (Exception $e) {
        echo $e->getMessage();
        return false;
    }
}

function validateInput($input)
{
    return isset($input['comment']);
}

$method = $_SERVER['REQUEST_METHOD'];
header('Content-Type: application/json');

function getJsonInput()
{
    return json_decode(file_get_contents("php://input"), associative: true);
}

session_start();

if (isset($_SESSION["user_id"])) {
    try {
        switch ($method) {
            case 'GET':
                if (isset($_GET['task_id'])) {
                    $comentarios = getCommentByTask($_GET['task_id']);
                    echo json_encode($comentarios);
                } else {
                    http_response_code(400);
                    echo json_encode(["error" => "Falta el parámetro task_id"]);
                }
                break;

            case 'POST':
                $input = getJsonInput();
                if (isset($input['task_id']) && validateInput($input)) {
                    $idComment = createComment($input['task_id'], $input['comment']);
                    if ($idComment > 0) {
                        http_response_code(201);
                        echo json_encode(["message" => "Comentario creado exitosamente. ID: $idComment"]);
                    } else {
                        http_response_code(500);
                        echo json_encode(['error' => "Error al crear el comentario"]);
                    }
                } else {
                    http_response_code(400);
                    echo json_encode(["error" => "Datos insuficientes o falta task_id"]);
                }
                break;

            case 'PUT':
                $input = getJsonInput();
                if (validateInput($input) && isset($_GET['id'])) {
                    if (editComment($_GET['id'], $input['comment'])) {
                        http_response_code(200);
                        echo json_encode(['message' => "Comentario actualizado exitosamente"]);
                    } else {
                        http_response_code(500);
                        echo json_encode(['error' => "Error al actualizar el comentario"]);
                    }
                } else {
                    http_response_code(400);
                    echo json_encode(['error' => 'Datos insuficientes o falta ID']);
                }
                break;

            case 'DELETE':
                if (isset($_GET['id'])) {
                    if (deleteComment($_GET['id'])) {
                        http_response_code(200);
                        echo json_encode(['message' => "Comentario eliminado exitosamente"]);
                    } else {
                        http_response_code(500);
                        echo json_encode(['error' => "Error al eliminar el comentario"]);
                    }
                } else {
                    http_response_code(400);
                    echo json_encode(['error' => "Falta ID del comentario"]);
                }
                break;

            default:
                http_response_code(405);
                echo json_encode(["error" => "Método no permitido"]);
        }
    } catch (Exception $exp) {
        http_response_code(500);
        echo json_encode(['error' => "Error al procesar la solicitud"]);
    }
} else {
    http_response_code(401);
    echo json_encode(["error" => "Sesión no activa"]);
}
