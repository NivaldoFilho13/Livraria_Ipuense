<?php
declare(strict_types=1);
require __DIR__ . '/autenticacao.php';

if (usuarioLogado()) {
    header('Location: index.html');
    exit;
}

$erro = '';
$nome = '';
$email = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nome = trim((string) ($_POST['nome'] ?? ''));
    $email = trim((string) ($_POST['email'] ?? ''));
    $senha = (string) ($_POST['senha'] ?? '');
    $confirmacao = (string) ($_POST['confirmacao_senha'] ?? '');

    if (!csrfValido($_POST['csrf_token'] ?? null)) {
        $erro = 'Sua sessão expirou. Atualize a página e tente novamente.';
    } elseif ($nome === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($senha) < 8) {
        $erro = 'Informe nome, e-mail válido e uma senha com pelo menos 8 caracteres.';
    } elseif ($senha !== $confirmacao) {
        $erro = 'As senhas não coincidem.';
    } else {
        $usuarios = lerUsuarios();
        $existe = array_filter($usuarios, fn(array $u): bool => strcasecmp($u['email'] ?? '', $email) === 0);
        if ($existe) {
            $erro = 'Já existe uma conta com este e-mail.';
        } else {
            $usuarios[] = [
                'nome' => $nome,
                'email' => $email,
                'senha_hash' => password_hash($senha, PASSWORD_DEFAULT),
            ];
            if (salvarUsuarios($usuarios)) {
                session_regenerate_id(true);
                $_SESSION['usuario'] = ['nome' => $nome, 'email' => $email];
                header('Location: conta.php');
                exit;
            }
            $erro = 'Não foi possível salvar seu cadastro. Verifique a permissão da pasta data.';
        }
    }
}
?>
<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Criar conta · E10 Livraria</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header class="topo"><div class="topo-container"><a href="index.html" class="marca">📚 <span>E10 Livraria <small>&amp; Papelaria Ipuense</small></span></a></div></header>
  <main class="conteudo"><div class="form-caixa">
    <h1>Criar sua conta</h1>
    <?php if ($erro): ?><div class="msg-erro"><?= escapar($erro) ?></div><?php endif; ?>
    <form method="post">
      <input type="hidden" name="csrf_token" value="<?= escapar(tokenCsrf()) ?>">
      <div class="campo"><label for="nome">Nome completo</label><input id="nome" name="nome" value="<?= escapar($nome) ?>" required autofocus></div>
      <div class="campo"><label for="email">E-mail</label><input id="email" name="email" type="email" value="<?= escapar($email) ?>" required></div>
      <div class="campo"><label for="senha">Senha</label><input id="senha" name="senha" type="password" minlength="8" required></div>
      <div class="campo"><label for="confirmacao_senha">Confirmar senha</label><input id="confirmacao_senha" name="confirmacao_senha" type="password" minlength="8" required></div>
      <button class="btn btn-primario" style="width:100%">Criar conta</button>
    </form>
    <p class="rodape-link">Já tem conta? <a href="login.php">Entrar</a></p>
  </div></main>
</body>
</html>
