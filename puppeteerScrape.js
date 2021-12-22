"use strict";
const puppeteer = require("puppeteer");
const readline = require("readline");
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

const inputPrompt = async (queryText) => {
	return new Promise((resolve) => {
		return rl.question(queryText, resolve);
	});
};

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

		const id = await inputPrompt("Enter your username/id: ");
		const pw = await inputPrompt("Enter your password: ");
		await page.type("#id", id, { delay: 100 });

		await page.click("#pw");
		await page.type("#pw", pw, { delay: 110 });

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

			// grab all buttons (11 buttons)
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

			// this is for first 10 pages
			let i = 0;
			for (const item of btns) {
				if (i === 0) {
				} else {
					const btnsAgain = await page.$x(`//*[@id="paginate"]/a[${i + 1}]`);

					await btnsAgain[0].click();
					sleep(4000);

					const members = await getMembers();
					allMembers.push(members);
				}
				i++;
			}

			// Need to change "of btns"
			// because btns is an array of 11 buttons (from first page)
			// Instead should grab buttons with function again to get array of 12 items

			// this is for pages after first 10
			for (let j = 0; j < 7; j++) {
				let k = 0;

				const moreBtns = await page.$x('//*[@id="paginate"]/child::*');
				sleep(2000);

				for (const item of moreBtns) {
					if (k <= 1) {
						console.log("Yo");
					} else {
						const btnsAgain = await page.$x(`//*[@id="paginate"]/a[${k + 1}]`);

						await btnsAgain[0].click();
						sleep(4000);

						const members = await getMembers();
						allMembers.push(members);
					}
					k++;
				}
			}

			return allMembers;
		};

		sleep(4000);
		const allPages = await loopThruPages();

		const flattened = await allPages.flat();

		console.log(await flattened);

		await browser.close();

		return flattened;
	},
};
