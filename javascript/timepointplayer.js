// Script for note playing

autowatch = 1;

inlets = 2;
outlets = 3;

var rhythmArray = [],
	pitchArray = [],
	velocityArray = [],
	counter = 0,
	startTimeAddition = 0,
	phraseLengthVal = 0;
	
//functions apply incoming data to variables

function rhythmList() {
	rhythmArray = arrayfromargs(arguments);
	phraseLength = rhythmArray.length;
};

function pitchList() {
	pitchArray = arrayfromargs(arguments);
};

function velocityList() {
	velocityArray = arrayfromargs(arguments);
};

//action functions

function bang() {
	
	outlet(
		0,
		pitchArray[counter],
		velocityArray[counter]
	);
		
	counter++;
		
	if (counter >= phraseLength) {
		counter = 0;
	};

	outlet(
		1,
		rhythmArray[counter % phraseLength] + startTimeAddition	
	);
};	

function playNote(transport, startTime, startIndex, follow) {
	
	previousIndex = counter;
	counter = startIndex;

	if(follow == 1) {
	
		startTimeAddition = startTime;
		
		outlet(
			2,
			transport
		);
		
		bang();
		
	} else {
		
		post("vel"+ rhythmArray); post();
		post("pi"+ previousIndex); post();
		startTimeAddition = rhythmArray[previousIndex];
		
	};
};

function endPlay() {
	endMacroCycle()
};

function endMacroCycle() {
	outlet(
		2,
		"transportx"
	);
	
	outlet(
		1,
		"2.0.0"
	);
	
	counter = 0;
};

function reset() {
	counter = 0;
};

function quit() {
	rhythmArray = [];
	pitchArray = [];
	velocityArray = [];
	counter = 0;
	phraseLengthVal = 0;
};