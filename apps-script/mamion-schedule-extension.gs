/**
 * MamiOn schedule extension for the existing Google Apps Script endpoint.
 *
 * How to integrate:
 * 1. Paste these helpers into the Apps Script project that currently handles
 *    action=submit and action=count.
 * 2. Call ensureScheduleColumns_(sheet) before reading/writing headers.
 * 3. In the existing submit handler, call enrichScheduleFields_(data, sheet)
 *    before appending the applicant row.
 * 4. Add these routes to doGet(e):
 *    if (e.parameter.action === 'schedule') return handleScheduleSubmit_(e);
 *    if (e.parameter.action === 'scheduleInfo') return handleScheduleInfo_(e);
 *    if (e.parameter.action === 'alimtalkResult') return handleAlimtalkResult_(e);
 *
 * Existing rows and column order are preserved. Missing schedule columns are
 * appended to the end of the first row only.
 */

var MAMION_SITE_ORIGIN = 'https://www.mamion.kr';
var MAMION_SUBMIT_SECRET_PROPERTY = 'MAMION_SUBMIT_SECRET';

var SCHEDULE_COLUMNS = [
  '신청토큰',
  '상담일시 입력 링크',
  '상담 가능 일시',
  '희망 상담 장소',
  '기타 요청사항',
  '일정 입력 완료 여부',
  '일정 입력 시간',
];

var ALIMTALK_COLUMNS = [
  '알림톡 발송 여부',
  '알림톡 발송 시간',
  '알림톡 발송 결과',
  '알림톡 실패 사유',
];

function jsonp_(callback, payload) {
  var body = callback + '(' + JSON.stringify(payload) + ')';
  return ContentService.createTextOutput(body).setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function getActiveMamionSheet_() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
}

function getHeaders_(sheet) {
  var lastColumn = Math.max(sheet.getLastColumn(), 1);
  return sheet.getRange(1, 1, 1, lastColumn).getValues()[0].map(function (value) {
    return String(value || '').trim();
  });
}

function ensureScheduleColumns_(sheet) {
  var headers = getHeaders_(sheet);
  SCHEDULE_COLUMNS.forEach(function (columnName) {
    if (headers.indexOf(columnName) === -1) {
      sheet.getRange(1, headers.length + 1).setValue(columnName);
      headers.push(columnName);
    }
  });
  return headers;
}

function ensureAlimtalkColumns_(sheet) {
  var headers = getHeaders_(sheet);
  ALIMTALK_COLUMNS.forEach(function (columnName) {
    if (headers.indexOf(columnName) === -1) {
      sheet.getRange(1, headers.length + 1).setValue(columnName);
      headers.push(columnName);
    }
  });
  return headers;
}

function ensureMamionColumns_(sheet) {
  ensureScheduleColumns_(sheet);
  return ensureAlimtalkColumns_(sheet);
}

function createScheduleToken_() {
  return Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, '').slice(0, 16);
}

function isSubmitSecretValid_(data) {
  var expectedSecret = PropertiesService.getScriptProperties().getProperty(MAMION_SUBMIT_SECRET_PROPERTY);
  if (!expectedSecret) return true;
  return String(data.submitSecret || '') === String(expectedSecret);
}

function findRowByHeaderValue_(sheet, headerName, value) {
  var headers = ensureMamionColumns_(sheet);
  var columnIndex = headers.indexOf(headerName) + 1;
  if (columnIndex < 1 || !value) return -1;

  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return -1;

  var values = sheet.getRange(2, columnIndex, lastRow - 1, 1).getValues();
  for (var i = 0; i < values.length; i += 1) {
    if (String(values[i][0] || '').trim() === String(value).trim()) return i + 2;
  }
  return -1;
}

function createUniqueScheduleToken_(sheet) {
  var token = createScheduleToken_();
  while (findRowByHeaderValue_(sheet, '신청토큰', token) !== -1) {
    token = createScheduleToken_();
  }
  return token;
}

function enrichScheduleFields_(data, sheet) {
  ensureMamionColumns_(sheet);
  var token = data['신청토큰'] || data.applicationToken || createUniqueScheduleToken_(sheet);
  var link = data['상담일시 입력 링크'] || data.scheduleLink || (MAMION_SITE_ORIGIN + '/schedule?token=' + encodeURIComponent(token));

  data['신청토큰'] = token;
  data['상담일시 입력 링크'] = link;
  data.applicationToken = token;
  data.scheduleLink = link;
  return data;
}

function setRowValuesByHeader_(sheet, rowIndex, valuesByHeader) {
  var headers = ensureMamionColumns_(sheet);
  Object.keys(valuesByHeader).forEach(function (headerName) {
    var columnIndex = headers.indexOf(headerName) + 1;
    if (columnIndex > 0) sheet.getRange(rowIndex, columnIndex).setValue(valuesByHeader[headerName]);
  });
}

function getRowValueByHeader_(sheet, rowIndex, headers, headerName) {
  var columnIndex = headers.indexOf(headerName) + 1;
  if (columnIndex > 0) return sheet.getRange(rowIndex, columnIndex).getValue();
  return '';
}

function handleScheduleInfo_(e) {
  var callback = e.parameter.callback || 'callback';
  var data = {};
  try {
    data = JSON.parse(e.parameter.data || '{}');
  } catch (error) {
    return jsonp_(callback, { result: 'error', message: '잘못된 요청입니다.' });
  }

  var token = String(data.token || '').trim();
  if (!token) return jsonp_(callback, { result: 'error', message: '잘못된 접근입니다.' });

  var sheet = getActiveMamionSheet_();
  var headers = ensureMamionColumns_(sheet);
  var rowIndex = findRowByHeaderValue_(sheet, '신청토큰', token);
  if (rowIndex === -1) return jsonp_(callback, { result: 'not_found', message: '신청 정보를 찾을 수 없습니다.' });

  return jsonp_(callback, {
    result: 'success',
    name: String(getRowValueByHeader_(sheet, rowIndex, headers, '이름') || sheet.getRange(rowIndex, 2).getValue() || '').trim(),
  });
}

function handleScheduleSubmit_(e) {
  var callback = e.parameter.callback || 'callback';
  var data = {};
  try {
    data = JSON.parse(e.parameter.data || '{}');
  } catch (error) {
    return jsonp_(callback, { result: 'error', message: '잘못된 요청입니다.' });
  }

  var token = String(data.token || '').trim();
  if (!token) return jsonp_(callback, { result: 'error', message: '잘못된 접근입니다.' });

  var sheet = getActiveMamionSheet_();
  ensureMamionColumns_(sheet);
  var rowIndex = findRowByHeaderValue_(sheet, '신청토큰', token);
  if (rowIndex === -1) return jsonp_(callback, { result: 'not_found', message: '신청 정보를 찾을 수 없습니다.' });

  setRowValuesByHeader_(sheet, rowIndex, {
    '상담 가능 일시': data['상담 가능 일시'] || data.availableAt || '',
    '희망 상담 장소': data['희망 상담 장소'] || data.preferredPlace || '',
    '기타 요청사항': data['기타 요청사항'] || data.request || '',
    '일정 입력 완료 여부': '완료',
    '일정 입력 시간': new Date(),
  });

  return jsonp_(callback, { result: 'success', message: '상담 일정이 정상적으로 접수되었습니다.' });
}

function handleAlimtalkResult_(e) {
  var callback = e.parameter.callback || 'callback';
  var data = {};
  try {
    data = JSON.parse(e.parameter.data || '{}');
  } catch (error) {
    return jsonp_(callback, { result: 'error', message: '잘못된 요청입니다.' });
  }

  var token = String(data.token || '').trim();
  if (!token) return jsonp_(callback, { result: 'error', message: '잘못된 접근입니다.' });

  var sheet = getActiveMamionSheet_();
  ensureMamionColumns_(sheet);
  var rowIndex = findRowByHeaderValue_(sheet, '신청토큰', token);
  if (rowIndex === -1) return jsonp_(callback, { result: 'not_found', message: '신청 정보를 찾을 수 없습니다.' });

  setRowValuesByHeader_(sheet, rowIndex, {
    '알림톡 발송 여부': data['알림톡 발송 여부'] || '',
    '알림톡 발송 시간': data['알림톡 발송 시간'] || new Date(),
    '알림톡 발송 결과': data['알림톡 발송 결과'] || '',
    '알림톡 실패 사유': data['알림톡 실패 사유'] || '',
  });

  return jsonp_(callback, { result: 'success', message: '알림톡 발송 결과가 저장되었습니다.' });
}
