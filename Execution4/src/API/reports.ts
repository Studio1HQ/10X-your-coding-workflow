import { applyKeysetPagination, PaginationParams, PaginatedResponse } from './pagination';

declare const Buffer: any;

export interface Report {
    id: string;
    title: string;
    summary: string;
    status: 'draft' | 'published' | 'archived';
    createdAt: string;
}

export interface ReportsResponse extends PaginatedResponse<Report> {}

export interface GetReportsParams extends PaginationParams {
    status?: 'draft' | 'published' | 'archived';
}

export class ReportsAPI {
    private mockData: Report[];

    constructor() {
        // Generate deterministic mock data
        this.mockData = Array.from({ length: 50 }, (_, i) => ({
            id: `rpt_${50 - i}`,
            title: `Quarterly Report Q${Math.floor(i / 10) + 1} - ${50 - i}`,
            summary: `Financial summary for period ${50 - i}`,
            status: i % 5 === 0 ? 'draft' : 'published',
            createdAt: new Date(1737849600000 - i * 86400000).toISOString() // Fixed start date for determinism
        }));
    }

    async list(params: GetReportsParams = {}): Promise<ReportsResponse> {
        const { status } = params;

        // 1. Initial Filtering (e.g. by status)
        let filteredData = this.mockData;
        if (status) {
            filteredData = filteredData.filter(r => r.status === status);
        }

        const totalCount = filteredData.length;

        // 2. Keyset Pagination
        const { paginatedItems: reports, pageInfo } = applyKeysetPagination(filteredData, params, {
            compare: (item, cursorData) => {
                if (item.createdAt < cursorData.createdAt) return true;
                if (item.createdAt === cursorData.createdAt && item.id < cursorData.id) return true;
                return false;
            },
            getCursorData: (item) => ({
                id: item.id,
                createdAt: item.createdAt
            }),
            legacyDecoder: (cursor) => {
                const decoded = Buffer.from(cursor, 'base64').toString('utf-8');
                const legacyItem = this.mockData.find(r => r.id === decoded);
                if (legacyItem) {
                    return { id: legacyItem.id, createdAt: legacyItem.createdAt };
                }
                throw new Error('Invalid cursor');
            }
        });

        return {
            data: reports,
            pageInfo: {
                ...pageInfo,
                totalCount
            }
        };
    }
}
