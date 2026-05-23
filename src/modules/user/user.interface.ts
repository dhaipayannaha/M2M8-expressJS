export interface IUser {
    name : string;
    email : string;
    password : string;
    age : number;
    role?: 'admin' | 'user' | 'agent';
    is_active?: boolean;
}


