import React, { useEffect, useState, useRef } from "react"
import BootstrapTable from "react-bootstrap-table-next"
import { Container, Row, Col, Card, Button, Spinner, FormControl, InputGroup } from "react-bootstrap"
import cellEditFactory from "react-bootstrap-table2-editor"
import ToolkitProvider, { CSVExport } from "react-bootstrap-table2-toolkit"
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css"
import axios from "axios"
import SelectSearch, { fuzzySearch } from "react-select-search"

const defineLocationType = (locationType) => {
	switch (locationType) {
		case "akarsu":
			return "Akarsu"
			break
		case "deniz":
			return "Deniz"
			break
		case "aritma":
			return "Arıtma"
			break
		case "gol":
			return "Göl"
			break
		default:
			break
	}
}

const DataEntry = (props) => {
	// let locationType = defineLocationType(props.location.pathname.substring(1));
	let locationType = defineLocationType("akarsu")
	console.log(props.location.pathname.substring(6))

	const [Locations, setLocations] = useState()
	const [bolgeAdlari, setBolgeAdlari] = useState([])
	const [yerAdlari, setYerAdlari] = useState([])
	//-----------------
	const [selectedBolge, setSelectedBolge] = useState()
	const [selectedYer, setSelectedYer] = useState()
	const [parametreler, setParametreler] = useState([])
	const [parametreOptionsState, setParametreOptions] = useState([])
	const [selectedNumuneKodu, setSelectedNumuneKodu] = useState("")
	const [selectedYil, setSelectedYil] = useState("")
	const [enlem, setEnlem] = useState()
	const [boylam, setBoylam] = useState()

	useEffect(() => {
		// change
		async function fetchLocations() {
			const { data } = await axios.get(`http://127.0.0.1:8000/api/locations/${locationType}`)
			setBolgeAdlari(data)
		}
		async function fetchParameters() {
			let parametreArray = []
			const { data } = await axios.get(`http://127.0.0.1:8000/api/readingtypes/${locationType}`)
			data.map((parametre) => {
				console.log(parametre)
				parametreArray.push(parametre)
			})
			const parametreOptions = []

			parametreArray.map((parametre) =>
				parametreOptions.push({
					id: parametre,
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
				})
			)

			setParametreOptions(parametreOptions)
		}
		fetchLocations()
		fetchParameters()
	}, [])
	async function fetchYer(bolge_adi) {
		const { data } = await axios.get(`http://127.0.0.1:8000/api/locations/${locationType}/${bolge_adi}`)
		setYerAdlari(data)
	}
	const BolgeOptions = []
	const YerOptions = []

	bolgeAdlari.map((bolge) => BolgeOptions.push({ name: bolge, value: bolge }))
	yerAdlari.map((yer) => YerOptions.push({ name: yer, value: yer }))

	const validation = (newValue, row, column) => {
		if(newValue.startsWith("<")){
			// deger -= deger * 0.01
			// degeri koymadan burada flag tanimlasak?
		}
		if(newValue.startsWith(">")){
			// deger += deger * 0.01
		}
		var num = Number(newValue)
		console.log(num)
		if(isNaN(num)){
			return {
				valid: false,
				message: 'Geçersiz'
			}
		}
		else // min max kontrolu
			return true
	}

	const columns = [
		{
			dataField: "id",
			text: "Parametreler",
		},
		{
			dataField: "ocak",
			text: "OCAK",
			align: "center",
			validator: validation.bind(this) 
		},
		{
			dataField: "subat",
			text: "SUBAT",
			align: "center",
			validator: validation.bind(this) 
		},
		{
			dataField: "mart",
			text: "MART",
			align: "center",
			validator: validation.bind(this)
		},
		{
			dataField: "nisan",
			text: "NISAN",
			align: "center",
			validator: validation.bind(this)
		},
		{
			dataField: "mayis",
			text: "MAYIS",
			align: "center",
			validator: validation.bind(this)
		},
		{
			dataField: "haziran",
			text: "HAZIRAN",
			align: "center",
			validator: validation.bind(this)
		},
		{
			dataField: "temmuz",
			text: "TEMMUZ",
			align: "center",
			validator: validation.bind(this)
		},
		{
			dataField: "agustos",
			text: "AGUSTOS",
			align: "center",
			validator: validation.bind(this)
		},
		{
			dataField: "eylul",
			text: "EYLUL",
			align: "center",
			validator: validation.bind(this)
		},
		{
			dataField: "ekim",
			text: "EKIM",
			align: "center",
			validator: validation.bind(this)
		},
		{
			dataField: "kasim",
			text: "KASIM",
			align: "center",
			validator: validation.bind(this) 
		},
		{
			dataField: "aralik",
			text: "ARALIK",
			align: "center",
			validator: validation.bind(this) 
		},
	]
	const CaptionElement = () => (
		<h3 style={{ borderRadius: "0.25em", textAlign: "center", padding: "0.5em" }}>{`${selectedNumuneKodu || "Num Kod"} - ${selectedBolge || "Bölge"} - ${
			selectedYer || "Yer"
		} - ${selectedYil || "Yıl"}`}</h3>
	)

	const veriGonder = () => {
		console.log("sa: ", selectedBolge)
		console.log("as: ", selectedYer)
		axios
			.post("http://127.0.0.1:8000/api/veriGirisi", {
				...parametreOptionsState,
				bolge_adi: selectedBolge,
				yer: selectedYer,
				numune_adi: selectedNumuneKodu,
				utm_x: enlem,
				utm_y: boylam,
				date: selectedYil,
				table_type: locationType,
			})
			.then(function (response) {
				console.log(response)
			})
			.catch(function (error) {
				console.log(error)
			})
	}

	return (
		<div>
			<Container fluid className={"dropdownContainer"}>
				<Row>
					<Col xs={12} sm={12} md={6} lg={3} xl={3}>
						{bolgeAdlari.length !== 0 ? (
							<SelectSearch
								options={BolgeOptions}
								search
								emptyMessage={() => <div style={{ textAlign: "center", fontSize: "0.8em" }}>Not found renderer</div>}
								placeholder="Bölge"
								filterOptions={fuzzySearch}
								onChange={(e) => {
									setSelectedBolge(e)
									fetchYer(e)
								}}
							/>
						) : (
							<Container>
								<Row style={{ alignSelf: "flex-end", justifyContent: "center", alignItems: "flex-end" }}>
									<Spinner className={"select-search"} animation="border" variant="primary" />
								</Row>
							</Container>
						)}
					</Col>
					<Col xs={12} sm={12} md={6} lg={3} xl={3}>
						<SelectSearch
							options={YerOptions}
							search
							emptyMessage={() => <div style={{ textAlign: "center", fontSize: "0.8em" }}>Not found renderer</div>}
							placeholder="Yer"
							filterOptions={fuzzySearch}
							onChange={(e) => setSelectedYer(e)}
						/>
					</Col>
					<Col xs={12} sm={12} md={6} lg={3} xl={3}>
						<InputGroup className="mb-3">
							<InputGroup.Prepend>
								<InputGroup.Text>Enlem (Lat)</InputGroup.Text>
							</InputGroup.Prepend>
							<FormControl onChange={(e) => setEnlem(e.target.value)} />
						</InputGroup>
						<InputGroup className="mb-3">
							<InputGroup.Prepend>
								<InputGroup.Text>Boylam (Long)</InputGroup.Text>
							</InputGroup.Prepend>
							<FormControl onChange={(e) => setBoylam(e.target.value)} />
						</InputGroup>
					</Col>
					<Col xs={12} sm={12} md={6} lg={3} xl={3}>
						<InputGroup className="mb-3">
							<InputGroup.Prepend>
								<InputGroup.Text>Numune Kodu</InputGroup.Text>
							</InputGroup.Prepend>
							<FormControl onChange={(e) => setSelectedNumuneKodu(e.target.value)} />
						</InputGroup>
						<InputGroup className="mb-3">
							<InputGroup.Prepend>
								<InputGroup.Text>Yıl</InputGroup.Text>
							</InputGroup.Prepend>
							<FormControl onChange={(e) => setSelectedYil(e.target.value)} />
						</InputGroup>
					</Col>
				</Row>
			</Container>

			<Container>
				<Card>
					<p>
						Girilen değerler harf, nokta dışında noktalama işaretleri, boşluk ve özel karakterler {`(&,@,#,% vs.)`} içeremez.
						<br></br>
						Eksi değer girmek için değerin başına "-" koymalısınız. Kesirli sayı girmek için "." kullanmalısınız.
						<br></br>
						"{`<`}" veya "{`>`}" karakterlerini sadece sayıdan önce koymalısınız.
					</p>
				</Card>
			</Container>

			<Container fluid>
				<Row>
					<Col sm={12} md={12} lg={12} xl={12} id="dataCard">
						<Card className="my-3 p-3" style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px" }}>
							<BootstrapTable
								caption={<CaptionElement />}
								keyField="id"
								columns={columns}
								data={parametreOptionsState}
								bootstrap4={true}
								striped={true}
								bordered={true}
								hover={true}
								condensed={true}
								cellEdit={cellEditFactory({
									mode: "click",
									blurToSave: false, //true
									onStartEdit: (row, column, rowIndex, columnIndex) => {
										console.log("start to edit!!!")
									},
									beforeSaveCell: (oldValue, newValue, row, column) => {
										console.log("Before Saving Cell!! o: " + oldValue + "- n: " + newValue)
										console.log("r- ", row)
										console.log("c- ", column)
									},
									afterSaveCell: (oldValue, newValue, row, column) => {
										console.log("After Saving Cell!! o: " + oldValue + "- n: " + newValue)
										// const updatedRow = Object.entries(row).map(([k, v]) => v === "" ? {k:null} : {k:v})
										// console.log("uprow: ",updatedRow)
										console.log("r- ", row)
										console.log("c- ", column)
										setParametreOptions((previousParametreOptions) => {
											return previousParametreOptions.map((object) => (object.id === row.id ? row : object))
											
										})
										setTimeout(() => {
											console.log(parametreOptionsState)
										}, 500)
									},
								})}
							/>
							<hr />
							<Button onClick={veriGonder}>Gonder</Button>
						</Card>
					</Col>
				</Row>
			</Container>
		</div>
	)
}

export default DataEntry
