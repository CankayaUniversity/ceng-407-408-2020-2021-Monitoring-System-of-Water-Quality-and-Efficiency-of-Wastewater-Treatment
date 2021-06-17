import React, { useEffect, useState, useRef } from "react"
import BootstrapTable from "react-bootstrap-table-next"
import { Container, Row, Col, Card, Button, Spinner, FormControl, InputGroup , Alert, Collapse} from "react-bootstrap"
import cellEditFactory from "react-bootstrap-table2-editor"
import ToolkitProvider, { CSVExport } from "react-bootstrap-table2-toolkit"
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css"
import axios from "axios"
import axiosInstance from '../axios';
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
	const [selectedBolge, setSelectedBolge] = useState("")
	const [selectedYer, setSelectedYer] = useState("")
	const [parametreler, setParametreler] = useState([])
	const [parametreOptionsState, setParametreOptions] = useState([])
	const [selectedNumuneKodu, setSelectedNumuneKodu] = useState("")
	const [selectedYil, setSelectedYil] = useState("")
	const [enlem, setEnlem] = useState()
	const [boylam, setBoylam] = useState()

	const [open, setOpen] = useState(false);

	const [alert,setAlert] = useState({
		hasAlert: false,
		isError: false,
		isSucces: false,
		isInfo: false,
		message: null
	})
	const [isLoading,setIsLoading] = useState(false)

	useEffect(() => {
		// change
		async function fetchLocations() {
			const { data } = await axiosInstance.get(`http://127.0.0.1:8000/api/locations/${locationType}`)
			setBolgeAdlari(data)
		}
		async function fetchParameters() {
			let parametreArray = []
			const { data } = await axiosInstance.get(`http://127.0.0.1:8000/api/readingtypes/${locationType}`)
			data.map((parametre) => {
				console.log(parametre)
				parametreArray.push(parametre)
			})
			setParametreler(parametreArray)
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
		const { data } = await axiosInstance.get(`http://127.0.0.1:8000/api/locations/${locationType}/${bolge_adi}`)
		setYerAdlari(data)
	}
	const BolgeOptions = []
	const YerOptions = []

	bolgeAdlari.map((bolge) => BolgeOptions.push({ name: bolge, value: bolge }))
	yerAdlari.map((yer) => YerOptions.push({ name: yer, value: yer }))

	const isNumber = (newValue) => {
		if(newValue.includes(" ")){
			return false
		}
		if(newValue.startsWith("<") || newValue.startsWith(">")){
			if(newValue.length === 1){
				return false
			}
			var num = Number(newValue.slice(1));
			console.log("slc "+num)
			if(isNaN(num)){
				return false
			}
			else
				return true
		}
		var num = Number(newValue)
		console.log(num)
		if(isNaN(num)){
			return false
		}
		else
			return true
	}

	const validation = (newValue, row, column) => {
		if(row.id === "Açıklama")
			return true

		for (const i in parametreler){
			if(row.id === parametreler[i]){
				if(isNumber(newValue) === true){
					return true
					// min-max
					// if(newValue > min && newValue < max)
					// 	return ture
					// else{
					// 	return{
					// 		valid:false,
					// 		message:"Geçersiz"
					// 	}
					// }
				}
				else {
					return{
						valid:false,
						message:"Geçersiz"
					}
				}
			}
		}
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
		setIsLoading(true)
		axiosInstance
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
				setAlert({
					hasAlert: true,
					isSucces: true,
					isInfo: false,
					isError: false,
					message: "Veri tabanına başarıyla eklendi."
				})
				const parametreOptions = []
				parametreler.map((parametre) =>
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
				setSelectedBolge("")
				setSelectedYer("")
				setSelectedNumuneKodu("")
				setEnlem("")
				setBoylam("")
				setSelectedYil("")
				setIsLoading(false)
			})
			.catch(function (error) {
				setAlert({
					hasAlert: true,
					isSucces: false,
					isInfo: false,
					isError: true,
					message: error.response.status === 404 ? "Uygun formatta veri girişi yapınız." : "Server kaynaklı hatadan dolayı veri girişi yapılamadı."
				})
				setIsLoading(false)
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
								value={selectedBolge || ""}
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
							value={selectedYer || ""}
							emptyMessage={() => <div style={{ textAlign: "center", fontSize: "0.8em" }}>Not found renderer</div>}
							placeholder="Yer"
							filterOptions={fuzzySearch}
							onChange={(e) => setSelectedYer(e)}
						/>
					</Col>
					<Col xs={12} sm={12} md={6} lg={3} xl={3}>
						<InputGroup className="mb-3" style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px" }}>
							<InputGroup.Prepend>
								<InputGroup.Text>Enlem (Lat)</InputGroup.Text>
							</InputGroup.Prepend>
							<FormControl onChange={(e) => setEnlem(e.target.value)} value={enlem || ""}/>
						</InputGroup>
						<InputGroup className="mb-3" style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px" }}>
							<InputGroup.Prepend>
								<InputGroup.Text>Boylam (Long)</InputGroup.Text>
							</InputGroup.Prepend>
							<FormControl onChange={(e) => setBoylam(e.target.value)} value={boylam || ""} />
						</InputGroup>
					</Col>
					<Col xs={12} sm={12} md={6} lg={3} xl={3}>
						<InputGroup className="mb-3" style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px" }}>
							<InputGroup.Prepend>
								<InputGroup.Text>Numune Kodu</InputGroup.Text>
							</InputGroup.Prepend>
							<FormControl onChange={(e) => setSelectedNumuneKodu(e.target.value)} value={selectedNumuneKodu || ""} />
						</InputGroup>
						<InputGroup className="mb-3" style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px" }}>
							<InputGroup.Prepend>
								<InputGroup.Text>Yıl</InputGroup.Text>
							</InputGroup.Prepend>
							<FormControl onChange={(e) => setSelectedYil(e.target.value)} value={selectedYil || ""}/>
						</InputGroup>
					</Col>
				</Row>
			</Container>

			<Container>
				<Container style={{ display:"flex", justifyContent:"center", alignItems:"center" }}>
					<Button
						onClick={() => setOpen(!open)}
						aria-controls="example-collapse-text"
						aria-expanded={open}
						variant="outline-primary"
					>
						Kurallar
					</Button>
				</Container>
				<Collapse in={open}>
					<Card id="example-collapse-text" style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px" }}>
						<Card.Body className="text-center">
						Girilen değerler <strong>harf</strong>, nokta dışında <strong>noktalama işaretleri</strong>, <strong>boşluk</strong> ve <strong>özel karakterler</strong> {`(&,@,#,% vs.)`} <strong>içeremez.</strong>
						<br></br>
						Eksi değer girmek için değerin başına "-" koymalısınız. Kesirli sayı girmek için "." kullanmalısınız.
						<br></br>
						"{`<`}" veya "{`>`}" karakterlerini <strong>sadece sayıdan önce</strong> koymalısınız.
						</Card.Body>
					</Card>
				</Collapse>
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
							<Button onClick={veriGonder} variant={"outline-info"}>{ isLoading ? <Spinner animation="border" /> : "Gönder"}</Button>

							<Card.Footer className="text-muted">
								{ alert.hasAlert ? (
										<Alert  variant={alert.isSucces ? "success" : "danger"}>
											{alert.message}
										</Alert>
								): ""
								}
							</Card.Footer>
						</Card>
					</Col>
				</Row>
			</Container>
		</div>
	)
}

export default DataEntry
