// Script for rhythm

autowatch = 1;

inlets = 2;
outlets = 2;

//vars

var probarray = [],
	snaparray = [],
	indnotesnaparray = [],
	rhythmarray = [],
	notedivs = [2880,1920,1280,1440,960,640,720,480,320,360,240,160,180,120,80,90,60,40,15],
	lrangeval = 7,
	urangeval = 13,
	rhythmpointsval = 7,
	lengthticksval = 1920,
	
 	arrayfill = function(arraytofill, arraysize, content) {							
							for (i = 0; i < arraysize; i++) {
							arraytofill[i] = content;
	 						};
	},

	arrayfill2 = function(arraytofill, arraysize, randrange) {
							var internalrands = [];
							
							for (i=0; i<512; i++) {
							internalrands[i] = Math.floor((Math.random() * randrange));
							};
							
							for (i = 0; i < arraysize; i++) {
							arraytofill[i] = internalrands[i];
	 						};
	},

	probdata = function probdata() {
							probarray = arrayfromargs(arguments);
							output();
	},

	snapdata = function snapdata() {
							snaparray = arrayfromargs(arguments);
							output();
	},

	lrange = function lrange() {
						lrangeval = arrayfromargs(arguments);
						lrangeval = parseInt(lrangeval);
						output();
	},

	urange = function urange() {
						urangeval = arrayfromargs(arguments);
						urangeval = parseInt(urangeval);
						output();
	},

	rhythmpoints = function rhythmpoints() {
								rhythmpointsval = arrayfromargs(arguments);
								output();
	},

	lengthticks = function lengthticks() {
									lengthticksval = arrayfromargs(arguments);
									//output() Out due to infinity loop in timetotimespacing
	},

	output = function output() {
						var rangespan = (urangeval - lrangeval);
	
						// Fills the rhythmarray with the note times, length from rhythmpoints
	
						for (i = 0; i < rhythmpointsval; i++) {
							rhythmarray[i] = probarray[i];
						};
 
						//Gets the snap value from the snaparray for each note time
	
						for (i = 0; i < rhythmpointsval; i++) {
							indnotesnaparray[i] = snaparray[(rhythmarray[i])]
						};
	
						// Sets the add and offset for each value in indnotesnaparray
	
						for (i = 0; i < rhythmpointsval; i++) {
							indnotesnaparray[i] = Math.round((indnotesnaparray[i] * rangespan + lrangeval))
						};
	
						// Fills indnotesnaparray with notedivs's values
	
						for (i = 0; i < rhythmpointsval; i++) {
							indnotesnaparray[i] = notedivs[indnotesnaparray[i]]
						};
	
						// Converts rhythm values from 512 to ms
					
						for (i = 0; i < rhythmpointsval; i++) {
							rhythmarray[i] = ((rhythmarray[i] / 512) * lengthticksval);
						};
	
						// Rounds the note values to the nearest value as prescribed by indnotesnaparray

						for (i = 0; i < rhythmpointsval; i++) {
							rhythmarray[i] = Math.round(rhythmarray[i] / indnotesnaparray[i]) * indnotesnaparray[i]
						};	

						// Sorts array

						rhythmarray.sort(function(a, b){return a-b});
								
						outlet(0, rhythmarray, lengthticksval);

						rhythmarray = [];
	};
		
//actions	

arrayfill(snaparray, 512, 0);
arrayfill2(probarray, 512, 512);
		