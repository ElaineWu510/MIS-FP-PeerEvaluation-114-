// ════════════════════════════════════════════════════════════
//  MIS Peer Evaluation — Google Apps Script
//  Paste this entire file into Extensions → Apps Script
// ════════════════════════════════════════════════════════════

const SPREADSHEET_ID  = 'YOUR_SPREADSHEET_ID_HERE';
const SHEET_SCORES    = 'PeerScores';
const SHEET_SUMMARIES = 'PeerSummaries';
const SHEET_TEACHER   = 'TeacherScores';

// ── POST: receive submissions ────────────────────────────────
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss   = SpreadsheetApp.openById(SPREADSHEET_ID);

    if (data.type === 'teacher') {
      saveTeacherScores(ss, data);
    } else {
      savePeerScores(ss, data);
      savePeerSummaries(ss, data);
    }

    return jsonResponse({ status: 'success' });
  } catch (err) {
    return jsonResponse({ status: 'error', message: err.message });
  }
}

// ── GET: return all data to admin dashboard ──────────────────
function doGet(e) {
  try {
    const ss     = SpreadsheetApp.openById(SPREADSHEET_ID);
    const action = e.parameter.action;

    if (action === 'getData') {
      const peerSubmissions = readPeerSubmissions(ss);
      const teacherScores   = readTeacherScores(ss);
      return jsonResponse({ peerSubmissions, teacherScores });
    }
    return jsonResponse({ status: 'ok' });
  } catch (err) {
    return jsonResponse({ status: 'error', message: err.message });
  }
}

// ── SAVE PEER SCORES ─────────────────────────────────────────
function savePeerScores(ss, data) {
  let sheet = ss.getSheetByName(SHEET_SCORES);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_SCORES);
    const h = ['Timestamp','Student ID','Student Name','My Group','Evaluated Group',
      'Problem ID (20%)','Solution Eff. (20%)','Solution Feas. (15%)','IS Design (15%)',
      'Competitiveness (10%)','Q&A (10%)','Pres. Quality (5%)','Time Mgmt (5%)','Weighted Total'];
    sheet.getRange(1,1,1,h.length).setValues([h]).setFontWeight('bold')
      .setBackground('#8B2635').setFontColor('white');
    sheet.setFrozenRows(1);
  }
  const rows = data.evaluations.map(ev => [
    data.timestamp, data.studentId, data.studentName, data.myGroup, ev.group,
    ev.scores.pi||0, ev.scores.se||0, ev.scores.sf||0, ev.scores.isd||0,
    ev.scores.ca||0, ev.scores.qa||0, ev.scores.pq||0, ev.scores.tm||0, ev.total
  ]);
  sheet.getRange(sheet.getLastRow()+1, 1, rows.length, rows[0].length).setValues(rows);
}

// ── SAVE PEER SUMMARIES ──────────────────────────────────────
function savePeerSummaries(ss, data) {
  let sheet = ss.getSheetByName(SHEET_SUMMARIES);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_SUMMARIES);
    const h = ['Timestamp','Student ID','Student Name','My Group','Evaluated Group',
      'Problem Identified','Solution Proposed','Strength','Suggestion','Overall Comments'];
    sheet.getRange(1,1,1,h.length).setValues([h]).setFontWeight('bold')
      .setBackground('#8B2635').setFontColor('white');
    sheet.setFrozenRows(1);
    [6,7,8,9,10].forEach(col => sheet.setColumnWidth(col, 220));
  }
  const rows = data.evaluations.map(ev => [
    data.timestamp, data.studentId, data.studentName, data.myGroup, ev.group,
    ev.summary?.problem||'', ev.summary?.solution||'',
    ev.summary?.strength||'', ev.summary?.improve||'', ev.summary?.comment||''
  ]);
  sheet.getRange(sheet.getLastRow()+1, 1, rows.length, rows[0].length).setValues(rows);
}

// ── SAVE TEACHER SCORES ──────────────────────────────────────
function saveTeacherScores(ss, data) {
  let sheet = ss.getSheetByName(SHEET_TEACHER);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_TEACHER);
  } else {
    sheet.clearContents();  // overwrite (teacher can resubmit)
  }
  const h = ['Group','Problem ID (20%)','Solution Eff. (20%)','Solution Feas. (15%)',
    'IS Design (15%)','Competitiveness (10%)','Q&A (10%)','Pres. Quality (5%)',
    'Time Mgmt (5%)','Weighted Total','Instructor Notes','Submitted At'];
  sheet.getRange(1,1,1,h.length).setValues([h]).setFontWeight('bold')
    .setBackground('#1a1a1a').setFontColor('white');
  sheet.setFrozenRows(1);
  sheet.setColumnWidth(11, 300);

  const rows = data.evaluations.map(ev => [
    'Group '+ev.group,
    ev.scores.pi||0, ev.scores.se||0, ev.scores.sf||0, ev.scores.isd||0,
    ev.scores.ca||0, ev.scores.qa||0, ev.scores.pq||0, ev.scores.tm||0,
    ev.total, ev.notes||'', data.timestamp
  ]);
  sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
}

// ── READ PEER SUBMISSIONS ────────────────────────────────────
function readPeerSubmissions(ss) {
  const sheet = ss.getSheetByName(SHEET_SCORES);
  const sumSheet = ss.getSheetByName(SHEET_SUMMARIES);
  if (!sheet) return [];

  const scoreRows   = sheet.getDataRange().getValues().slice(1);   // skip header
  const summaryRows = sumSheet ? sumSheet.getDataRange().getValues().slice(1) : [];

  // Group by studentId
  const map = {};
  scoreRows.forEach(r => {
    const [ts, sid, sname, myGroup, evalGroup,
           pi, se, sf, isd, ca, qa, pq, tm, total] = r;
    if (!sid) return;
    if (!map[sid]) map[sid] = { studentId:String(sid), studentName:sname, myGroup:parseInt(myGroup), evaluations:[], timestamp:ts };
    map[sid].evaluations.push({
      group: parseInt(evalGroup),
      scores: {pi,se,sf,isd,ca,qa,pq,tm},
      total: parseInt(total),
      summary: {}
    });
  });

  // Attach summaries
  summaryRows.forEach(r => {
    const [, sid, , , evalGroup, problem, solution, strength, improve, comment] = r;
    if (!sid || !map[sid]) return;
    const ev = map[sid].evaluations.find(e => e.group === parseInt(evalGroup));
    if (ev) ev.summary = { problem, solution, strength, improve, comment };
  });

  return Object.values(map);
}

// ── READ TEACHER SCORES ──────────────────────────────────────
function readTeacherScores(ss) {
  const sheet = ss.getSheetByName(SHEET_TEACHER);
  if (!sheet || sheet.getLastRow() < 2) return null;
  const rows = sheet.getDataRange().getValues().slice(1);
  const evaluations = rows.map(r => ({
    group:    parseInt(String(r[0]).replace('Group ','')),
    scores:   {pi:r[1],se:r[2],sf:r[3],isd:r[4],ca:r[5],qa:r[6],pq:r[7],tm:r[8]},
    total:    parseInt(r[9]),
    notes:    r[10]||''
  }));
  return { evaluations };
}

// ── HELPER ───────────────────────────────────────────────────
function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
