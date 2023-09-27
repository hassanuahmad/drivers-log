export interface TierPrice {
    monthly: string;
    annually: string;
}

export interface Tier {
    name: string;
    id: string;
    href: string;
    price: TierPrice;
    description: string;
    features: string[];
    mostPopular: boolean;
}