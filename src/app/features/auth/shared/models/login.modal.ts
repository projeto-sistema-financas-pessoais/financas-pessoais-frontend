export class Login {
    email!: string;
    senha!: string;
}

export class LoginResponse{
    access_token!: string;
    token_type!: string;
    name!: string;
}