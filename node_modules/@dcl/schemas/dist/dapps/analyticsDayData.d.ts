import { Network } from './network';
export declare type AnalyticsDayData = {
    id: string;
    date: number;
    sales: number;
    volume: string;
    creatorsEarnings: string;
    daoEarnings: string;
};
export declare type AnalyticsDayDataFilters = {
    from?: number;
    network?: Network;
};
export declare enum AnalyticsDayDataSortBy {
    DATE = "date",
    MOST_SALES = "most_sales"
}
//# sourceMappingURL=analyticsDayData.d.ts.map