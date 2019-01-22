import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

let chartContext

const drawBarChart = (chart, chartLabels, data) => {
	if (!chart) {
		console.log('No chart element');
		return;
	}

	if (chartContext) {
		chartContext.destroy();
	}
	
	const colors = [
		'#2de0a5',
		'#ffd21f',
		'#f5455c',
		'#8e5ea2',
	];

	const config = {
		labels: chartLabels,
		datasets: [{
			label: "Clicks",
			backgroundColor: colors,
			data
		}]
	};

	return new Chart(chart, {
		type: 'bar',
		data: config,
		options: {
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero: true
					}
				}],
				xAxes: [{
					ticks: {
						autoSkip: false
					}
				}]
			},
			legend: {
				display: false
			}
		}
	});
};

const updateChartData = (smilesData) => {
	const labels = smilesData.map((m) => m.label);
	const values = smilesData.map((m) => m.value);
	const smiles = smilesData.map((m) => m.smiles);
	
	chartContext = drawBarChart(
		document.getElementById('lc-smiles-chart'),
		labels,
		values
	);

	return chartContext
}

Template.userMood.onCreated(function() {
	this.smilesData = new ReactiveVar([
		{ label: 'Happy', value: 0, smile: ":grinning:" },
		{ label: 'Sad', value: 0, smile: ":pensive:"},
		{ label: 'Uncertain', value: 0, smile: ":thinking:"},
		{ label: 'Confused', value: 0, smile: ":confused:"}
	]);
});

Template.userMood.onRendered(function() {
	const smilesData = Template.instance().smilesData.get();

	updateChartData(smilesData);
});

Template.registerHelper('convertSmile', function(str) {
  return emojione.shortnameToUnicode(str)
});

Template.userMood.helpers({
	smilesData() {
		const instance = Template.instance();

		return instance.smilesData.get();
	}
});

Template.userMood.events({
	'click .rc-popover__item-text'({ currentTarget }) {
		const smilesData = Template.instance().smilesData.get();
		const index = smilesData.findIndex(f => f.label === currentTarget.id);

		smilesData[index].value += 1;

		updateChartData(smilesData);
	},
});
