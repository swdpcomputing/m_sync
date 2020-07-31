autowatch = 1;

inlets = 1;
outlets = 0;

//variables
var 
	allData = new Dict("allData");
	dPhrase = new Dict("phraseDictionary"),
	ptusn = 0,
	phraseName = "",
	phraseNameSet = "",
	selTransport = "",
	selTransportComment = "",
	timePoint = 0,
	pointStart = 0,
	startPointSendName = "",
	endPointSendName = "",
	startDeleteSendName = "",
	endDeleteSendName = "",
	startTransportName = "",
	endTransportName = "",
	beats = 0,
	quarterBeats = 0,
	startAttachFollow = 1;

//actions

function bang() {
	post(phraseName); post();
};

function quit() {
	messnamed("sa_out5", "clear");	
	messnamed("sa_out6", "clear");
};

function userselectnum(val) {
	startPointSendName = ("phrase" + val + "startpoint");
	endPointSendName = ("phrase" + val + "endpoint");	
	startDeleteSendName = ("phrase" + val + "startdelete");
	endDeleteSendName = ("phrase" + val + "enddelete");
	startTransportName = ("phrase" + val + "starttransport");
	endTransportName = ("phrase" + val + "endtransport");
	ptusn = val;
	phraseName = "phrase" + (ptusn-1);
	phraseNameUr = dPhrase.get("Phrase" + (ptusn));
	phraseNameUrSet = ("set" + " " + phraseNameUr).split(" ");
	messnamed("sa_out4", phraseNameUrSet);
};

function dictphraseupdate() {
	userselectnum(ptusn);
};

function startattach() {
	
	//vars
	var currentStartAttachIterationArrayName = (phraseName + "StartAttachIterationArray"),
		currentStartAttachIterationArray = allData.get("startAttachIterationArrays::" + currentStartAttachIterationArrayName),
		attachLinksNumber = 0;
		newLink = "",
		newLinkUr = "",
		newLinkUrSet = "";
		
	for (i = 0; i < 16; i++) {
		
			//finds the first empty slot in iteration array and only runs if one is free
			if (currentStartAttachIterationArray[i] == 0 && i < 16) {
				
				//set poly target
				messnamed(startPointSendName, "target " + (i+1));
				
				//send attach message to poly
				messnamed(startPointSendName, selTransport + " " + timePoint + " " + pointStart + " " + startAttachFollow);
				
				//collate new link names for dictionary and umenu
				newLink = phraseName + " to " + selTransport + " @ " + beats + "B " + quarterBeats + "QB";
				newLinkUr = phraseNameUr + " to " + selTransport + " @ " + beats + "B " + quarterBeats + "QB";
				newLinkUrSet = "append " + newLinkUr;
				
				//add link to umenu
				messnamed("sa_out5", newLinkUrSet);
				
				//sets the iteration array & edits dictionaries
				currentStartAttachIterationArray[i] = 1;
				allData.set("startAttachIterationArrays::" + currentStartAttachIterationArrayName, currentStartAttachIterationArray);
				allData.replace("startAttachLinks::" + phraseName + "StartAttachLinks::" + i, newLink);
				allData.replace("startAttachLinksRev::" + phraseName + "StartAttachLinksRev::" + newLink, i);
				break;
			};
			
			//posts message if iteration array full
			if (i == 15) {
				post("Limit reached"); post();
			};
	};	
};

function deletestartattach(val) {
	//vars
	var subGroupNum = val.charAt(6), //sets beginning of number, added to later
		subGroupNumLength = val.indexOf(" ") - 6,
		deleteNumber = allData.get("startAttachLinksRev::" + val),
		startAttachNum = "",
		deleteStartAttachIterationArrayName = "",
		deleteStartAttachIterationArray = [],
		deletePointSendName = "";
			
	//sets the rest of subGroupNum
	for (i = 7; i < (6 + subGroupNumLength); i++) {
		subGroupNum = subGroupNum + val.charAt(i);		
	};
	
	//removes the original phrase number
	for (i=0; i<subGroupNumLength; i++) {
		val = val.slice(0, 6) + val.slice(7, val.length);
	};
	
	//edit phrase number for user - system for system functions
	subGroupNum = subGroupNum - 1;
	
	//adds new phrase number
	val = val.slice(0, 6) + subGroupNum + " " + val.slice(7, val.length);
	
	//replaces capital with lowercase p
	val = ("p" + val.slice(1));
	
	//gets the iteration array and name of
	deleteStartAttachIterationArrayName = ("phrase" + subGroupNum + "StartAttachIterationArray");
	deleteStartAttachIterationArray = allData.get("startAttachIterationArrays::" + deleteStartAttachIterationArrayName);
	
	//gets the name of and sets the links dictionary
	startAttachNum = allData.get("startAttachLinksRev::" + ("phrase" + subGroupNum + "StartAttachLinksRev::") + val);
	allData.remove("startAttachLinksRev::" + ("phrase" + subGroupNum + "StartAttachLinksRev::") + val);
	allData.remove("startAttachLinks::" + ("phrase" + subGroupNum + "StartAttachLinks::")+ startAttachNum);	
	
	//sets the iteration array
	deleteStartAttachIterationArray[startAttachNum] = 0;
	allData.set("startAttachIterationArrays::" + deleteStartAttachIterationArrayName, deleteStartAttachIterationArray);
	
	//edit phrase number for system - user for user functions
	subGroupNum = subGroupNum + 1;
	
	//sets the target for startpoint poly, and sends the transport reset message
	deletePointSendName = ("phrase" + subGroupNum + "startpoint");
	messnamed(deletePointSendName, "target " + (startAttachNum + 1));
	messnamed(deletePointSendName, "transportx 0 0 0 0");
};	

function endattach() {
	//vars
	var currentEndAttachIterationArrayName = (phraseName + "EndAttachIterationArray"),
		currentEndAttachIterationArray = allData.get("endAttachIterationArrays::" + currentEndAttachIterationArrayName),
		newLink = "",
		newLinkUr = "",
		newLinkUrSet = "";
		
	for (i = 0; i < 16; i++) {
		
			//finds the first empty slot in iteration array and only runs if one is free
			if (currentEndAttachIterationArray[i] == 0 && i < 16) {
				
				//set poly target
				messnamed(endPointSendName, "target " + (i+1));
				
				//send attach message to poly
				messnamed(endPointSendName, selTransport + " " + timePoint);
				
				//collate new link names for dictionary and umenu
				newLink = phraseName + " to " + selTransport + " @ " + beats + "B " + quarterBeats + "QB";
				newLinkUr = phraseNameUr + " to " + selTransport + " @ " + beats + "B " + quarterBeats + "QB";
				newLinkUrSet = "append " + newLinkUr;
				
				//add link to umenu
				messnamed("sa_out6", newLinkUrSet);
				
				//sets the iteration array & edits dictionaries
				currentEndAttachIterationArray[i] = 1;
				allData.set("endAttachIterationArrays::" + currentEndAttachIterationArrayName, currentEndAttachIterationArray);
				allData.replace("endAttachLinks::" + phraseName + "EndAttachLinks::" + i, newLink);
				allData.replace("endAttachLinksRev::" + phraseName + "EndAttachLinksRev::" + newLink, i);
				break;
			};
	};	
};

function deleteendattach(val) {
	//vars
	var subGroupNum = val.charAt(6), //sets beginning of number, added to later
		subGroupNumLength = val.indexOf(" ") - 6,
		deleteNumber = allData.get("endAttachLinksRev::" + val),
		endAttachNum = "",
		deleteEndAttachIterationArrayName = "",
		deleteEndAttachIterationArray = [],
		deletePointSendName = "";
			
	//sets the rest of subGroupNum
	for (i = 7; i < (6 + subGroupNumLength); i++) {
		subGroupNum = subGroupNum + val.charAt(i);		
	};
	
	//removes the original phrase number
	for (i=0; i<subGroupNumLength; i++) {
		val = val.slice(0, 6) + val.slice(7, val.length);
	};
	
	//sets the target for startpoint poly, and sends the transport reset message
	deletePointSendName = ("phrase" + subGroupNum + "endpoint");
	messnamed(deletePointSendName, "target " + (endAttachNum + 1));
	messnamed(deletePointSendName, "transportx 0 0");
	
	//edit phrase number for user - system for system functions
	subGroupNum = subGroupNum - 1;
	
	//adds new phrase number
	val = val.slice(0, 6) + subGroupNum + " " + val.slice(7, val.length);
	
	//replaces capital with lowercase p
	val = ("p" + val.slice(1));
	
	//gets the iteration array and name of
	deleteEndAttachIterationArrayName = ("phrase" + subGroupNum + "EndAttachIterationArray");
	deleteEndAttachIterationArray = allData.get("endAttachIterationArrays::" + deleteEndAttachIterationArrayName);
	
	//sets the iteration array
	for (i=0; i<16; i++) {
			if(deleteEndAttachIterationArray[i] == 1) {
				deleteEndAttachIterationArray[i] = 0;
				allData.set("endAttachIterationArrays::" + deleteEndAttachIterationArrayName, deleteEndAttachIterationArray);
				break;
			};
	};
	
	//gets the name of and sets the links dictionary
	endAttachNum = allData.get("endAttachLinksRev::" + ("phrase" + subGroupNum + "EndAttachLinksRev::") + val);
	allData.remove("endAttachLinksRev::" + ("phrase" + subGroupNum + "EndAttachLinksRev::") + val);
	allData.remove("endAttachLinks::" + ("phrase" + subGroupNum + "EndAttachLinks::")+ endAttachNum);	

};
	
function transportselect(val) {
	selTransport = "transport" +val;
	selTransportComment = selTransport.charAt(0).toUpperCase() + selTransport.substring(1);
	selTransportComment = ("set" + " " + selTransportComment);
	messnamed("sa_out1", selTransportComment.split(" "));
};

function timepointfunc(val) {
	timePoint = val;
	var valSplit = val.split(" ").map(Number);
	beats = valSplit[0];
	quarterBeats = (valSplit[1] / 120);			
};

function pointstartfunc(val) {
	pointStart = (val-1);
};

function startattachfollow(val) {
	startAttachFollow = val;
};