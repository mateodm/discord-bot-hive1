function generateTable(tabledata) {
    const headers = Object.keys(tabledata[0]);
    const rows = tabledata.map(row => Object.values(row));
    const maxLengths = headers.map((header, index) => {
        return Math.max(header.length, ...rows.map(row => String(row[index]).length));
    });
    const separator = maxLengths.map(length => '-'.repeat(length));
    const headerRow = headers.map((header, index) => header.padEnd(maxLengths[index])).join(' | ');
    const dataRows = rows.map(row =>
        row.map((value, index) => String(value).padEnd(maxLengths[index])).join(' | ')
    );
    return [headerRow, separator.join(' | '), ...dataRows].join('\n');
}

function generateTableBalance(tabledata, acc) {
    const headers = ['Account', 'Symbol', 'Balance'];
    const rows = tabledata.map(entry => {
        const account = acc || '';
        const symbol = Object.keys(entry)[0] || '';
        const balance = Object.values(entry)[0] || '';
        return [account, symbol, balance];
    });

    const maxLengths = headers.map((header, index) => {
        return Math.max(header.length, ...rows.map(row => String(row[index]).length));
    });

    const separator = maxLengths.map(length => '-'.repeat(length));
    const headerRow = headers.map((header, index) => header.padEnd(maxLengths[index])).join(' | ');
    const dataRows = rows.map(row =>
        row.map((value, index) => String(value).padEnd(maxLengths[index])).join(' | ')
    );

    return [headerRow, separator.join(' | '), ...dataRows].join('\n');
}



module.exports = { generateTable, generateTableBalance }