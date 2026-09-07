<?php
declare(strict_types=1);

const ARQUIVO_USUARIOS = __DIR__ . '/data/usuarios.json';

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_set_cookie_params(['httponly' => true, 'samesite' => 'Lax']);
    session_start();
}

function escapar(string $texto): string {
    return htmlspecialchars($texto, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function tokenCsrf(): string {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function csrfValido(?string $token): bool {
    return is_string($token)
        && isset($_SESSION['csrf_token'])
        && hash_equals($_SESSION['csrf_token'], $token);
}

function lerUsuarios(): array {
    if (!is_file(ARQUIVO_USUARIOS)) {
        return [];
    }
    $conteudo = file_get_contents(ARQUIVO_USUARIOS);
    $usuarios = json_decode($conteudo ?: '[]', true);
    return is_array($usuarios) ? $usuarios : [];
}

function salvarUsuarios(array $usuarios): bool {
    return file_put_contents(
        ARQUIVO_USUARIOS,
        json_encode($usuarios, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE),
        LOCK_EX
    ) !== false;
}

function usuarioLogado(): ?array {
    return $_SESSION['usuario'] ?? null;
}
