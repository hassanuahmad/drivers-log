export interface DataBarChatProps {
    title: string;
    data: {
        name: string;
        total: number;
    }[];
    formatter: (value: number) => string;
}
