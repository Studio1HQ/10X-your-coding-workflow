
import { ReportsAPI } from './src/API/reports';
declare const Buffer: any;
declare const process: any;

async function test() {
    const api = new ReportsAPI();
    const legacyCursor = Buffer.from('rpt_50').toString('base64');
    console.log(`Using legacy cursor for rpt_50: ${legacyCursor}`);
    const response = await api.list({ limit: 5, cursor: legacyCursor });
    console.log('Legacy Cursor Results:');
    response.reports.forEach((r: any) => console.log(r.id));
    if (response.reports.length > 0 && response.reports[0].id === 'rpt_49') {
        console.log('SUCCESS: Legacy cursor works');
    } else {
        console.log('FAILED: Legacy cursor failed, expected first item to be rpt_49');
        if (response.reports.length > 0) {
            console.log('Got: ' + response.reports[0].id);
        } else {
            console.log('Got no reports');
        }
        process.exit(1);
    }
}
test().catch(err => {
    console.error(err);
    process.exit(1);
});
