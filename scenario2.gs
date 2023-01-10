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

  // Scenario2: assume column 9 has 3 responses with in it
  const responses = e.values[8].toString();

  // declare userResponse variables
  let userResponse1 = ""
  let userResponse2 = ""
  let userResponse3 = ""

  // convert them to numeric
  // approaches: Use of Number() function, Use of parseInt()/ parseFloat() function, 
  //use of unary plus operator(+) if in any case a number is not inputted by user then this will store NaN as a response 

  //create an array and parse values from CSV format, store them in an array
  userResponseArray = responses.split(',')
  if (userResponseArray.length >= 1)
    userResponse1 = Number(userResponseArray[0])
  if (userResponseArray.length >= 2)
    userResponse2 = Number(userResponseArray[1])
  if (userResponseArray.length >= 3)
    userResponse3 = Number(userResponseArray[2])

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
  body.replaceText('%Response1%', userResponse1);
  body.replaceText('%Response2%', userResponse2);
  body.replaceText('%Response3%', userResponse3);

  doc.saveAndClose();

//find the file that was just modified, convert to PDF, attach to e-mail, send e-mail
  var attach = DriveApp.getFileById(copy.getId());
  var pdfattach = attach.getAs(MimeType.PDF);
  MailApp.sendEmail(emailID, subject, emailBody, { attachments: [pdfattach] });
}
