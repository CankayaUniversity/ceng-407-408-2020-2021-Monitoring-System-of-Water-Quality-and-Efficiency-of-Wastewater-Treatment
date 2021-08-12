import React, { useEffect, useState, useRef } from "react";
import { Row, Col, InputGroup, FormControl, Container, Card, Button, Spinner, Overlay, ButtonGroup} from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next"
import cellEditFactory from "react-bootstrap-table2-editor"
import axiosInstance from '../axios';
import SelectSearch, { fuzzySearch } from "react-select-search"

function Referans(props) {
	const [parametreOptionsState, setParametreOptions] = useState([])
	const [isLoading,setIsLoading] = useState(false)
	const [references,setReferences] = useState()
	const [showAlert, setShowAlert] = useState(false)
	const [isClicked, setIsClicked] = useState(false)
	const targetYil = useRef(null);
	const [selectedYonetmelikYili, setSelectedYonetmelikYili] = useState('')
	const [selectedSuTipi, setSelectedSuTipi] = useState('')
	const [showYil, setShowYil] = useState(false);
	const [alert,setAlert] = useState({
		hasAlert: false,
		isError: false,
		isSucces: false,
		isInfo: false,
		message: null
	})
	
	// "yonetmelik_yili",
	// "table_type",
	// "sinif",

	useEffect(() => {
		const parametreler = [
			"Amonyum_Azotu",
			"Elektriksel_İletkenlik",
			"Toplam_Koliform",
			"Tuzluluk",
			"Nitrat_Azotu",
			"Çözünmüş_Oksijen",
			"Biyokimyasal_Oksijen_İhtiyacı",
			"Toplam_Pestisit",
			"Debi",
			"Kimyasal_Oksijen_İhtiyacı",
			"Nitrit_Azotu",
			"Toplam_Kjeldahl_Azotu",
			"Fekal_Koliform",
			"Toplam_Fosfor",
			"Sıcaklık",
			"Toplam_Çözünmüş_Madde",
			"Askıda_Katı_Madde",
			"Orto_Fosfat",
			"Fekal_Streptokok",
			"Amonyak",
			"Toplam_Fenol",
			"Klorofil",
			"Toplam_Azot",
			"Işık_Geçirgenliği",
			"Yağ",
			"pH",
			"Renk",
			"Renk_Koku",
			"Koku",
		]
		const parametreOptions = []

		parametreler.map((param) =>
		parametreOptions.push({
			id: param,
			Sınıf_1: null,
			Sınıf_2: null,
			Sınıf_3: null,
			Sınıf_4: null,
			Sınıf_5: null,
		}))
		setParametreOptions(parametreOptions)
	}, [])

	async function fetchReferences(e){
		const {data} = await axiosInstance.get(`http://127.0.0.1:8000/api/referans/${selectedYonetmelikYili}/${e}`)
		setReferences(data)
		setParametreOptions(data)
	}
	
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
		// if(stringParameters.includes(row.id))
		// 	return true

		// for (const i in parametreler){
		// 	if(row.id === parametreler[i]){
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
		// 	}
		// }
	}
	
	let columns = [
		{
			dataField: "id",
			text: "Parametreler",
		},
		{
			dataField: "Sınıf_1",
			text: "1. sinif",
			editable: true,
			validator: validation.bind(this),
		},
		{
			dataField: "Sınıf_2",
			text: "2. sinif",
			editable: true,
			validator: validation.bind(this),
		},
		{
			dataField: "Sınıf_3",
			text: "3. sinif",
			editable: true,
			validator: validation.bind(this),
		},
		{
			dataField: "Sınıf_4",
			text: "4.sinif",
			editable: true,
			validator: validation.bind(this),
		},
		{
			dataField: "Sınıf_5",
			text: "5. sinif",
			editable: true,
			validator: validation.bind(this),
		},

	]

	const veriGonder = () => {
		setIsLoading(true)
		setShowAlert(true)
		console.log(...parametreOptionsState)
		axiosInstance
			.post("http://127.0.0.1:8000/api/postreferans/", {
				
				...parametreOptionsState,
				yonetmelik_yili: selectedYonetmelikYili,
				table_type: selectedSuTipi,
			})
			.then(function (response) {
				setAlert({
					hasAlert: true,
					isSucces: true,
					isInfo: false,
					isError: false,
					message: "Veri tabanına başarıyla eklendi."
				})
				setSelectedSuTipi("")
				setSelectedYonetmelikYili("")
				setIsLoading(false)
				setIsClicked(false)
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

	const CaptionElement = () => (
		<h3 style={{ borderRadius: "0.25em", textAlign: "center", padding: "0.5em" }}>{`${selectedYonetmelikYili} - ${selectedSuTipi}`}</h3>
	)

	const yonetmelikOptions = [
		{
			name: '2017 oncesi',
			value: '2017'
		},
		{
			name: '2017 sonrasi',
			value: '2020'
		}
	]
	const suTipiOptions = [
		{
			name: 'Akarsu',
			value: 'Akarsu'
		},
		{
			name: 'Deniz',
			value: 'Deniz'
		},
		{
			name: 'Göl',
			value: 'Göl'
		},
		{
			name: 'Arıtma',
			value: 'Arıtma'
		}
	]
	function handleBlurYil(f,e){
		var num = Number(selectedYonetmelikYili);
			if(isNaN(num)){
				console.log('invalid')
				setSelectedYonetmelikYili('')
				setShowYil(true)
			}
			else{
				console.log('valid')
				setShowYil(false)
			}
	}
	return (
		<div>
			<Container>
				<Row>
					<Col>
						<InputGroup ref={targetYil} className="mb-3" style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px" }}>
							<InputGroup.Prepend>
								<InputGroup.Text>Yönetmelik Yılı</InputGroup.Text>
							</InputGroup.Prepend>
							<FormControl onChange={(e) => {
								setSelectedYonetmelikYili(e.target.value)
								setSelectedSuTipi("")
								setIsClicked(false)
								setShowAlert(false)
							}} value={selectedYonetmelikYili || ""} onBlur={handleBlurYil.bind(this)}/>
						</InputGroup>
						<Overlay target={targetYil.current} show={showYil} placement="bottom">
							{({ placement, arrowProps, show: _showYil, popper, ...props }) => (
							<div
								{...props}
								style={{
								backgroundColor: 'rgba(255, 100, 100, 0.85)',
								margin: ".3rem 0rem",
								padding: '8px 16px',
								color: 'white',
								borderRadius: 3,
								width:"300px",
								boxShadow:"0 .0625rem .125rem rgba(0, 0, 0, 0.15)",
								...props.style,
								}}
							>
								Uygun yıl giriniz.
							</div>
							)}
						</Overlay>
					</Col>
					<Col>
						<SelectSearch
							options={suTipiOptions}
							search
							value={selectedSuTipi || ""}
							emptyMessage={() => <div style={{ textAlign: "center", fontSize: "0.8em" }}>Aradığınız Seçenek Bulunamadı.</div>}
							placeholder="Su Tipi"
							filterOptions={fuzzySearch}
							onChange={(e) => {
								setSelectedSuTipi(e)
								fetchReferences(e)
								setIsClicked(false)
								setShowAlert(false)
							}}
						/>
					</Col>
				</Row>
			</Container>
			<Row className={"button-container"}>
				<ButtonGroup aria-label="Basic example">
					<Button onClick={() => {setIsClicked(true)}} style={{ maxWidth:'10rem',fontWeight: "500", fontSize: "15px" }} disabled={!selectedSuTipi || !selectedYonetmelikYili}>
						Tabloyu Getir
					</Button>
				</ButtonGroup>
			</Row>
			{
				isClicked ?
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

							{/* <Card.Footer className="text-muted">
								{ alert.hasAlert ? (
										<Alert  variant={alert.isSucces ? "success" : "danger"}>
											{alert.message}
										</Alert>
								): ""
								}
							</Card.Footer> */}
						</Card>
					</Col>
				</Row>
			</Container>
			:
			<></>
			}
			
		</div>
	);
}

export default Referans;
