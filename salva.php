<?php

include("conexao.php");

$nome = $_POST['nome'];
$email = $_POST['email'];
$telefone = $_POST['telefone'];
$idade = $_POST['idade'];

$sql = "INSERT INTO usuarios(nome,email,telefone,idade)
VALUES('$nome','$email','$telefone','$idade')";

if($conexao->query($sql) === TRUE){

    echo "Cadastro realizado com sucesso!";

}else{

    echo "Erro: ".$conexao->error;

}

$conexao->close();

?>
