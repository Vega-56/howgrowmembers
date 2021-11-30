"use strict";
const puppeteer = require("puppeteer");
const membersExcel = require("./members-excel");

module.exports = {
	run: async () => {
		const browser = await puppeteer.launch({ headless: true });
		const page = await browser.newPage();

		await page.goto(
			"https://cafe.naver.com/ManageWholeMember.nhn?clubid=29771973"
		);

		function sleep(ms) {
			const wakeUpTime = Date.now() + ms;
			while (Date.now() < wakeUpTime) {}
		}

		sleep(3000);

		await page.click("#id");
		await page.type("#id", "instarocket", { delay: 100 });
		await page.click("#pw");
		await page.type("#pw", "howgrow!!@@11", { delay: 110 });

		// This screenshot shows that the login details went in ok
		await page.screenshot({ path: "login.png" });

		// click button to login
		await page.click(".btn_login");

		// slight pause
		sleep(4000);

		// This is to confirm that we are successfully inside the site (no login issues)
		await page.screenshot({ path: "loginpassed.png" });

		await page.select("#_sortPerPage", "100");

		sleep(4000);

		// const addToArray = async (array, memberList) => {
		// 	const members = await memberList;
		// 	for (let i = 0; i < 100; i++) {
		// 		array.push(members[i]);
		// 	}
		// };

		// // Grab current members on page 1;
		// const memberList = await page.evaluate(() =>
		// 	Array.from(
		// 		document.querySelectorAll(".nick"),
		// 		(element) => element.textContent
		// 	)
		// );

		const loopThruPages = async () => {
			// Grabs members
			const getMembers = async () => {
				const members = await page.evaluate(() =>
					Array.from(
						document.querySelectorAll(".nick"),
						(element) => element.textContent
					)
				);
				return members;
			};

			// Array of all members;
			const allMembers = [];

			// grab all buttons
			const btns = await page.$x('//*[@id="paginate"]/child::*');

			// grab all memebrs
			const memberList = await page.evaluate(() =>
				Array.from(
					document.querySelectorAll(".nick"),
					(element) => element.textContent
				)
			);

			// grab members and then push into arr
			allMembers.push(memberList);

			// this works
			// await btns[1].click();
			// sleep(4000);
			const btnsCount = await btns.length;

			// for (let i = 1; i <= btnsCount; i++) {
			// 	const members = await getMembers();
			// 	allMembers.push(members);

			// await btns[i].click();
			// 	sleep(4000);
			// }

			// const btnsAgain = await page.$x(`//*[@id="paginate"]/a[${2}]`);

			// await btnsAgain[0].click();

			// sleep(4000);
			// const x = await getMembers();

			// allMembers.push(x);
			let i = 0;
			for (const item of btns) {
				if (i === 0) {
					console.log("hi");
				} else {
					const btnsAgain = await page.$x(`//*[@id="paginate"]/a[${i + 1}]`);

					await btnsAgain[0].click();
					sleep(4000);

					const members = await getMembers();
					allMembers.push(members);
				}
				i++;
			}
			return allMembers;
		};
		sleep(4000);
		const allPages = await loopThruPages();

		const flattened = await allPages.flat();

		console.log(await flattened);

		// closes too early (error code 'Target closed') need to delay somehow?
		// Apparently might be due to not all page methods being awaited)
		// Due to in a .map(), might need to reformat
		await browser.close();

		return flattened;
	},
};
