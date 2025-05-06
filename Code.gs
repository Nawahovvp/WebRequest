function doGet(e) {
  try {
    // จัดการ CORS สำหรับ GET
    if (e.parameter.action === "getSheetData") {
      var output = ContentService.createTextOutput()
        .setContent(JSON.stringify(getSheetData()))
        .setMimeType(ContentService.MimeType.JSON);
      output.setHeader("Access-Control-Allow-Origin", "*");
      output.setHeader("Access-Control-Allow-Methods", "GET, POST");
      return output;
    }
    return HtmlService.createHtmlOutputFromFile('index')
      .setTitle('ระบบข้อมูลอะไหล่')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  } catch (error) {
    Logger.log("ข้อผิดพลาดใน doრ: " + error.message);
    var errorOutput = ContentService.createTextOutput()
      .setContent(JSON.stringify({ error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
    errorOutput.setHeader("Access-Control-Allow-Origin", "*");
    return errorOutput;
  }
}

function doPost(e) {
  try {
    if (e.parameter.action === "saveRequest") {
      var requestData = JSON.parse(e.postData.contents);
      var result = saveRequest(requestData);
      var output = ContentService.createTextOutput()
        .setContent(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
      output.setHeader("Access-Control-Allow-Origin", "*");
      output.setHeader("Access-Control-Allow-Methods", "GET, POST");
      return output;
    }
    throw new Error("แอคชันไม่ถูกต้อง");
  } catch (error) {
    Logger.log("ข้อผิดพลาดใน doPost: " + error.message);
    var errorOutput = ContentService.createTextOutput()
      .setContent(JSON.stringify({ error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
    errorOutput.setHeader("Access-Control-Allow-Origin", "*");
    return errorOutput;
  }
}

function getSheetData() {
  try {
    const ss = SpreadsheetApp.openById("1nbhLKxs7NldWo_y0s4qZ8rlpIfyyGkR_Dqq8INmhYlw");
    const mainSheet = ss.getSheetByName("MainSap");
    if (!mainSheet) throw new Error("ไม่พบ Sheet: MainSap");

    const dataRange = mainSheet.getDataRange();
    const data = dataRange.getValues();
    if (data.length <= 1) {
      Logger.log("ไม่มีข้อมูลในแผ่นงาน MainSap");
      return { main: [] };
    }

    const headers = data[0];
    const rows = [];

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const firstCol = row[0];

      if (firstCol === "" || firstCol === null) break;

      let rowData = {};
      headers.forEach((header, index) => {
        rowData[header] = row[index] || "";
      });
      rows.push(rowData);
    }

    Logger.log("ดึงข้อมูลจาก MainSap ได้ทั้งหมด: " + rows.length + " แถว");
    return { main: rows };
  } catch (error) {
    Logger.log("เกิดข้อผิดพลาดใน getSheetData: " + error.message);
    throw new Error(error.message);
  }
}

function saveRequest(requestData) {
  try {
    const ss = SpreadsheetApp.openById("1nbhLKxs7NldWo_y0s4qZ8rlpIfyyGkR_Dqq8INmhYlw");
    const requestSheet = ss.getSheetByName("Request");
    if (!requestSheet) throw new Error("ไม่พบ Sheet: Request");
    
    const expectedHeaders = ["Timestamp", "Material", "Material Description", "จำนวน", "รหัสพนักงาน", "ทีม", "เบอร์ติดต่อ", "CallNumber", "CallType"];
    const lastColumn = requestSheet.getLastColumn();
    let headers = requestSheet.getRange(1, 1, 1, Math.max(lastColumn, expectedHeaders.length)).getValues()[0];
    
    let headersUpdated = false;
    if (!headers.includes("CallNumber")) {
      const callNumberIndex = expectedHeaders.indexOf("CallNumber") + 1;
      if (callNumberIndex <= lastColumn) {
        headers[callNumberIndex - 1] = "CallNumber";
      } else {
        headers.push("CallNumber");
      }
      headersUpdated = true;
    }
    if (!headers.includes("CallType")) {
      const callTypeIndex = expectedHeaders.indexOf("CallType") + 1;
      if (callTypeIndex <= lastColumn) {
        headers[callTypeIndex - 1] = "CallType";
      } else {
        headers.push("CallType");
      }
      headersUpdated = true;
    }
    
    if (headersUpdated || headers.join() !== expectedHeaders.join()) {
      requestSheet.getRange(1, 1, 1, expectedHeaders.length).setValues([expectedHeaders]);
    }
    
    Logger.log("ได้รับ requestData: " + JSON.stringify(requestData));
    
    const timestamp = new Date();
    const rowData = [
      timestamp,
      String(requestData.material || ""),
      String(requestData.description || ""),
      String(requestData.quantity || ""),
      String(requestData.employeeId || ""),
      String(requestData.team || ""),
      String("'" + (requestData.contact || "")),
      String(requestData.callNumber || ""),
      String(requestData.callType || "")
    ];
    
    const lastRow = requestSheet.getLastRow() + 1;
    requestSheet.getRange(lastRow, 1, 1, rowData.length).setNumberFormat("@");
    
    requestSheet.appendRow(rowData);
    
    Logger.log("บันทึกคำขอ: " + JSON.stringify(rowData));
    return { success: true, message: "บันทึกคำขออะไหล่เรียบร้อยใน Request" };
  } catch (error) {
    Logger.log("ข้อผิดพลาดใน saveRequest: " + error.message);
    throw new Error(error.message);
  }
}
