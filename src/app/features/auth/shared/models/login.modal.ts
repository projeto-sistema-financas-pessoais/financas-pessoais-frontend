export class Login {
    email!: string;
    senha!: string;
}

export class UserInformation{
    name!: string;
    date_user!: string
    email!: string
}

export class LoginResponse {
    access_token!: string;
    token_type!: string;
    name!: string;
    date_user!: string
}