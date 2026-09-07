<?php
declare(strict_types=1);
require __DIR__ . '/autenticacao.php';

$usuario = usuarioLogado();
if (!$usuario) {
    header('Location: login.php');
    exit;
}
?>
<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Minha conta · E10 Livraria</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header class="topo"><div class="topo-container"><a href="index.html" class="marca">📚 <span>E10 Livraria <small>&amp; Papelaria Ipuense</small></span></a></div></header>
  <main class="conteudo"><div class="form-caixa">
    <h1>Olá, <?= escapar($usuario['nome']) ?>!</h1>
    <p>Seu login foi realizado com sucesso.</p>
    <p><strong>E-mail:</strong> <?= escapar($usuario['email']) ?></p>
    <p style="margin-top:24px"><a class="btn btn-primario" href="index.html">Ir para o catálogo</a></p>
    <p class="rodape-link"><a href="sair.php">Sair da conta</a></p>
  </div></main>
</body>
</html>
