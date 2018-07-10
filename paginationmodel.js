export class PaginationParms {
	// build into a custom pagination component instead
	constructor () {
		this.rowCount = 0;
		this.chunkSize = 0;
		this.chunk = 0;
		this.chunkVal = 0;
		this.totalPages = 0;
		this.recsInPage = 0;
	}

	copyFrom (ruleData) {
		this.rowCount = ruleData.totalRecordFound;
		this.chunkSize = ruleData.chunkSize;
		this.chunk = ruleData.chunk;
		this.totalPages = Math.ceil (this.rowCount / this.chunkSize);
		this.chunkVal = this.totalPages < 1 ? 0 : this.chunk;
		this.recsInPage = ruleData.ruleList ? ruleData.ruleList.length : 0;
	}

	updatePage (ruleData) {
		this.chunkSize = ruleData.chunkSize;
		this.chunk = ruleData.chunk;
		this.chunkVal = this.chunk;
		this.recsInPage = ruleData.ruleList ? ruleData.ruleList.length : 0;
	}

	updateChunk (ruleData) {
		this.chunk = ruleData.chunk;
		this.chunkVal = this.chunk;
		this.recsInPage = ruleData.ruleList ? ruleData.ruleList.length : 0;
	}
}
