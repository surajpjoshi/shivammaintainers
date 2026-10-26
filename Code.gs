/**
 * SHIVAM website enquiry receiver.
 * Configure values under Apps Script > Project Settings > Script Properties:
 * NOTIFY_EMAIL = email address to receive enquiries
 * TELEGRAM_BOT_TOKEN = token from BotFather
 * TELEGRAM_CHAT_ID = your Telegram chat/group ID
 * SHEET_ID = Google spreadsheet ID
 */
function doPost(e) {
  try {
    var p = (e && e.parameter) ? e.parameter : {};
    var name = clean_(p.name, 120);
    var phone = clean_(p.phone, 30);
    var email = clean_(p.email, 160);
    var service = clean_(p.service, 120);
    var location = clean_(p.location, 250);
    var message = clean_(p.message, 2000);
    var consent = clean_(p.consent, 10);

    if (!name || !phone || !service || !location || consent !== 'yes') {
      return output_({ok:false, message:'Required fields are missing.'});
    }

    var props = PropertiesService.getScriptProperties();
    var sheetId = props.getProperty('SHEET_ID');
    var notifyEmail = props.getProperty('NOTIFY_EMAIL');
    var botToken = props.getProperty('TELEGRAM_BOT_TOKEN');
    var chatId = props.getProperty('TELEGRAM_CHAT_ID');

    if (!sheetId) throw new Error('Missing SHEET_ID script property.');
    var ss = SpreadsheetApp.openById(sheetId);
    var sheet = ss.getSheetByName('Enquiries') || ss.insertSheet('Enquiries');
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Received At', 'Name', 'Phone', 'Email', 'Service', 'Site Location', 'Message']);
      sheet.setFrozenRows(1);
    }
    sheet.appendRow([new Date(), safeCell_(name), safeCell_(phone), safeCell_(email),
                     safeCell_(service), safeCell_(location), safeCell_(message)]);

    var subject = 'New SHIVAM website enquiry — ' + service;
    var body = 'A new service enquiry was received from the SHIVAM website.\n\n' +
      'Name: ' + name + '\nPhone: ' + phone + '\nEmail: ' + email +
      '\nService: ' + service + '\nSite location: ' + location +
      '\nMessage: ' + (message || '(not provided)') +
      '\n\nPlease contact the customer to follow up.';
    if (notifyEmail) MailApp.sendEmail({to:notifyEmail, subject:subject, body:body});

    if (botToken && chatId) {
      var telegramText = '🔔 *New SHIVAM Service Enquiry*\n' +
        '*Name:* ' + tg_(name) + '\n*Phone:* ' + tg_(phone) +
        '\n*Email:* ' + tg_(email || 'Not provided') +
        '\n*Service:* ' + tg_(service) + '\n*Location:* ' + tg_(location) +
        '\n*Message:* ' + tg_(message || 'Not provided');
      var url = 'https://api.telegram.org/bot' + botToken + '/sendMessage';
      UrlFetchApp.fetch(url, {
        method: 'post',
        contentType: 'application/json',
        payload: JSON.stringify({chat_id:chatId, text:telegramText, parse_mode:'Markdown'}),
        muteHttpExceptions: true
      });
    }
    return output_({ok:true});
  } catch (err) {
    console.error(err);
    return output_({ok:false, message:'Unable to process enquiry.'});
  }
}

function clean_(value, maxLen) {
  return String(value || '').trim().replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').substring(0, maxLen);
}
// Prevent spreadsheet formula injection from submitted text.
function safeCell_(value) {
  var s = String(value || '');
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}
// Escape Telegram Markdown special characters.
function tg_(value) {
  return String(value || '').replace(/([_*`\[])/g, '\\$1');
}
function output_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
