"use strict";
const excel = require("./members-excel");
const scrapeSite = require("./puppeteerScrape");

const dataToExcel = async () => {
	const members = await scrapeSite.run();

	excel.createExcelMemebers(members);
	return "Done";
};

dataToExcel();

