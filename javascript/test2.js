autowatch: 1;

inlets: 1;
outlets: 1;

globala = new Global("stuff");

function msg_int(inc) {
	globala.num = inc;
	post ("globala", globala.num);
				post();
};

function bang() {
				post ("globala", globala.num);
				post();
};