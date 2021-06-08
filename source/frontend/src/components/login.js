import React, { useState } from "react"
import axios from "axios"
import axiosInstance from '../axios';
import { Redirect, useHistory } from "react-router-dom"
import { Container, Button, Form, Card, CardImg } from "react-bootstrap"
import App from "../App"
import ReactLogo from '../logo.svg';

export default function Login() {
	const [isLogged, setIsLogged] = useState(false)
	const [responseData, setResponseData] = useState([])
	const history = useHistory()
	const initialFormData = Object.freeze({
		username: "",
		password: "",
	})

	const [formData, updateFormData] = useState(initialFormData)

	const handleChange = (e) => {
		updateFormData({
			...formData,
			[e.target.name]: e.target.value.trim(),
		})
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		// console.log(formData)

		// axios
		// 	.post("http://127.0.0.1:8000/api/login", {
		// 		username: formData.username,
		// 		password: formData.password,
		// 	})
		// 	.then(function (response) {
		// 		console.log(response)
		// 		setIsLogged(true)
		// 		setResponseData(response.data)
		// 	})
		// 	.catch(function (error) {
		// 		console.log(error)
		// 	})
		axiosInstance
			.post(`login/`, {
				username: formData.username,
				password: formData.password,
			})
			.then((res) => {
				localStorage.setItem("access_token", res.data.access);
				localStorage.setItem("refresh_token", res.data.refresh);
				localStorage.setItem("group", res.data.group);
				axiosInstance.defaults.headers["Authorization"] = "JWT " + localStorage.getItem("access_token");
				setResponseData(res.data.group)
				console.log("resp ", res)
				setIsLogged(true)
				history.push("/");
				//console.log(res);
				//console.log(res.data);
			});
	}

	return isLogged ? (
		<>
			<App data={responseData} />
		</>
	) : (
		<>
			<div className="login-container">
			<Container style={{ width:"500px", height:"100vh",display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
				<Card className="p-5" style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px", justifyContent: "center", alignItems: "center" }}>
					<Card.Img variant="top" src={ReactLogo} />
					<Card.Body>
						<Form>
							<Form.Group controlId="formBasicEmail">
								<Form.Label style={{fontWeight:"bold"}}>Kullanıcı Adı</Form.Label>
								<Form.Control type="username" name="username" placeholder="Kullanıcı Adı" onChange={handleChange} />
							</Form.Group>

							<Form.Group controlId="formBasicPassword">
								<Form.Label style={{fontWeight:"bold"}}>Şifre</Form.Label>
								<Form.Control type="password" name="password" placeholder="Şifre" onChange={handleChange} />
							</Form.Group>
							<Button variant="outline-info" type="submit" onClick={handleSubmit} block style={{textTransform:"none",fontSize:"1rem"}}>
								Giriş Yap
							</Button>
						</Form>
					</Card.Body>
				</Card>
			</Container>
			</div>
		</>
	)
}
