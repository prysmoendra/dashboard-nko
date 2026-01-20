export interface User {
    id: number;
    name: string;
    email: string;
    initial: string;
    role: string; // Display name (e.g., "Super Admin")
    role_name: string; // Enum value (e.g., "super-admin")
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
