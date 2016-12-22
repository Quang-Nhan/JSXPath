class JSXUtils {
	constructor() {

	}

	/**
	 * _lastIndexOf returns the last index of a given series of stings
	 * @param  {[type]} psValue     [description]
	 * @param  {[type]} paAvoid     [description]
	 * @param  {[type]} pnFromIndex [description]
	 * @return {[type]}             [description]
	 */
	lastIndexOfString(psValue, paAvoid, pnFromIndex) {
		let nIndex = -1;
		for (let i = pnFromIndex - 1; i >= 0; --i) {
			if (paAvoid.indexOf(psValue[i]) > -1) {
				nIndex = i;
				break;
			}
		}
		return nIndex;
	}

	nextIndexOfString(psValue, paAvoid, pnFromIndex) {
		let nIndex = -1;
		for (let i = pnFromIndex; i < psValue.length; ++i) {
			if (paAvoid.indexOf(psValue[i]) > -1) {
				nIndex = i;
				break;
			}
		}
		return nIndex;
	}

	isNumber(pVal) {
		return typeof pVal === "number" && !isNaN(pVal) && isFinite(pVal);
	}
}

module.exports = JSXUtils;