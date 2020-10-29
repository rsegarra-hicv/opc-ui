/*
 * JavaScript DL/ID PDF417 Info Parser - AAMVA
 *
 * Copyright (c) 2019 Irving J. Toledo / HICV
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 * https://github.com/[PENDING]
 *
 * Version: 1.0.0
 *
 */

var aamvaVersionNumber = 0;
var aamvaCountryName = "";
var documentScannedStr = "";

var viewData = { IdDataElement: [] };

// Mapping of Element IDs to common field names
var idElements =
  '{ "IdDataElement": [' +
  '{ "elementID" : "DAQ", "dataElement" : "Customer Number", "type" : "string", "converToType" : "string", "fieldTo" : "inputDocumentID"  },' +
  '{ "elementID" : "DCS", "dataElement" : "Family Name", "type" : "string", "converToType" : "string" , "fieldTo" : "inputLastName"  },' +
  '{ "elementID" : "DDE", "dataElement" : "Family Name Truncation", "type" : "string", "converToType" : "string" , "fieldTo" : ""  },' +
  '{ "elementID" : "DAC", "dataElement" : "First Names", "type" : "string", "converToType" : "string" , "fieldTo" : "inputFirstName"  },' +
  '{ "elementID" : "DDF", "dataElement" : "First Names Truncation", "type" : "string", "converToType" : "string" , "fieldTo" : ""  },' +
  '{ "elementID" : "DAD", "dataElement" : "Middle Names", "type" : "string", "converToType" : "string" , "fieldTo" : "inputMiddleName"  },' +
  '{ "elementID" : "DDG", "dataElement" : "Middle Names Truncation", "type" : "string", "converToType" : "string" , "fieldTo" : ""  },' +
  '{ "elementID" : "DAA", "dataElement" : "Full Name", "type" : "string", "converToType" : "string" , "fieldTo" : "inputFullName"  },' +
  '{ "elementID" : "DCA", "dataElement" : "Driver License Class Code (v2)", "type" : "string", "converToType" : "string" , "fieldTo" : "inputDlClassType"  },' +
  '{ "elementID" : "DCB", "dataElement" : "Jurisdiction Specific Restrictions", "type" : "string", "converToType" : "string" , "fieldTo" : ""  },' +
  '{ "elementID" : "DCD", "dataElement" : "Jurisdiction Specific Endorsements", "type" : "string", "converToType" : "string" , "fieldTo" : ""  },' +
  '{ "elementID" : "DBD", "dataElement" : "Issue Date", "type" : "string", "converToType" : "date" , "fieldTo" : "inputIssueDate"  },' +
  '{ "elementID" : "DBB", "dataElement" : "Date of Birth", "type" : "string", "converToType" : "date" , "fieldTo" : "inputBirthdate"  },' +
  '{ "elementID" : "DBA", "dataElement" : "Expiration Date", "type" : "string", "converToType" : "date" , "fieldTo" : "inputExpirationDate"  },' +
  '{ "elementID" : "DCI", "dataElement" : "Place of Birth", "type" : "string", "converToType" : "date" , "fieldTo" : "inputPlaceOfBirth"  },' +
  '{ "elementID" : "DBC", "dataElement" : "Sex", "type" : "int", "converToType" : "sex" , "fieldTo" : "inputGender"  },' +
  '{ "elementID" : "DAU", "dataElement" : "Height", "type" : "string", "converToType" : "height" , "fieldTo" : "inputHeight"  },' +
  '{ "elementID" : "DAY", "dataElement" : "Eyes", "type" : "string", "converToType" : "eyeColor" , "fieldTo" : "inputEyes"  },' +
  '{ "elementID" : "DAZ", "dataElement" : "Hair", "type" : "string", "converToType" : "hairColor" , "fieldTo" : "inputHair"  },' +
  '{ "elementID" : "DCL", "dataElement" : "Ethnicity", "type" : "string", "converToType" : "color" , "fieldTo" : "inputEthnicity"  },' +
  '{ "elementID" : "DCE", "dataElement" : "Weight Range", "type" : "string", "converToType" : "color" , "fieldTo" : "inputWeight"  },' +
  '{ "elementID" : "DAG", "dataElement" : "Address", "type" : "string", "converToType" : "string" , "fieldTo" : "inputAddress"  },' +
  '{ "elementID" : "DAI", "dataElement" : "City", "type" : "string", "converToType" : "string" , "fieldTo" : "inputCity"  },' +
  '{ "elementID" : "DAJ", "dataElement" : "State", "type" : "string", "converToType" : "string" , "fieldTo" : "inputState"  },' +
  '{ "elementID" : "DAK", "dataElement" : "Zip", "type" : "string", "converToType" : "postalCode" , "fieldTo" : "inputZip"  },' +
  '{ "elementID" : "DCF", "dataElement" : "Document Discriminator", "type" : "string", "converToType" : "string" , "fieldTo" : ""  },' +
  '{ "elementID" : "DCG", "dataElement" : "Country/territory of issuance", "type" : "string", "converToType" : "string" , "fieldTo" : ""  },' +
  '{ "elementID" : "DCU", "dataElement" : "Suffix", "type" : "string", "converToType" : "string" , "fieldTo" : ""  },' +
  '{ "elementID" : "DCK", "dataElement" : "Inventory Control Number", "type" : "string", "converToType" : "string" , "fieldTo" : ""  },' +
  '{ "elementID" : "DDA", "dataElement" : "Compliance Type", "type" : "string", "converToType" : "string" , "fieldTo" : ""  },' +
  '{ "elementID" : "DDB", "dataElement" : "Card Revision Date", "type" : "string", "converToType" : "string" , "fieldTo" : ""  },' +
  '{ "elementID" : "DDC", "dataElement" : "HazMat Endorsement Expiry Date", "type" : "string", "converToType" : "string" , "fieldTo" : ""  },' +
  '{ "elementID" : "DDD", "dataElement" : "Limited Duration Document Indicator", "type" : "string", "converToType" : "string" , "fieldTo" : ""  },' +
  '{ "elementID" : "DDK", "dataElement" : "Organ Donor", "int" : "string", "converToType" : "boolean" , "fieldTo" : "inputOrganDonor"  },' +
  '{ "elementID" : "DDL", "dataElement" : "Veteran", "int" : "string", "converToType" : "boolean" , "fieldTo" : "inputVeteran"  },' +
  '{ "elementID" : "DAR", "dataElement" : "Driver License Class Code", "type" : "string", "converToType" : "string" , "fieldTo" : "inputDlClassType"  },' +
  '{ "elementID" : "DAS", "dataElement" : "Driver License Restriction Code", "type" : "string", "converToType" : "string" , "fieldTo" : ""  },' +
  '{ "elementID" : "DAT", "dataElement" : "Driver License Endorsement Code", "type" : "string", "converToType" : "string" , "fieldTo" : ""  },' +
  '{ "elementID" : "ZFZFA", "dataElement" : "Replaced Date", "type" : "string", "converToType" : "string" , "fieldTo" : ""  },' +
  '{ "elementID" : "ZFB", "dataElement" : "Special Restrictions", "type" : "string", "converToType" : "string" , "fieldTo" : ""  },' +
  '{ "elementID" : "ZFC", "dataElement" : "Safe Driver Indicator", "type" : "string", "converToType" : "string" , "fieldTo" : ""  },' +
  '{ "elementID" : "ZFD", "dataElement" : "Sexual Predator", "type" : "string", "converToType" : "string" , "fieldTo" : ""  },' +
  '{ "elementID" : "ZFE", "dataElement" : "Sex Offender Statute", "type" : "string", "converToType" : "string" , "fieldTo" : ""  },' +
  '{ "elementID" : "ZFF", "dataElement" : "Insulin Dependent", "type" : "string", "converToType" : "string" , "fieldTo" : ""  },' +
  '{ "elementID" : "ZFG", "dataElement" : "Developmental Disability", "type" : "string", "converToType" : "string" , "fieldTo" : ""  },' +
  '{ "elementID" : "ZFH", "dataElement" : "Hearing Impaired", "type" : "string", "converToType" : "string" , "fieldTo" : ""  },' +
  '{ "elementID" : "ZFI", "dataElement" : "Fish & Wildlife Designations", "type" : "string", "converToType" : "string" , "fieldTo" : ""  },' +
  '{ "elementID" : "ZFJ", "dataElement" : "Customer Number", "type" : "string", "converToType" : "string" , "fieldTo" : ""  },' +
  '{ "elementID" : "ZFK", "dataElement" : "Reserved for Future Use", "type" : "string", "converToType" : "string" , "fieldTo" : "" }' +
  "]}";

$(document).ready(function () {
  $("#submit").click(function () {
    // $('#raw').text($('#data').val());
    // documentScannedStr = $('#raw').text($('#data').val());
    documentScannedStr = $("#data").val();
    aamvaVersionNumber = 0;
    aamvaCountryName = "";

    if (documentScannedStr != "") {
      GetCompliance();
      GetDocumentInfoFromIINandSubType();

      // Converting JSON idElements object to JS object
      var objElements = JSON.parse(idElements);

      // Get all the values from the resulting JSON object
      readJsonValues(objElements);

      parseJsonInFields(viewData);
    }
  });
}); //end of Doc.ready

function parseJsonInFields(obj) {
  for (var k in obj) {
    if (obj[k] instanceof Object) {
      for (var i in obj[k]) {
        pushValues(obj[k]);
      }
    }
  }
}

function pushValues(obj) {
  var strFullName = "";
  var missingNameInfo = 0;

  for (var i = 0; i < obj.length; i++) {
    if (obj[i].elementID === "DAA" && obj[i].value == "") {
      obj[i].value = GetFullName(obj); // "FULL NAME TEST";
      break;
    }
    if (
      obj[i].elementID === "DAA" &&
      obj[i].value != "" &&
      obj[i].value.length > 3
    ) {
      strFullName = obj[i].value;
      break;
    }
  }

  if (strFullName != "") {
    fixMissingNames(obj, strFullName);
  }

  for (var k in obj) {
    var strElementID = obj[k].elementID;
    var strDestinationField = "#" + obj[k].fieldName;
    var strDestinationValue = obj[k].value;

    if (strDestinationField != "#") {
      $(strDestinationField).val(strDestinationValue);
    }
  }
}

function fixMissingNames(obj, strFullName) {
  var strFirstName = "";
  var strLastName = "";
  var strMiddleName = "";

  var fullNameArray = strFullName.split(",");
  for (var i = 0; i < obj.length; i++) {
    if (obj[i].elementID == "DCS" && obj[i].value == "") {
      obj[i].value = fullNameArray[0]; // last name
    }
    if (obj[i].elementID == "DAC" && obj[i].value == "") {
      obj[i].value = fullNameArray[1]; // last name
    }
    if (obj[i].elementID == "DAD" && obj[i].value == "") {
      obj[i].value = fullNameArray[2]; // last name
    }
  }
}

function GetFullName(obj) {
  var strFirstName = "";
  var strLastName = "";
  var strMiddleName = "";

  for (var i = 0; i < obj.length; i++) {
    if (obj[i].elementID == "DCS" && obj[i].value != "") {
      strLastName = obj[i].value;
    }
    if (obj[i].elementID == "DAC" && obj[i].value != "") {
      strFirstName = obj[i].value;
    }
    if (obj[i].elementID == "DAD" && obj[i].value != "") {
      strMiddleName = obj[i].value;
    }
  }
  return strLastName + ", " + strFirstName + ", " + strMiddleName;
}

function readJsonValues(obj) {
  for (var k in obj) {
    if (obj[k] instanceof Object) {
      findIdValues(obj[k]);
    }
  }
}

function findIdValues(obj) {
  var search_term = "";
  var strRegexCodes = "";
  var destinationField = "";
  var converToType = "";
  var total_serach_items = Object.keys(obj).length;
  var total_serach_items_counter = 0;
  var dataResultsStr = "";

  for (var i in obj) {
    strRegexCodes += obj[i].elementID;
    total_serach_items_counter++;
    if (total_serach_items_counter < total_serach_items) {
      strRegexCodes += "|";
    }
  }
  regexCodes = new RegExp(strRegexCodes);

  for (var e in obj) {
    search_term = obj[e].elementID;
    search_term_description = obj[e].dataElement;
    destinationField = "#" + obj[e].fieldTo;
    converToType = obj[e].converToType;

    var idString = documentScannedStr;
    var index = idString.search(search_term); // look in origin string for it
    var pre = idString.substr(0, index + search_term.length); // split all data before its term + term
    var post = idString.substr(index + search_term.length, idString.length); // split all data after term
    var index2 = post.search(regexCodes);

    if (index >= 0) {
      var extractedValue = post.slice(0, index2).trim();

      switch (converToType) {
        case "date":
          extractedValue = convertToDate(extractedValue);
          break;
        case "sex":
          switch (parseInt(extractedValue)) {
            case 1:
              extractedValue = "M";
              break;
            case 2:
              extractedValue = "F";
              break;
            case 9:
              extractedValue = "O";
              break;
          }
          break;
        case "boolean":
          switch (parseInt(extractedValue)) {
            case 0:
              extractedValue = "N";
              break;
            case 1:
              extractedValue = "Y";
              break;
          }
          break;
        case "height":
          extractedValue = convertToHeight(extractedValue);
          break;
        case "eyeColor":
          switch (extractedValue) {
            case "BLK":
              extractedValue = "Black";
              break;
            case "BLU":
              extractedValue = "Blue";
              break;
            case "BRO":
              extractedValue = "Brown";
              break;
            case "DIC":
              extractedValue = "Dichromatic";
              break;
            case "GRY":
              extractedValue = "Gray";
              break;
            case "GRN":
              extractedValue = "Green";
              break;
            case "HAZ":
              extractedValue = "Hazel";
              break;
            case "MAR":
              extractedValue = "Maroon";
              break;
            case "PNK":
              extractedValue = "Pink";
              break;
            default:
              extractedValue = "";
              break;
          }
          break;
        case "hairColor":
          switch (extractedValue) {
            case "BAL":
              extractedValue = "Bald";
              break;
            case "BLK":
              extractedValue = "Black";
              break;
            case "BLN":
              extractedValue = "Blond";
              break;
            case "BRO":
              extractedValue = "Brown";
              break;
            case "GRY":
              extractedValue = "Gray";
              break;
            case "RED":
              extractedValue = "Red/Auburn";
              break;
            case "SDY":
              extractedValue = "Sandy";
              break;
            case "WHI":
              extractedValue = "White";
              break;
            default:
              extractedValue = "";
              break;
          }
          break;
        case "postalCode":
          //extractedValue = convertToPostalCode(extractedValue);
          extractedValue = extractedValue;
          break;
        default:
      }

      var columnsResult = {
        elementID: obj[e].elementID,
        dataElement: obj[e].dataElement,
        fieldName: obj[e].fieldTo,
        value: extractedValue,
      };
      viewData.IdDataElement.push(columnsResult);
      dataResultsStr +=
        "<tr><th scope='row'>" +
        index +
        "</th><td>" +
        obj[e].elementID +
        "</td><td>" +
        extractedValue +
        "</td><td>" +
        search_term_description +
        "</td></tr>";
    } else {
      var columnsResult = {
        elementID: obj[e].elementID,
        dataElement: obj[e].dataElement,
        fieldName: obj[e].fieldTo,
        value: "",
      };
      viewData.IdDataElement.push(columnsResult);
      dataResultsStr +=
        "<tr><th scope='row'>-1</th><td>" +
        obj[e].elementID +
        "</td><td><strong style='color: red;'>N/A<strong></td><td>" +
        search_term_description +
        "</td></tr>";
    }
  }
  document.getElementById("dataTableResults").innerHTML = dataResultsStr;
}

// Define recursive function to print nested values
function printValues(obj) {
  for (var k in obj) {
    if (obj[k] instanceof Object) {
      printValues(obj[k]);
    } else {
      document.write(obj[k] + "<br>");
    }
  }
}

function GetCompliance() {
  var str = documentScannedStr;
  var index = str.match(/[0-9]/).index; // looking for first number and its position in string
  var comp = str.slice(0, index);
  str = str.slice(index, str.length); // pops the finding off the string
  $("#inputCompliance").text(comp.replace(/[^a-zA-Z]/g, ""));
  //Result should be @ANSI or @AAMVA
}

function GetDocumentInfoFromIINandSubType() {
  var str = documentScannedStr;
  var strIIN = str.substr(9, 6);

  var strAAMVAnum = str.substr(15, 2);
  aamvaVersionNumber = parseInt(strAAMVAnum.slice(0, 2));
  $("#inputAAMVAVersionNumber").val(aamvaVersionNumber);

  var strDocumentType =
    aamvaVersionNumber == 1 ? str.substr(19, 2) : str.substr(21, 2);
  $("#inputDocumentTypeID").val(strDocumentType);

  var strJurisdictionVersionNumber =
    aamvaVersionNumber == 1 ? 0 : str.substr(17, 2);

  GetIIN(strIIN);
}

function GetIIN(data) {
  var str = data;
  var IIN = str.slice(0, 6);
  str = str.slice(6, str.length); //pops the findings off the substring
  $("#inputIssuerIdentificationNumbers").val(IIN);
  IIN2State(IIN);
  IIN2Country(IIN);
}

function IIN2Country(IIN) {
  var lookups = {
    636033: "USA",
    636059: "USA",
    604432: "CANADA",
    604427: "USA",
    636026: "USA",
    636021: "USA",
    636028: "CANADA",
    636014: "USA",
    636056: "MEXICO",
    636020: "USA",
    636006: "USA",
    636011: "USA",
    636043: "USA",
    636010: "USA",
    636055: "USA",
    636019: "USA",
    636047: "USA",
    636057: "MEXICO",
    636050: "USA",
    636035: "USA",
    636037: "USA",
    636018: "USA",
    636022: "USA",
    636046: "USA",
    636007: "USA",
    636041: "USA",
    636048: "CANADA",
    636003: "USA",
    636002: "USA",
    636032: "USA",
    636038: "USA",
    636051: "USA",
    636030: "USA",
    636008: "USA",
    636054: "USA",
    636049: "USA",
    636017: "CANADA",
    636039: "USA",
    636036: "USA",
    636009: "USA",
    636001: "USA",
    636016: "CANADA",
    636004: "USA",
    636034: "USA",
    604430: "USA",
    636013: "CANADA",
    604433: "CANADA",
    636023: "USA",
    636058: "USA",
    636012: "CANADA",
    636029: "USA",
    636025: "USA",
    604426: "CANADA",
    604431: "USA",
    604428: "CANADA",
    636052: "USA",
    636044: "CANADA",
    636005: "USA",
    636042: "USA",
    636027: "USA",
    636053: "USA",
    636015: "USA",
    636040: "USA",
    636024: "USA",
    636062: "USA",
    636000: "USA",
    636045: "USA",
    636061: "USA",
    636031: "USA",
    636060: "USA",
    604429: "CANADA",
    990876: "CANADA",
    908760: "CANADA",
  };
  var country = lookups[IIN];
  aamvaCountryName = country;
  $("#inputCountry").val(country);
}

function IIN2State(IIN) {
  var lookups = {
    636033: "Alabama",
    636059: "Alaska",
    604432: "Alberta",
    604427: "American Samoa",
    636026: "Arizona",
    636021: "Arkansas",
    636028: "British Columbia",
    636014: "California",
    636056: "Coahuila",
    636020: "Colorado",
    636006: "Connecticut",
    636011: "Delaware",
    636043: "District of Columbia",
    636010: "Florida",
    636055: "Georgia",
    636019: "Guam",
    636047: "Hawaii",
    636057: "Hidalgo",
    636050: "Idaho",
    636035: "Illinois",
    636037: "Indiana",
    636018: "Iowa",
    636022: "Kansas",
    636046: "Kentucky",
    636007: "Louisiana",
    636041: "Maine",
    636048: "Manitoba",
    636003: "Maryland",
    636002: "Massachusetts",
    636032: "Michigan",
    636038: "Minnesota",
    636051: "Mississippi",
    636030: "Missouri",
    636008: "Montana",
    636054: "Nebraska",
    636049: "Nevada",
    636017: "New Brunswick",
    636039: "New Hampshire",
    636036: "New Jersey",
    636009: "New Mexico",
    636001: "New York",
    636016: "Newfoundland and Labrador",
    636004: "North Carolina",
    636034: "North Dakota",
    604430: "Northern Marianna Islands",
    636013: "Nova Scotia",
    604433: "Nunavut",
    636023: "Ohio",
    636058: "Oklahoma",
    636012: "Ontario",
    636029: "Oregon",
    636025: "Pennsylvania",
    604426: "Prince Edward Island�",
    604431: "Puerto Rico",
    604428: "Quebec",
    636052: "Rhode Island",
    636044: "Saskatchewan",
    636005: "South Carolina",
    636042: "South Dakota",
    636027: "State Dept. (Diplomatic)",
    636053: "Tennessee",
    636015: "Texas",
    636040: "Utah",
    636024: "Vermont",
    636062: "Virgin Islands",
    636000: "Virginia",
    636045: "Washington",
    636061: "West Virginia",
    636031: "Wisconsin",
    636060: "Wyoming",
    604429: "Yukon",
    990876: "Alberta (Non Iso)",
    908760: "Alberta (Non Iso)",
  };
  var state = lookups[IIN];
  $("#inputState").val(state);
}

function convertToDate(dt) {
  var mm = "";
  var dd = "";
  var yyyy = "";

  if (aamvaCountryName == "CANADA" || aamvaVersionNumber == 1) {
    mm = dt.substring(4, 6);
    dd = dt.substring(6, 8);
    yyyy = dt.substring(0, 4);
  } else {
    mm = dt.substring(0, 2);
    dd = dt.substring(2, 4);
    yyyy = dt.substring(4, 8);
  }

  var res = mm + "-" + dd + "-" + yyyy;
  return res;
}

function convertToHeight(h) {
  var res = h;
  var resultHeight = 0;

  // res.slice(-2) == "cm"
  if (aamvaCountryName == "CANADA") {
  } else {
    if (aamvaVersionNumber == 1) {
      var inchesFromFeet = Math.floor(res.substr(0, 1) * 12);
      var inchesFromInches = Math.floor(res.substr(1, 2));
      var heightCms = inchesFromFeet + inchesFromInches;
      resultHeight = heightCms;
    } else {
      resultHeight = parseInt(res.substring(0, res.indexOf("IN")));
    }
  }

  return resultHeight;
}

/*
function convertToPostalCode(p)
	var res = p;
	var resultPostal = "";
	var zipLen = res.length;
	
	// res.slice(-2) == "cm"
    if (aamvaCountryName == 'USA') {
		if(zipLen>=5) {
			
		} else {
			
		}
    } else {
		if (aamvaVersionNumber == 1) {
			var inchesFromFeet = Math.floor(res.substr(0,1) * 12);
			var inchesFromInches = Math.floor(res.substr(1,2));
			var heightCms = (inchesFromFeet + inchesFromInches);
			resultHeight = heightCms;	
		} else {
			resultHeight = parseInt(res.substring(0, res.indexOf("IN")));
		}
    }

    return resultHeight;
}
*/
