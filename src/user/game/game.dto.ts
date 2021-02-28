export interface CreateGameDto {
    title: string;
    _title: string;
    scores?: any[];
}

export interface SetTitleDto {
    title: string;
}

export interface InviteUserDto {
    user: string;
}