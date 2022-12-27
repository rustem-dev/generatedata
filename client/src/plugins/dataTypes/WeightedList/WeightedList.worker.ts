import utils from '../../../utils';
import { DTWorkerGenerationData, DTGenerateResult, DTWorkerOnMessage } from '~types/dataTypes';
import { WeightedListType } from './WeightedList';

export const generate = (data: DTWorkerGenerationData): DTGenerateResult => {
	const { listType, values, exactly, betweenLow, betweenHigh, delimiter, allowDuplicates } = data.rowState;
	const numValues = Object.keys(values).length;

	let items: any = [];
	if (listType === WeightedListType.exactly) {
		items = utils.randomUtils.getRandomWeightedSubset(values, exactly, allowDuplicates);
	} else if (betweenLow && betweenHigh) {
		const numItems = utils.randomUtils.getRandomNum(betweenLow, betweenHigh);
		items = utils.randomUtils.getRandomWeightedSubset(values, numItems, allowDuplicates);
	} else if (betweenLow) {
		if (betweenLow <= numValues) {
			const numItems = utils.randomUtils.getRandomNum(betweenLow, numValues);
			items = utils.randomUtils.getRandomWeightedSubset(values, numItems, allowDuplicates);
		}
	} else if (betweenHigh !== '') {
		const numItems = utils.randomUtils.getRandomNum(0, betweenHigh);
		items = utils.randomUtils.getRandomWeightedSubset(values, numItems, allowDuplicates);
	}

	return {
		display: items.join(delimiter)
	};
};

let utilsLoaded = false;

export const onmessage = (e: DTWorkerOnMessage) => {
	if (!utilsLoaded) {
		importScripts(e.data.workerUtilsUrl);
		utilsLoaded = true;
	}

	postMessage(generate(e.data));
};