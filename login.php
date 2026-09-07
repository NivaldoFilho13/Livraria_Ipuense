<?php
declare(strict_types=1);
require __DIR__ . '/autenticacao.php';

if (usuarioLogado()) {
    header('Location: index.html');
    exit;
}

$erro = '';
$email = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim((string) ($_POST['email'] ?? ''));
    $senha = (string) ($_POST['senha'] ?? '');

    if (!csrfValido($_POST['csrf_token'] ?? null)) {
        $erro = 'Sua sessão expirou. Atualize a página e tente novamente.';
    } else {
        foreach (lerUsuarios() as $usuario) {
            if (strcasecmp($usuario['email'] ?? '', $email) === 0
                && password_verify($senha, $usuario['senha_hash'] ?? '')) {
                session_regenerate_id(true);
                $_SESSION['usuario'] = [
                    'nome' => $usuario['nome'],
                    'email' => $usuario['email'],
                ];
                header('Location: conta.php');
                exit;
            }
        }
        $erro = 'E-mail ou senha inválidos.';
    }
}
?>
<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Entrar · E10 Livraria</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header class="topo"><div class="topo-container"><a href="index.html" class="marca">📚 <span>E10 Livraria <small>&amp; Papelaria Ipuense</small></span></a></div></header>
  <main class="conteudo"><div class="form-caixa">
    <h1>Entrar na sua conta</h1>
    <?php if ($erro): ?><div class="msg-erro"><?= escapar($erro) ?></div><?php endif; ?>
    <form method="post">
      <input type="hidden" name="csrf_token" value="<?= escapar(tokenCsrf()) ?>">
      <div class="campo"><label for="email">E-mail</label><input id="email" name="email" type="email" value="<?= escapar($email) ?>" required autofocus></div>
      <div class="campo"><label for="senha">Senha</label><input id="senha" name="senha" type="password" required></div>
      <button class="btn btn-primario" style="width:100%">Entrar</button>
    </form>
    <p class="rodape-link">Ainda não tem conta? <a href="cadastro.php">Cadastre-se</a></p>
  </div></main>
</body>
</html>
