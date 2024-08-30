export class Login {
    email!: string;
    senha!: string;
}

export class LoginResponse{
    acesso_token!: string;
    token_tipo!: string;
    nome!: string;
}