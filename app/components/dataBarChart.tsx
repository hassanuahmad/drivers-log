import {Card, CardContent, CardHeader, CardTitle,} from "@/app/components/ui/card"
import {Bar, BarChart, ResponsiveContainer, XAxis, YAxis} from "recharts"
import {DataBarChatProps} from "@/app/types/components/dataBarChart";

export default function DataBarChart({title, data, formatter}: DataBarChatProps) {
    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={data}>
                        <XAxis
                            dataKey="name"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            domain={['auto', 'auto']}
                            tickFormatter={formatter}
                        />
                        <Bar dataKey="total" fill="#4e46e6" radius={[4, 4, 0, 0]}/>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}