export interface User {
    id: number;
    name: string;
    email: string;
    initial: string;
    role: string;
    roleColor: string;
    unit: string;
    bidang: string;
}

export interface UserStat {
    label: string;
    value: number;
    icon?: any;
    color?: string;
    highlight?: string;
}
