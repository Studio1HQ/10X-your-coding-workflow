import { ReportsAPI } from './src/API/reports';

declare const process: any;

async function verifyReports() {
    console.log('Starting verification...');
    const api = new ReportsAPI();

    // 1. Initial fetch
    console.log('Fetching first page...');
    const page1 = await api.list({ limit: 10 });
    console.log(`Page 1: Returned ${page1.data.length} reports`);
    console.log(`Total Count: ${page1.pageInfo.totalCount}`);

    if (page1.data.length !== 10) {
        console.error('FAILED: Expected 10 reports on page 1');
        process.exit(1);
    }

    // Verify ordering and content
    if (page1.data[0].id !== 'rpt_50') {
        console.error(`FAILED: Expected first report to be rpt_50, got ${page1.data[0].id}`);
        process.exit(1);
    }

    console.log(`First report ID: ${page1.data[0].id} (Expected rpt_50)`);
    console.log(`Last report ID: ${page1.data[9].id} (Expected rpt_41)`);
    console.log(`Next cursor: ${page1.pageInfo.nextCursor || 'null'}`);

    if (!page1.pageInfo.nextCursor) {
        console.error('FAILED: Expected nextCursor to be present');
        process.exit(1);
    }

    // 2. Pagination Loop
    console.log('\nTesting full pagination...');
    let allReports: any[] = [];
    let cursor: string | null | undefined = page1.pageInfo.nextCursor;

    // Add page 1
    allReports = allReports.concat(page1.data);

    let pageCount = 1;

    while (cursor) {
        pageCount++;
        const response = await api.list({ limit: 10, cursor });
        allReports = allReports.concat(response.data);
        cursor = response.pageInfo.nextCursor;
        console.log(`Page ${pageCount}: Fetched ${response.data.length} reports.`);

        // Safety break
        if (pageCount > 10) {
            console.error('FAILED: Infinite loop detected or too many pages');
            break;
        }
    }

    console.log(`\nTotal reports fetched: ${allReports.length}`);

    if (allReports.length !== 50) {
        console.error(`FAILED: Expected 50 total reports, got ${allReports.length}`);
        const uniqueIds = new Set(allReports.map(r => r.id));
        console.log(`Unique IDs: ${uniqueIds.size}`);
        process.exit(1);
    } else {
        console.log('SUCCESS: Fetched exactly 50 reports');
    }

    // 3. Verify Order
    let isOrdered = true;
    for (let i = 0; i < allReports.length - 1; i++) {
        const current = allReports[i];
        const next = allReports[i + 1];

        // Check createdAt
        if (current.createdAt < next.createdAt) {
            console.error(`FAILED Order: Index ${i} (${current.createdAt}) is older than ${i + 1} (${next.createdAt})`);
            isOrdered = false;
            break;
        }
    }

    if (isOrdered) {
        console.log('SUCCESS: Reports are correctly ordered by createdAt descending');
    }
}

verifyReports().catch(err => {
    console.error('Verification script error:', err);
    process.exit(1);
});
