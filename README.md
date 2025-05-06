Spare Parts Request System
This project is a Google Apps Script web application for managing spare parts requests from a warehouse. It allows users to search for spare parts, view today's requests, view all request history, and submit new requests.
Files

Code.gs: Contains the server-side Google Apps Script code for handling GET and POST requests, fetching data from Google Sheets, and saving request data.
index.html: The client-side HTML, CSS, and JavaScript for the web interface, built with Tailwind CSS and Google Fonts.

Setup Instructions

Create a Google Apps Script Project:

Go to script.google.com.
Create a new project.
Copy and paste the contents of   - Copy and paste the contents ofCode.gsinto a new script file (e.g.,Code.gs`).
Create a new HTML file named index.html and paste the contents of index.html.
Save the project.


Set Up Google Sheets:

Create a Google Sheet with two sheets: MainSap and Request.
In MainSap, add columns for Material, Description, Unrestricted, วิภาวดี, Rebuilt, หมายเหตุ, Product, UrlWeb, and OCRTAXT.
In Request, add columns for Timestamp, Material, Material Description, จำนวน, รหัสพนักงาน, ทีม, เบอร์ติดต่อ, CallNumber, and CallType.
Note the Spreadsheet ID (from the URL) and update the SpreadsheetApp.openById call in Code.gs with this ID.


Deploy the Web App:

In the Apps Script editor, click Deploy > New deployment.
Select Web app, set Execute as: Me, and Who has access: Anyone.
Click Deploy and copy the web app URL.
Test the app by opening the URL in a browser.


Optional: Sync with GitHub:

Install clasp (npm install -g @google/clasp).
Log in with clasp login.
Push the files to Apps Script with clasp push.
To sync with GitHub, commit and push the files to this repository.



Usage

Search Spare Parts: Use the search bar in the "ค้นหารายการเบิก" tab to find spare parts.
View Requests: Check today's requests in the "รายการเบิกวันนี้" tab or all requests in the "ประวัติการขอเบิกทั้งหมด" tab (loaded via iframes from external URLs).
Submit Request: Click the "เบิกนวนคร" button next to a spare part, fill out the form, and submit. The request is saved to the Request sheet.

Notes

The app uses Tailwind CSS (v2.2.19) and Google Fonts (Itim and Prompt).
The iframes load external URLs (https://chief-abaft-sidecar.glitch.me/ and https://octagonal-hallowed-sneeze.glitch.me/); ensure these are accessible.
Input validation ensures:
Employee ID starts with '7' and is 7 characters long.
Contact number is 10 digits.
Call Number starts with '2' (11 digits) or '5' (7 digits, numeric).
Call Type is one of 'I', 'P', 'Q', or 'R'.


Local storage is used to save input history (employee ID, team, contact, call number) for autocompletion.

Troubleshooting

If the web app fails to load, check the Apps Script logs (View > Logs).
Ensure the Google Sheet ID in Code.gs is correct.
Verify that the MainSap and Request sheets exist with the correct column headers.
For iframe issues, confirm the external URLs are online and accessible.

License
MIT License. See LICENSE for details.
