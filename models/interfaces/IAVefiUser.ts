import type IAVefiRole from "./IAVefiRole";

export default interface IAVefiUser {
    id: number;
    username: string;
    blocked: boolean;
    Avatar: string;
    role: IAVefiRole
}