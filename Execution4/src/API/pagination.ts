declare const Buffer: any;

export interface PageInfo {
    hasNextPage: boolean;
    nextCursor: string | null;
    totalCount?: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    pageInfo: PageInfo;
}

export interface PaginationParams {
    limit?: number;
    cursor?: string;
}

/**
 * Encodes an object into a base64 cursor string.
 */
export function encodeCursor(data: any): string {
    return Buffer.from(JSON.stringify(data)).toString('base64');
}

/**
 * Decodes a base64 cursor string into an object.
 */
export function decodeCursor<T>(cursor: string): T {
    const decoded = Buffer.from(cursor, 'base64').toString('utf-8');
    return JSON.parse(decoded);
}

/**
 * Applies keyset pagination to an array of items.
 */
export function applyKeysetPagination<T>(
    items: T[],
    params: PaginationParams,
    options: {
        compare: (item: T, cursorData: any) => boolean;
        getCursorData: (item: T) => any;
        legacyDecoder?: (cursor: string) => any;
        defaultLimit?: number;
        maxLimit?: number;
    }
): { paginatedItems: T[]; pageInfo: PageInfo } {
    const {
        compare,
        getCursorData,
        legacyDecoder,
        defaultLimit = 10,
        maxLimit = 100
    } = options;

    const limit = Math.max(1, Math.min(maxLimit, params.limit ?? defaultLimit));
    let filteredItems = items;

    if (params.cursor) {
        try {
            let cursorData: any;
            try {
                cursorData = decodeCursor(params.cursor);
            } catch (e) {
                if (legacyDecoder) {
                    cursorData = legacyDecoder(params.cursor);
                } else {
                    throw e;
                }
            }
            filteredItems = items.filter(item => compare(item, cursorData));
        } catch (e) {
            console.warn('Pagination error:', e);
            filteredItems = [];
        }
    }

    const paginatedItems = filteredItems.slice(0, limit);
    const hasNextPage = filteredItems.length > limit;
    let nextCursor: string | null = null;

    if (hasNextPage) {
        const lastItem = paginatedItems[paginatedItems.length - 1];
        nextCursor = encodeCursor(getCursorData(lastItem));
    }

    return {
        paginatedItems,
        pageInfo: {
            hasNextPage,
            nextCursor
        }
    };
}
