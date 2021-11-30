"use strict";
const excel = require("exceljs");

module.exports = {
	workbook: new excel.Workbook(),
	makeWorkSheet: function () {
		const membersSheet = this.workbook.addWorksheet("회원");

		membersSheet.columns = [
			{ header: "회원", key: "member" },
			{ header: "아이디", key: "id" },
		];

		membersSheet.columns.forEach((column) => {
			column.width = column.header.length < 24 ? 24 : column.header.length;
		});

		membersSheet.getRow(1).font = { bold: true };
		return membersSheet;
	},
	
	insertMemberData: function (memberData, worksheet) {
		const formatData = (memberArr) => {
			return memberArr.map((item) => item.split(" ("));
		};

		formatData(memberData).forEach((member) => {
			worksheet.addRow(member);
		});
	},
	writeToFile: function (workbook) {
		workbook.xlsx.writeFile("members.xlsx");
	},
	createExcelMemebers: function (memberData) {
		this.insertMemberData(memberData, this.makeWorkSheet());
		this.writeToFile(this.workbook);
	},
};

