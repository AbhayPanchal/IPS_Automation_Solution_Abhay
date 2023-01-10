function autoFillIPSTemplateGoogleDoc(e) {
  // declare variables from Google Sheet
  let investorName = e.values[1];
  let timeStamp = e.values[0];
  let emailID = e.values[2]

  // convert values from column 3 of Google Sheet to string
  const goals = e.values[4].toString();

  // declare goal variables
  let goal1 = ""
  let goal2 = ""
  let goal3 = ""

  //create an array and parse values from CSV format, store them in an array
  goalsArr = goals.split(',')
  if (goalsArr.length >= 1)
    goal1 = goalsArr[0]
  if (goalsArr.length >= 2)
    goal2 = goalsArr[1]
  if (goalsArr.length >= 3)
    goal3 = goalsArr[2]

  // Scenario1: assume value from column 6, 7, 8 of Google Sheet are supposed to be numeric
  // get values
  const response1 = e.values[5]
  const response2 = e.values[6]
  const response3 = e.values[7]

// convert them to numeric

// approaches: Use of Number() function, Use of parseInt()/ parseFloat() function, 
//use of unary plus operator(+) if in any case a number is not inputted by user then this will store NaN as a response 

let numericResponse1 = convertToNumeric(response1)
let numericResponse2 = convertToNumeric(response2)
let numericResponse3 = convertToNumeric(response3)

//grab the template file ID to modify
  const file = DriveApp.getFileById(templateID);

//grab the Google Drive folder ID to place the modied file into
  var folder = DriveApp.getFolderById(folderID)

//create a copy of the template file to modify, save using the naming conventions below
  var copy = file.makeCopy(investorName + ' Investment Policy', folder);

//modify the Google Drive file
  var doc = DocumentApp.openById(copy.getId());

  var body = doc.getBody();

  body.replaceText('%InvestorName%', investorName);
  body.replaceText('%Date%', timeStamp);

  body.replaceText('%Goal1%', goal1.trim())
  body.replaceText('%Goal2%', goal2.trim())
  body.replaceText('%Goal3%', goal3.trim())

  // replace the user response to numeric value or do the further calculation needed with these numeric values  
  body.replaceText('%Response1%', numericResponse1)
  body.replaceText('%Response2%', numericResponse2)
  body.replaceText('%Response3%', numericResponse3)

  doc.saveAndClose();

//find the file that was just modified, convert to PDF, attach to e-mail, send e-mail
  var attach = DriveApp.getFileById(copy.getId());
  var pdfattach = attach.getAs(MimeType.PDF);
  MailApp.sendEmail(emailID, subject, emailBody, { attachments: [pdfattach] });
}

//Function/Method to convert value into numeric value
function convertToNumeric(value) {
    return Number(value)
}