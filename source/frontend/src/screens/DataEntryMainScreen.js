import React, { useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import cellEditFactory from "react-bootstrap-table2-editor";
import ToolkitProvider, { CSVExport } from "react-bootstrap-table2-toolkit";
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'

function DataEntryMainScreen() {
	const { ExportCSVButton } = CSVExport;
	
	const [products, setProducts] = useState([
		{
			id: "Bolge Adi",
			ocak: "Gokova",
		},
		{
			id: "Yer",
			ocak: "Akcapinar",
		},
		{
			id: "Numune Kodu",
			ocak: "GVYS138",
		},
		{
			id: "Koordinatlar",
			ocak: "-",
		},
		{
			id: "Parametreler",
			ocak: "OCAK 2021",
			subat: "SUBAT 2021",
			mart: "MART 2021",
			nisan: "NISAN 2021",
			mayis: "MAYIS 2021",
			haziran: "HAZIRAN 2021",
			temmuz: "TEMMUZ 2021",
			agustos: "AGUSTOS 2021",
			eylul: "EYLUL 2021",
			ekim: "EKIM 2021",
			kasim: "KASIM 2021",
			aralik: "ARALIK 2021",
		},
		{
			id: "pH",
			ocak: null,
			subat: null,
			mart: null,
			nisan: null,
			mayis: null,
			haziran: null,
			temmuz: null,
			agustos: null,
			eylul: null,
			ekim: null,
			kasim: null,
			aralik: null,
		},
		{
			id: "Askıda Katı Madde",
			ocak: null,
			subat: null,
			mart: null,
			nisan: null,
			mayis: null,
			haziran: null,
			temmuz: null,
			agustos: null,
			eylul: null,
			ekim: null,
			kasim: null,
			aralik: null,
		},
		{
			id: "Sıcaklık",
			ocak: null,
			subat: null,
			mart: null,
			nisan: null,
			mayis: null,
			haziran: null,
			temmuz: null,
			agustos: null,
			eylul: null,
			ekim: null,
			kasim: null,
			aralik: null,
		},
		{
			id: "Çözünmüş Oksijen",
			ocak: null,
			subat: null,
			mart: null,
			nisan: null,
			mayis: null,
			haziran: null,
			temmuz: null,
			agustos: null,
			eylul: null,
			ekim: null,
			kasim: null,
			aralik: null,
		},
		{
			id: "Tuzluluk",
			ocak: null,
			subat: null,
			mart: null,
			nisan: null,
			mayis: null,
			haziran: null,
			temmuz: null,
			agustos: null,
			eylul: null,
			ekim: null,
			kasim: null,
			aralik: null,
		},
		{
			id: "Toplam Kjeldahl Azotu",
			ocak: null,
			subat: null,
			mart: null,
			nisan: null,
			mayis: null,
			haziran: null,
			temmuz: null,
			agustos: null,
			eylul: null,
			ekim: null,
			kasim: null,
			aralik: null,
		},
		{
			id: "Toplam Fosfor",
			ocak: null,
			subat: null,
			mart: null,
			nisan: null,
			mayis: null,
			haziran: null,
			temmuz: null,
			agustos: null,
			eylul: null,
			ekim: null,
			kasim: null,
			aralik: null,
		},
		{
			id: "Kimyasal Oksijen İhtiyacı",
			ocak: null,
			subat: null,
			mart: null,
			nisan: null,
			mayis: null,
			haziran: null,
			temmuz: null,
			agustos: null,
			eylul: null,
			ekim: null,
			kasim: null,
			aralik: null,
		},
		{
			id: "Biyokimyasal Oksijen İhtiyacı",
			ocak: null,
			subat: null,
			mart: null,
			nisan: null,
			mayis: null,
			haziran: null,
			temmuz: null,
			agustos: null,
			eylul: null,
			ekim: null,
			kasim: null,
			aralik: null,
		},
		{
			id: "Orto Fosfat",
			ocak: null,
			subat: null,
			mart: null,
			nisan: null,
			mayis: null,
			haziran: null,
			temmuz: null,
			agustos: null,
			eylul: null,
			ekim: null,
			kasim: null,
			aralik: null,
		},
		{
			id: "Debi (Saniye)",
			ocak: null,
			subat: null,
			mart: null,
			nisan: null,
			mayis: null,
			haziran: null,
			temmuz: null,
			agustos: null,
			eylul: null,
			ekim: null,
			kasim: null,
			aralik: null,
		},
		{
			id: "Amonyum Azotu",
			ocak: null,
			subat: null,
			mart: null,
			nisan: null,
			mayis: null,
			haziran: null,
			temmuz: null,
			agustos: null,
			eylul: null,
			ekim: null,
			kasim: null,
			aralik: null,
		},
		{
			id: "Toplam Çözünmüş Madde",
			ocak: null,
			subat: null,
			mart: null,
			nisan: null,
			mayis: null,
			haziran: null,
			temmuz: null,
			agustos: null,
			eylul: null,
			ekim: null,
			kasim: null,
			aralik: null,
		},
		{
			id: "Toplam Pestisit",
			ocak: null,
			subat: null,
			mart: null,
			nisan: null,
			mayis: null,
			haziran: null,
			temmuz: null,
			agustos: null,
			eylul: null,
			ekim: null,
			kasim: null,
			aralik: null,
		},
		{
			id: "Nitrat Azotu",
			ocak: null,
			subat: null,
			mart: null,
			nisan: null,
			mayis: null,
			haziran: null,
			temmuz: null,
			agustos: null,
			eylul: null,
			ekim: null,
			kasim: null,
			aralik: null,
		},
		{
			id: "Nitrit Azotu",
			ocak: null,
			subat: null,
			mart: null,
			nisan: null,
			mayis: null,
			haziran: null,
			temmuz: null,
			agustos: null,
			eylul: null,
			ekim: null,
			kasim: null,
			aralik: null,
		},
		{
			id: "Fekal Koliform",
			ocak: null,
			subat: null,
			mart: null,
			nisan: null,
			mayis: null,
			haziran: null,
			temmuz: null,
			agustos: null,
			eylul: null,
			ekim: null,
			kasim: null,
			aralik: null,
		},
		{
			id: "Elektriksel İletkenlik",
			ocak: null,
			subat: null,
			mart: null,
			nisan: null,
			mayis: null,
			haziran: null,
			temmuz: null,
			agustos: null,
			eylul: null,
			ekim: null,
			kasim: null,
			aralik: null,
		},
		{
			id: "Toplam Koliform",
			ocak: null,
			subat: null,
			mart: null,
			nisan: null,
			mayis: null,
			haziran: null,
			temmuz: null,
			agustos: null,
			eylul: null,
			ekim: null,
			kasim: null,
			aralik: null,
		},
		{
			id: "Açıklama",
			ocak: null,
			subat: null,
			mart: null,
			nisan: null,
			mayis: null,
			haziran: null,
			temmuz: null,
			agustos: null,
			eylul: null,
			ekim: null,
			kasim: null,
			aralik: null,
		},
	]);

	const columns = [
		{
			dataField: "id",
			text: "Product ID",
			headerAttrs: {
				hidden: true,
			},
			style: (cell, row, rowIndex, colIndex) => {
				if (rowIndex % 2 === 0) {
					return {
						color: "black",
						fontWeight: "bold",
					};
				}
				return {
					color: "black",
					fontWeight: "bold",
				};
			},
		},
		{
			dataField: "ocak",
			text: "OCAK",
			attrs: (cell, row, rowIndex, colIndex) => {
				if (rowIndex === 0 || rowIndex === 1 || rowIndex === 2 || rowIndex === 3) {
					return { colSpan: `12` };
				}
			},
			headerAttrs: {
				hidden: true,
			},
			align: "center",
		},
		{
			dataField: "subat",
			text: "SUBAT",
			attrs: (cell, row, rowIndex, colIndex) => {
				if (rowIndex === 0 || rowIndex === 1 || rowIndex === 2 || rowIndex === 3) {
					return { hidden: true };
				}
			},
			headerAttrs: {
				hidden: true,
			},
			align: "center",
		},
		{
			dataField: "mart",
			text: "MART",
			attrs: (cell, row, rowIndex, colIndex) => {
				if (rowIndex === 0 || rowIndex === 1 || rowIndex === 2 || rowIndex === 3) {
					return { hidden: true };
				}
			},
			headerAttrs: {
				hidden: true,
			},
			align: "center",
		},
		{
			dataField: "nisan",
			text: "NISAN",
			attrs: (cell, row, rowIndex, colIndex) => {
				if (rowIndex === 0 || rowIndex === 1 || rowIndex === 2 || rowIndex === 3) {
					return { hidden: true };
				}
			},
			headerAttrs: {
				hidden: true,
			},
			align: "center",
		},
		{
			dataField: "mayis",
			text: "MAYIS",
			attrs: (cell, row, rowIndex, colIndex) => {
				if (rowIndex === 0 || rowIndex === 1 || rowIndex === 2 || rowIndex === 3) {
					return { hidden: true };
				}
			},
			headerAttrs: {
				hidden: true,
			},
			align: "center",
		},
		{
			dataField: "haziran",
			text: "HAZIRAN",
			attrs: (cell, row, rowIndex, colIndex) => {
				if (rowIndex === 0 || rowIndex === 1 || rowIndex === 2 || rowIndex === 3) {
					return { hidden: true };
				}
			},
			headerAttrs: {
				hidden: true,
			},
			align: "center",
		},
		{
			dataField: "temmuz",
			text: "TEMMUZ",
			attrs: (cell, row, rowIndex, colIndex) => {
				if (rowIndex === 0 || rowIndex === 1 || rowIndex === 2 || rowIndex === 3) {
					return { hidden: true };
				}
			},
			headerAttrs: {
				hidden: true,
			},
			align: "center",
		},
		{
			dataField: "agustos",
			text: "AGUSTOS",
			attrs: (cell, row, rowIndex, colIndex) => {
				if (rowIndex === 0 || rowIndex === 1 || rowIndex === 2 || rowIndex === 3) {
					return { hidden: true };
				}
			},
			headerAttrs: {
				hidden: true,
			},
			align: "center",
		},
		{
			dataField: "eylul",
			text: "EYLUL",
			attrs: (cell, row, rowIndex, colIndex) => {
				if (rowIndex === 0 || rowIndex === 1 || rowIndex === 2 || rowIndex === 3) {
					return { hidden: true };
				}
			},
			headerAttrs: {
				hidden: true,
			},
			align: "center",
		},
		{
			dataField: "ekim",
			text: "EKIM",
			attrs: (cell, row, rowIndex, colIndex) => {
				if (rowIndex === 0 || rowIndex === 1 || rowIndex === 2 || rowIndex === 3) {
					return { hidden: true };
				}
			},
			headerAttrs: {
				hidden: true,
			},
			align: "center",
		},
		{
			dataField: "kasim",
			text: "KASIM",
			attrs: (cell, row, rowIndex, colIndex) => {
				if (rowIndex === 0 || rowIndex === 1 || rowIndex === 2 || rowIndex === 3) {
					return { hidden: true };
				}
			},
			headerAttrs: {
				hidden: true,
			},
			align: "center",
		},
		{
			dataField: "aralik",
			text: "ARALIK",
			attrs: (cell, row, rowIndex, colIndex) => {
				if (rowIndex === 0 || rowIndex === 1 || rowIndex === 2 || rowIndex === 3) {
					return { hidden: true };
				}
			},
			headerAttrs: {
				hidden: true,
			},
			align: "center",
		},
	];
	const rowStyle = (row, rowIndex) => {
		if (rowIndex === 4) {
			return {
				color: "black",
				fontWeight: "bold",
			};
		}
		return {};
	};

	const CaptionElement = () => <h3 style={{ borderRadius: "0.25em", textAlign: "center", padding: "0.5em" }}>Akarsular İçin Veri Girişi</h3>;

	return (
		<div>
			<Container fluid>
				<Row>
					<Col sm={12} md={12} lg={12} xl={12} id="dataCard">
						<Card className="my-3 p-3" style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px" }}>
							<ToolkitProvider keyField="id" columns={columns} data={products} exportCSV>
								{(props) => (
									<div>
										<BootstrapTable
											caption={<CaptionElement />}
											{...props.baseProps}
											bootstrap4={true}
											striped={true}
											bordered={true}
											hover={true}
											condensed={true}
											rowStyle={rowStyle}
											cellEdit={cellEditFactory({
												mode: "click",
												blurToSave: true,
												nonEditableRows: () => [0, 4],
												onStartEdit: (row, column, rowIndex, columnIndex) => {
													console.log("start to edit!!!");
												},
												beforeSaveCell: (oldValue, newValue, row, column) => {
													console.log("Before Saving Cell!! o: " + oldValue + "- n: " + newValue);
													console.log("r- ", row);
													console.log("c- ", column);
												},
												afterSaveCell: (oldValue, newValue, row, column) => {
													console.log("After Saving Cell!! o: " + oldValue + "- n: " + newValue);
													console.log("r- ", row);
													console.log("c- ", column);
													setProducts((products) => {
														return products.map((object) => (object.id === row.id ? row : object));
													});
													setTimeout(() => {
														console.log(products);
													}, 500);
												},
											})}
										/>
										<hr />
										<ExportCSVButton {...props.csvProps}><Button >Export</Button></ExportCSVButton>
									</div>
								)}
							</ToolkitProvider>
						</Card>
					</Col>
				</Row>
			</Container>
		</div>
	);
}

export default DataEntryMainScreen;
