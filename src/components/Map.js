import React, { Component } from "react";
import MapWrapper from "./MapWrapper.js";
import Modal from "react-responsive-modal";
import Buscas from "./Buscas";
import Client from '../ClientApi';
import { NotificationManager } from "react-notifications";

class Map extends Component {
	state = {
		modalOpen: false,
		locals: [],
		buscas : new Buscas(),
		client : new Client(),
	};

	constructor (){
	super()
	if(this.state.client.googleMapURL === "")
		{
			NotificationManager.error("Não foi possivel carregar o Mapa", "Algo deu errado");
		}
	 }
	 
	//altera o estado do modal para aberto
	openModal = () => {
		this.setState({ modalOpen: true });
	};
	//Altera o estado do modal para fechado
	closeModal = () => {
		this.setState({ modalOpen: false });
	};
	//Altera o estado da lista com o parâmetro dado
	addlist = (list) => {
		this.setState({ locals: list });
	};
	//Utiliza a API do Foursquare para pesquisar os locais da área clicada
	pesquisaFoursquare = (location, addlist, openModal) => {
		this.state.buscas.pesquisaFoursquare(location, addlist, openModal)
	};
	//Utiliza a API do Foursquare buscar mais informações do local escolhido
	buscarDetalhes = (dot, createdot) => {
		this.state.buscas.buscarDetalhes(dot, createdot)
	};

	componentDidMount()
	{
	
	}

	//Renderiza o conteúdo da aplicação da classe Mapa
	render() {
		const {
			sidebarToggled,
			dots,
			selectMark,
			unselectMark,
			createdot,
			selectedMark,
			openModalApp
		} = this.props;

		const isEmpty = this.state.client.googleMapURL !== "";

		return (

			  isEmpty ? (
				<main className={sidebarToggled ? "map-toggle" : "map"}>
				<MapWrapper
					pesquisaFoursquare={this.pesquisaFoursquare}
					selectMark={selectMark}
					unselectMark={unselectMark}
					dots={dots}
					selectedMark={selectedMark}
					openModal={this.openModal}
					openModalApp={openModalApp}
					addlist={this.addlist}
					googleMapURL= {this.state.client.googleMapURL}
					loadingElement={<div style={{ height: `100%` }} />}
					containerElement={<div style={{ height: `100%` }} />}
					mapElement={<div style={{ height: `100%` }} />}
				/>

				<div>
					<Modal
						open={this.state.modalOpen}
						onClose={this.closeModal}
						center
					>
						<h2>Escolha o local que você gostaria de adicionar:</h2>
						{this.state.locals.map((local, i) => (
							<div key={i}>
								<div
									className="local-choose"
									onClick={() => { this.buscarDetalhes(local, createdot); this.closeModal() }}
								>
									<h3>{local["nome"]}</h3>
									<p>
										<strong>Categoria: </strong>
										{local["categoria"]}
									</p>
									<p>
										<strong>Endereço: </strong>
										{local["endereco"]}
									</p>
								</div>
								<hr />
							</div>
						))}
					</Modal>
				</div>
			</main>
			  ) : (
				<div></div>
			  )
		);
	};
};

export default Map;