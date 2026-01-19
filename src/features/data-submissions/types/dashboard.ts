// data-submissions/types/dashboard.ts

export interface StatItem {
    label: string;
    value: string | number;
    iconType: 'chart' | 'bolt' | 'settings' | 'database';
    color: 'blue' | 'green' | 'orange' | 'purple';
}

export interface ActionItem {
    title: string;
    description: string;
    iconType: 'report' | 'maintenance' | 'warehouse' | 'activity' | 'performance';
    href: string;
}

export interface DashboardItem {
    title: string;
    description: string;
    metricCount: number;
    type: 'nko' | 'ulp';
    href: string;
}
