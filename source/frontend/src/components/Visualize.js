import React, { useEffect, useState, useRef } from "react";
import GraphContainer from "./GraphContainer";
import { Row, Col, Container, ButtonGroup, Button, Spinner, Overlay, OverlayTrigger, Tooltip} from "react-bootstrap";
import axios from "axios";
import SelectSearch, { fuzzySearch } from "react-select-search";
import ReactToPdf from "react-to-pdf";
import { FloatingButton, Item } from "react-floating-button";



const defineLocationType = (locationType) =>{
    switch (locationType) {
        case "akarsu":
            return "Akarsu"
            break;
        case "deniz":
            return "Deniz"
            break;
        case "aritma":
            return "Arıtma"
            break;
        case "gol":
            return "Göl"
            break;
        default:
            break;
    }
}


const Visualize = (props) => {
    let locationType = defineLocationType(props.location.pathname.substring(1));
	const [Locations, setLocations] = useState();
	const [bolgeAdlari, setBolgeAdlari] = useState([]);
	const [yerAdlari, setYerAdlari] = useState([]);
	const [parametreler, setParametreler] = useState([]);
	const [yillar, setYillar] = useState([]);
	//-----------------
	const [selectedBolge, setSelectedBolge] = useState(false);
	const [selectedYer, setSelectedYer] = useState(false);
	const [selectedParametre, setSelectedParametre] = useState(false);
	const [selectedYil, setSelectedYil] = useState(false);

	const [queryInfo, setQueryInfo] = useState([]);
	const [show, setShow] = useState(false);
  	const target = useRef(null);

	const [isDisabled, setisDisabled] = useState(false)
	const ref = React.createRef();
	useEffect(() => {
        // change
		async function fetchLocations() {
			const { data } = await axios.get(`http://127.0.0.1:8000/api/locations/${locationType}`);
			setBolgeAdlari(data)
		}
		fetchLocations();
	}, []);
    async function fetchYer(bolge_adi) {
        await axios.get(`http://127.0.0.1:8000/api/locations/${locationType}/${bolge_adi}`).then(res =>
			{
				setYerAdlari(res.data)
			}
		)

    }
	async function fetchParameters(yer) {
		let parametreArray = [];
		const { data } = await axios.get(`http://127.0.0.1:8000/api/locations/${locationType}/${selectedBolge}/${yer}`);
		data.map((parametre) => {
			parametreArray.push(parametre);
		});
		setParametreler(parametreArray);
	}
	async function fetchYillar(parametre) {
		const yilOptions = [];
        const { data } = await axios.get(`http://127.0.0.1:8000/api/locations/${locationType}/${selectedBolge}/${selectedYer}/${parametre}`);
        data.forEach((yil) => yilOptions.push({ name: yil, value: yil }));
		yilOptions.splice(0, 0, { name: "Hepsi", value: "all" });
		setYillar(yilOptions)
    }
	const BolgeOptions = [];
	const YerOptions = [];
	const parametreOptions = [];


	bolgeAdlari.map((bolge) => BolgeOptions.push({ name: bolge, value: bolge }));
	yerAdlari.map((yer) => YerOptions.push({ name: yer, value: yer }));
	parametreler.map((parametre) => parametreOptions.push({ name: parametre, value: parametre }));
	parametreOptions.splice(0, 0, { name: "Hepsi", value: "all" });



	const showInfo = (chartType) => {
		let temparray = [chartType, selectedBolge, selectedYer, selectedParametre, selectedYil];
		setQueryInfo(temparray);
	};
	return (
		<>
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
								onChange={(e) => {setSelectedBolge(e); fetchYer(e)}}
							/>
						) : <Container><Row style={{alignSelf:"flex-end",justifyContent:"center", alignItems:"flex-end"}} ><Spinner  className={"select-search"} animation="border" variant="primary" /></Row></Container>}
					</Col>
					<Col xs={12} sm={12} md={6} lg={3} xl={3}>
						<SelectSearch
							options={YerOptions}
							search
							emptyMessage={() => <div style={{ textAlign: "center", fontSize: "0.8em" }}>Not found renderer</div>}
							placeholder="Yer"
							filterOptions={fuzzySearch}
							onChange={(e) => {setSelectedYer(e); fetchParameters(e);}}
						/>
					</Col>
					<Col xs={12} sm={12} md={6} lg={3} xl={3}>
						<SelectSearch
							options={parametreOptions}
							search
							emptyMessage={() => <div style={{ textAlign: "center", fontSize: "0.8em" }}>Not found renderer</div>}
							placeholder="Parametre"
							filterOptions={fuzzySearch}
							onChange={(e) => {setSelectedParametre(e); fetchYillar(e);}}
						/>
					</Col>
					<Col xs={12} sm={12} md={6} lg={3} xl={3}>
						<SelectSearch
							ref={target}
							options={yillar}
							search
							emptyMessage={() => <div style={{ textAlign: "center", fontSize: "0.8em" }}>Not found renderer</div>}
							placeholder="Yıl"
							multiple
							printOptions="on-focus"
							filterOptions={fuzzySearch}
							onChange={(e) => {e.length > 2 ? setShow(true) : setShow(false) ; setSelectedYil(e);}}
						/>
						 <Overlay target={target.current} show={show} placement="bottom">
								{({ placement, arrowProps, show: _show, popper, ...props }) => (
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
									Görmek istediğiniz değerlerin başlangıç ve bitiş yıllarını seçiniz. İkiden fazla değer seçemezsiniz.
								</div>
								)}
					</Overlay>
					</Col>
				</Row>
			</Container>
			<Row className={"button-container"}>
				<ButtonGroup aria-label="Basic example">
					<Button onClick={() => showInfo("Bar")} style={{ fontWeight: "500", fontSize: "15px" }} disabled= {!selectedBolge || !selectedParametre || !selectedYer || !selectedYil || (selectedParametre === "all" && selectedYil[0] === "all")}>
						Bar
					</Button>
					<Button onClick={() => showInfo("Cizgi")} style={{ fontWeight: "500", fontSize: "15px" }} disabled= { selectedYil[0] === "all" || !selectedBolge || !selectedParametre || !selectedYer || !selectedYil }>
						Çizgi
					</Button>
					<OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Tooltip!</Tooltip>} show={false}>
					<span className="d-inline-block">
						<Button onClick={() => showInfo("Tablo")} style={{ fontWeight: "500", fontSize: "15px"}} disabled={selectedParametre === "all" && (selectedYil?.length == 1  && selectedYil[0] !== "all") ? false : true} >
							Tablo
						</Button>
						</span>
					</OverlayTrigger>
				</ButtonGroup>
			</Row>

			<Container  fluid={queryInfo[0] === "Tablo"} className="graph-container">{queryInfo.length !== 0 ? <GraphContainer  queries={queryInfo} /> : null}</Container>


		</>
	);
};

export default Visualize;
