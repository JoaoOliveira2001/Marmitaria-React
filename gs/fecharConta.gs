function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  if (data.acao === 'fecharConta') {
    return fecharConta(data.mesa);
  }
  return ContentService.createTextOutput('Ação não suportada');
}

function fecharConta(mesa) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetMesas = ss.getSheetByName('Mesas');
  const sheetFechar = ss.getSheetByName('fecharConta');

  const values = sheetMesas.getDataRange().getValues();
  const headers = values.shift();
  const mesaIdx = headers.indexOf('mesa');
  if (mesaIdx === -1) return ContentService.createTextOutput('Coluna mesa não encontrada');

  const targetRows = [];
  const rowNumbers = [];
  values.forEach((row, idx) => {
    if (String(row[mesaIdx]).trim() === String(mesa)) {
      targetRows.push(row);
      rowNumbers.push(idx + 2); // +2 because values array removed header and is 0-indexed
    }
  });

  if (targetRows.length === 0) {
    return ContentService.createTextOutput('Nenhum pedido para consolidar');
  }

  const consolidated = headers.map((_, colIdx) => {
    const columnValues = targetRows.map(r => String(r[colIdx]).trim()).filter(Boolean);
    const unique = Array.from(new Set(columnValues));
    if (unique.length === 0) return '';
    if (unique.length === 1) return unique[0];
    return unique.join(' | ');
  });

  // valor de mesa deve ser único
  consolidated[mesaIdx] = String(mesa);

  // Atualiza status das linhas originais para "fechar conta"
  const statusIdx = headers.indexOf('status');
  if (statusIdx !== -1) {
    rowNumbers.forEach(rn => {
      sheetMesas.getRange(rn, statusIdx + 1).setValue('fechar conta');
    });
    const statusValues = targetRows.map(r => String(r[statusIdx]).trim());
    const uniqueStatus = Array.from(new Set(statusValues));
    consolidated[statusIdx] = uniqueStatus.length === 1 ? uniqueStatus[0] : uniqueStatus.join(' | ');
  }

  sheetFechar.appendRow(consolidated);

  return ContentService.createTextOutput('Conta consolidada');
}
