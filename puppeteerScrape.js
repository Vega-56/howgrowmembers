"use strict";
const puppeteer = require("puppeteer");

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

		const addToArray = async (array, memberList) => {
			const members = await memberList;
			for (let i = 0; i < 100; i++) {
				array.push(members[i]);
			}
		};

		// // Grab current members on page 1;
		// const memberList = await page.evaluate(() =>
		// 	Array.from(
		// 		document.querySelectorAll(".nick"),
		// 		(element) => element.textContent
		// 	)
		// );

		const loopThruPages = async () => {
			// Array of all members;
			const allMembers = [];

			// const firstMembers = await page.evaluate(() =>
			// 	Array.from(
			// 		document.querySelectorAll(".nick"),
			// 		(element) => element.textContent
			// 	)
			// );
			// // Pushes the members from page one
			// addToArray(allMembers, firstMembers);

			// // get buttons of first page
			// const firstBtns = await page.$x('//*[@id="paginate"]/child::*');
			// sleep(4000);

			// // Need to change for loop for something else
			// // for (let i = 1; i <= 11; i++) {
			// // 	// grab current members in list

			// // 	const currentMembers = await page.evaluate(() =>
			// // 		Array.from(
			// // 			document.querySelectorAll(".nick"),
			// // 			(element) => element.textContent
			// // 		)
			// // 	);
			// // 	// push current members into allMembers arr
			// // 	addToArray(allMembers, currentMembers);

			// // 	// then press next button
			// // 	await firstBtns[i].click();

			// // 	// pause to allow page to load members
			// // 	sleep(4000);
			// // }

			// Promise.all(
			// 				firstBtns.map((button, index) => {
			// 					if (index === 0) {
			// 						return;
			// 					}

			// 					addToArray(allMembers, memberList);

			// 					// This needs to be made await / async ;;
			// 					button.click();

			// 					sleep(4000);
			// 				})
			// 			);
			// Loop thru pages after first set of 10

			for (let i = 1; i <= 1; i++) {
				const btns = await page.$x('//*[@id="paginate"]/child::*');

				const grabPageMembers = async () => {
					// Grab current items
					const memberList = await page.evaluate(() =>
						Array.from(
							document.querySelectorAll(".nick"),
							(element) => element.textContent
						)
					);
								
					return Promise.all(
						btns.map((button, index) => {
							if (index <= 1) {
								return;
							}

							// grab all the members
							// push the members into the Allmembers Arr
							// then we click to next page
							// memberList();

							addToArray(allMembers, memberList);

							// This needs to be made await / async ;;
							button.click();

							sleep(4000);
						})
					);
				};
				console.log("1 done");
				const grab = await grabPageMembers();
				grab;
				return allMembers;
			}
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
