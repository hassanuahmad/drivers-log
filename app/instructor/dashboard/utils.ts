import {LessonRecordsPreFormattedDuration} from "@/app/types/shared/records";
import {DateTime} from 'luxon';
import {useState} from "react";
import {NavigationItem} from "@/app/types/pages/dashboard";

export const filterLessonRecordsByNavigation = (records: LessonRecordsPreFormattedDuration[], navigation: string) => {
    const currentDate = DateTime.now();

    switch (navigation) {
        case 'today':
            return records.filter(record => record.date === (currentDate.toISODate() || ''));

        case 'last-7-days':
            const sevenDaysAgo = currentDate.minus({days: 6}).toISODate() || '';
            return records.filter(record => record.date >= sevenDaysAgo && record.date <= (currentDate.toISODate() || ''));

        case 'last-30-days':
            const thirtyDaysAgo = currentDate.minus({days: 29}).toISODate() || '';
            return records.filter(record => record.date >= thirtyDaysAgo && record.date <= (currentDate.toISODate() || ''));

        default:
            return records;
    }
};

export const useNavigation = (initialNavigation: NavigationItem[]) => {
    const [navigation, setNavigation] = useState(initialNavigation);
    const [selectedNavigation, setSelectedNavigation] = useState(navigation.find(item => item.current)?.id || "");

    const handleNavigationClick = (name: string) => {
        setSelectedNavigation(name);
        setNavigation((prevNavigation) =>
            prevNavigation.map((item) =>
                item.id === name
                    ? {...item, current: true}
                    : {...item, current: false}
            )
        );
    };

    return {
        navigation,
        selectedNavigation,
        handleNavigationClick,
    };
};

export function isToday(dateString: string): boolean {
    const today = DateTime.local().toISODate();
    const recordDate = DateTime.fromISO(dateString).toISODate();

    return today === recordDate;
}