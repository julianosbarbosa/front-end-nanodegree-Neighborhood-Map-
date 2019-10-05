import React from "react";
import { Marker, InfoWindow } from "react-google-maps";


//Esse componente auxília marcador para poder definir funções e estados individualmente

const markWrapper = ({ dot,
	selectMark,
	unselectMark,
	selectedMark,
	openModalApp }) => {

	//Renderiza o conteúdo da aplicação da classe MarcadorWrapper
	return (
		<Marker
			animation={window.google.maps.Animation.DROP}
			icon={
				{
					url: selectedMark === dot ?
						"http://maps.google.com/mapfiles/ms/icons/green-dot.png" :
						"http://maps.google.com/mapfiles/ms/icons/red-dot.png"
				}
			}
			position={{ lat: dot["location"]["lat"], lng: dot["location"]["lng"] }}
			onClick={() => selectMark(dot)
			}
		>

			{selectedMark && selectedMark["id"] === dot["id"] &&
				<InfoWindow onCloseClick={() => unselectMark()}>

					<div
						onClick={() => openModalApp()}
						className="infowindow"
					>
						<img
							className="imagem-infowindow"
							src={
								dot["bestPhoto"]["prefix"] +
								"height250" +
								dot["bestPhoto"]["suffix"]
							}
							alt={"Foto de " + dot["name"]}
						/>
						<h2>{dot["name"]}</h2>
						<p>
							{dot["categories"][0]["name"]}
						</p>
						<p>
							{dot["location"]["formattedAddress"][0]}
						</p>
						<p>Clique para mais detalhes!</p>
					</div>
				</InfoWindow>
			}
		</Marker>
	);
};

export default markWrapper;