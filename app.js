"use strict";
const excel = require("./members-excel");
const scrapeSite = require("./puppeteerScrape");

const dataToExcel = async () => {
	const members = await scrapeSite.run();

	excel.createExcelMemebers(members);
	return "Done";
};

dataToExcel();
// const exampleData = [
// 	"사스미 (a_ina)",
// 	"햇바니 (tndud223)",
// 	"레지니 (rksmdtjd23)",
// 	"빽상 (sahngki97)",
// 	"새싹마케터 (fnskmoon727)",
// 	"승친 (nuizon)",
// 	"seunghyeon8410 (seunghyeon8410)",
// 	"밍콩이 (bla1004)",
// 	"ㅡㅡ (32dnjswn)",
// 	"sjsh1234 (sjsh1234)",
// 	"김명희입니다 (dodoaod)",
// 	"Misshong in j (honglanpark)",
// 	"like4860000 (like4860000)",
// 	"마케치북 (realslow55)",
// 	"ANIA (isk04412)",
// 	"고구맘 (cantabile042)",
// 	"g80미강짱 (ekqnwlqn)",
// 	"디니호강맨이야 (jinho9978)",
// 	"쿙이 (dlagywjd84)",
// 	"쩡0913 (real_sujung)",
// 	"5기 우동 (6818254)",
// 	"뎡꾸야 (moovnfms1)",
// 	"몰코코 (max_yj)",
// 	"츠바메 (hhy1994)",
// 	"부스텔 (estelle926)",
// 	"브로드 (icandoit1987)",
// 	"NOAD (daony)",
// 	"gPwls0301 (lakebomboment)",
// 	"냐미냐미0053 (skybluepink3)",
// 	"마뿌 (solie9301)",
// ];
