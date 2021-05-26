import React from "react";
import { Card, Table } from "react-bootstrap";

function Referans({ referans, parametre }) {
	return (
		<div>
			<Card className="my-3 p-3" style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px" }}>
				<Table>
					<thead>
						<th>#</th>
						<th>{parametre}</th>
					</thead>
					<tbody>
						<tr>
							<td>1. Sinif</td>
							<td>{referans[0]}</td>
						</tr>
						<tr>
							<td>2. Sinif</td>
							<td>{referans[1]}</td>
						</tr>
						<tr>
							<td>3. Sinif</td>
							<td>{referans[2]}</td>
						</tr>
						<tr>
							<td>4. Sinif</td>
							<td>{referans[3]}</td>
						</tr>
					</tbody>
				</Table>
			</Card>
		</div>
	);
}

export default Referans;
