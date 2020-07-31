autowatch = 1;

inlets = 1;
outlets = 2;

//var

var currentIteration = 0,		
	iterationArrayDefVal = 0,
	renameButton = [],
	phraseName = [],
	phraseDropzone = [],
	deleteButton = [],
	renameNumber = [],
	deleteNumber = [],
	currentAccum = 0,
	allData = new Dict("allData");
	phraseIterationArray = allData.get("iterationArrays::phraseIterationArray"),
	phraseIterationArrayLength = phraseIterationArray.length,
	dPhrase = new Dict("phraseDictionary"),
	blankAttachArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	
	//creates all gui objects and connections
	createPhrase = function() {
				   	   var currentYpos = (currentIteration * 22),
					  	   deleteConnector = patcher.getnamed("deleteConnector"),
					  	   renameConnector = patcher.getnamed("renameConnector");					   
					
				       renameButton[currentIteration] = patcher.newdefault(1, currentYpos, "button", 
																		   	   "@presentation", "1",
																			   "@presentation_rect", "1", currentYpos, "20", "20",
																			   "@patching_rect", "1", currentYpos, "20", "20",
																			   "@varname", "renameButton" + currentIteration
													    );
					   phraseName[currentIteration] = patcher.newdefault(18, currentYpos, "comment",
																		    "@text", "Phrase" + (currentIteration + 1),
																		    "@presentation", "1", 
																		    "@presentation_rect", "18", currentYpos, "70", "20",
																		    "@patching_rect", "18", currentYpos, "70", "20",
																		    "@varname", "phrase" + currentIteration
											        );
					   phraseDropzone[currentIteration] = patcher.newdefault(88, currentYpos, "bpatcher", "phraseDropzones", 
																			   "@presentation", "1", 
																			   "@presentation_rect", "88", currentYpos, "88", "20", 
																			   "@patching_rect", "88", currentYpos, "88", "20",
																			   "@varname", "phraseDropzone" + currentIteration,
																			   "@args", (currentIteration + 1)
													    );		
					   deleteButton[currentIteration] = patcher.newdefault(175, currentYpos, "button", 
																			   "@presentation_rect", "175", currentYpos, "20", "20",
																			   "@patching_rect", "175", currentYpos, "20", "20",
																			   "@presentation", "1",
																			   "@varname", "deleteButton" + currentIteration
													    );
					   renameNumber[currentIteration] = patcher.newdefault(255, currentYpos, "message",
																			   "@varname", "renameNumber" + currentIteration
													    );																													
					   deleteNumber[currentIteration] = patcher.newdefault(305, currentYpos, "message",
																			   "@varname", "deleteNumber" + currentIteration
													    );
													
					   deleteNumber[currentIteration].set(currentIteration);	
					   renameNumber[currentIteration].set(currentIteration);							

					   patcher.connect(deleteButton[currentIteration], 0, deleteNumber[currentIteration], 0);
					   patcher.connect(renameButton[currentIteration], 0, renameNumber[currentIteration], 0);
					   patcher.connect(deleteNumber[currentIteration], 0, deleteConnector, 0);	
					   patcher.connect(renameNumber[currentIteration], 0, renameConnector, 0);		
					
					   currentAccum++;

				   	   outlet(0, currentIteration);
					   outlet(1, currentAccum);
															
	   };
	
//actions

function newphrase() {	
	for (i = 0; i < phraseIterationArrayLength; i++) {
			if (phraseIterationArray[i] == 0 && i < phraseIterationArrayLength) {
				currentIteration = i;				
				createPhrase([currentIteration]);
				phraseIterationArray[i] = 1;
				allData.set("iterationArrays::phraseIterationArray", phraseIterationArray);
				allData.set("startAttachIterationArrays::" + "phrase"+[i]+"StartAttachIterationArray", blankAttachArray);
				allData.replace("startAttachLinks::phrase" + [i] + "StartAttachLinks");
				allData.replace("startAttachLinksRev::phrase" + [i] + "StartAttachLinksRev");
				allData.set("endAttachIterationArrays::" + "phrase"+[i]+"EndAttachIterationArray", blankAttachArray);
				allData.replace("endAttachLinks::phrase" + [i] + "EndAttachLinks");
				allData.replace("endAttachLinksRev::phrase" + [i] + "EndAttachLinksRev");
				break;
			};

			if (i == (phraseIterationArrayLength - 1)) {
				post("Phrase limit reached"); post();
			};
	};
};	
	
function deletephrase(val) {
	patcher.remove(renameButton[val]);	
	patcher.remove(phraseName[val]);	
	patcher.remove(phraseDropzone[val]);
	patcher.remove(deleteButton[val]);
	patcher.remove(renameNumber[val]);
	patcher.remove(deleteNumber[val]);
	dPhrase.replace(("Phrase" + val), ("Phrase" + val));
	currentAccum--;
	outlet(1, currentAccum);
	
	phraseIterationArray[val] = 0;
	allData.set("iterationArrays::phraseIterationArray", phraseIterationArray);
	allData.remove("startAttachIterationArrays::" + "phrase"+[val]+"StartAttachIterationArray");
	allData.remove("startAttachLinks::" + ("phrase" + val + "StartAttachLinks"));
	allData.remove("startAttachLinksRev::" + ("phrase" + val + "StartAttachLinksRev"));
	allData.remove("endAttachIterationArrays::" + "phrase"+[val]+"EndAttachIterationArray");
	allData.remove("endAttachLinks::" + ("phrase" + val + "EndAttachLinks"));
	allData.remove("endAttachLinksRev::" + ("phrase" + val + "EndAttachLinksRev"));
};

function quitdeletephrase(val) {
	patcher.remove(renameButton[val]);	
	patcher.remove(phraseName[val]);	
	patcher.remove(phraseDropzone[val]);
	patcher.remove(deleteButton[val]);
	patcher.remove(renameNumber[val]);
	patcher.remove(deleteNumber[val]);
	dPhrase.replace(("Phrase" + val), ("Phrase" + val));
	phraseIterationArray[val] = 0;
	currentAccum--;
	outlet(1, currentAccum);
};
	
function quit() {
	var i = 0;
	currentAccum = 0;
	for (i=0; i<phraseIterationArrayLength; i++) {
		quitdeletephrase(i);
	};
	setPhraseDictionary();	
};

function rename (val, val2) {
	var newPhraseName = patcher.getnamed("newPhraseName"),
		tempConnect = patcher.getnamed("phrase" + val2);
	dPhrase.name = "phraseDictionary";
	dPhrase.replace(("Phrase" + val2), val);
	messnamed("updatePhraseDictionaryRev", "bang");
	patcher.connect(newPhraseName, 0, tempConnect, 0);
	messnamed("updatePhraseName", "bang");
	patcher.disconnect(newPhraseName, 0, tempConnect, 0);
	messnamed("updatePhraseDictionaryRev", "bang");
};

function loadbang() {
	setPhraseDictionary;
	for (i=0; i<phraseIterationArrayLength; i++) {
		for (j=0; j<6; j++) {
			var objname = ["renameButton", "phrase", "phraseDropzone", "deleteButton", "renameNumber", "deleteNumber"];
			a = patcher.getnamed(objname[j].concat(i));
			patcher.remove(a);
		};
	};
	currentAccum = 0;
	setPhraseDictionary();
};

function setPhraseDictionary() {
	for (i=1; i<phraseIterationArrayLength; i++) {
 		dPhrase.set("Phrase"+i, "Phrase"+i)
	};
	messnamed("updatePhraseDictionaryRev", "bang");
};