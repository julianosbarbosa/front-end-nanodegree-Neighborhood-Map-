import React, { Component } from "react";
import "./styles/App.css";
import "./styles/react-notifications.css";
import Map from "./components/Map.js";
import ListMark from "./components/ListMark.js";
import escapeRegExp from "escape-string-regexp";
import Modal from "react-responsive-modal";
import request from "request";
import { NotificationContainer, NotificationManager } from "react-notifications";
import Client from "./ClientApi";

class App extends Component {

	state = {
		dots: [],
		sidebarToggled: false,
		selectedMark: null,
		query: "",
		modalOpen: false,
		client: new Client(),
		hasError: false
	};
	
	//Função para realizar operações depois que a aplicação é renderizada
	componentDidMount() {
		let ids = [
			"4b869f79f964a520cc9231e3",
			"52001b85498e8c87b0111511",
			"4eab50aa00392665f789eef1",
			"527043c511d2a841f7f79f2c",
			"4e2c1b7ee4cd3bc1669be32a",
			"5166f297e4b0f7887efa4241",
			"5212498611d2ffc872cfcbae"

		];

		this.colocarPontosMapa(ids);
	};

	static getDerivedStateFromError(errors) {
		return { hasError: errors };
	}

	colocarPontosMapa = (ids) => {
		let state = this;
		let startDots = [];
		ids.map((id) => (
			// início da pesquisa
			request({
				url: "https://api.foursquare.com/v2/venues/" + id,
				method: "GET",
				qs: {
					client_id: this.state.client.client_id,
					client_secret: this.state.client.client_secret,
					v: "20180323"
				}
			}, function (err, res, body) {
				if (err) {
					console.error(err);
				} else if (JSON.parse(body)["meta"]["code"] !== 200) {
					console.error(JSON.parse(body)["meta"]["errorDetail"]);
					NotificationManager.error("Houve um problema tente novamente mais tarde", "Algo deu errado");
				} else {
					let content = JSON.parse(body);
					startDots.push(content["response"]["venue"]);
					state.setState({
						dots: startDots
					});
				}
			})
		));

	}

	//Atualiza o estado da query para refletir no componente de lista de marcadores
	updateQuery = (query) => {
		this.setState({ query: query.trim() });
	};
	//Atualiza o estado de marcadores, removendo o marcador indicado pelo parâmetro
	removeMark = (dot) => {
		this.setState((state) => ({
			dots: state.dots.filter((c) => c.id !== dot.id)
		}));
		NotificationManager.success("O local foi encontrado!", "Encontramos!");

	};
	//Atualiza o estado de marcadores, adicionando o marcador indicado pelo parâmetro
	createdot = (dot) => {
		this.setState(state => ({
			dots: state.dots.concat([dot])
		}));
		NotificationManager.success("Um local foi criado!", "Tudo certo!");
		console.log(dot)
	};
	//Alterna o estado da barra lateral entre esconder e mostrar
	toggleSidebar() {
		this.setState({ sidebarToggled: !this.state.sidebarToggled });
	};
	//Altera o estado de marcador selecionado pelo indicado pelo parâmetro
	selectMark = (dot) => {
		this.setState({ selectedMark: dot });
	};
	// Altera o estado de marcador selecionado para nulo
	unselectMark = () => {
		this.setState({ selectedMark: null });
	};
	//Altera o estado do modal para aberto
	openModal = () => {
		this.setState({ modalOpen: true });
	};
	//Altera o estado do modal para fechado
	closeModal = () => {
		this.setState({ modalOpen: false, selectedMark: null });
	};
	//Renderiza o conteúdo da aplicação da classe App
	render() {
		// início do trecho onde é realizado o filtro de marcadores
		let showingdots;

		if (this.state.hasError) {
			return <h1>Something went wrong.</h1>;
		}

		if (this.state.query) {
			const match = new RegExp(escapeRegExp(this.state.query), "i");
			showingdots = this.state.dots.filter((dot) => match.test(dot["name"]));
		} else {
			showingdots = this.state.dots;
		}

		return (
			
			<div className="app">
				<nav className="nav">
					<span className="btn">
						<a href="/" aria-label="Nome do bairro">Santa Clara do Lago 2</a>
					</span>

					<button type="button"
						onClick={() => this.toggleSidebar()} aria-label="abre e fecha sidebar"
					>
						☰
						</button>

					<span className="information">
						Utiliza a API do Google Maps e do Foursquare
				</span>


				</nav>

				<ListMark
					query={this.state.query}
					updateQuery={this.updateQuery}
					sidebarToggled={this.state.sidebarToggled}
					dots={showingdots}
					selectMark={this.selectMark}
					selectedMark={this.state.selectedMark}
				/>

				<Map
					sidebarToggled={this.state.sidebarToggled}
					dots={showingdots}
					selectMark={this.selectMark}
					unselectMark={this.unselectMark}
					selectedMark={this.state.selectedMark}
					createdot={this.createdot}
					openModalApp={this.openModal}
				/>

				<div>
					<Modal open={this.state.modalOpen} onClose={this.closeModal} center>
						{this.state.selectedMark &&
							<div>
								<h2>{this.state.selectedMark["name"]}</h2>
								<span className="btn-delete">
									<button type="button" aria-label="botão deletar local do mapa"
										onClick={() => { this.removeMark(this.state.selectedMark); this.closeModal() }}
									>
										Deletar
									</button>
								</span>
								<p>
									<strong>Categoria: </strong>
									{this.state.selectedMark["categories"][0]["name"]}
								</p>
								{this.state.selectedMark["tips"] &&
									<p>
										<strong>Top comentário: </strong>
										<em>
											{
												this.state.selectedMark["tips"]["groups"][0]["items"][0]["text"]
											}
										</em> - por {" "}
										<a
											target="_blank"
											rel="noopener noreferrer"
											className="link"
											href={this.state.selectedMark["tips"]["groups"][0]["items"][0]["canonicalUrl"]}
										>
											{
												this.state.selectedMark["tips"]["groups"][0]["items"][0]["user"]["firstName"]
											}
										</a>
									</p>
								}
								{this.state.selectedMark["price"] &&
									<p>
										<strong>Preço: </strong>
										{
											this.state.selectedMark["price"]["message"]
										}
									</p>
								}
								<p>
									<strong>Avaliação: </strong>
									{
										this.state.selectedMark["rating"]
									}
								</p>
								<p>
									<strong>Curtidas: </strong>
									{
										this.state.selectedMark["likes"]["count"]
									}
								</p>
								<p>
									<strong>Endereço: </strong>
									{this.state.selectedMark["location"]["formattedAddress"][0] + " - " +
										this.state.selectedMark["location"]["formattedAddress"][1]
									}
								</p>

								<img
									className="imagem"
									src={
										this.state.selectedMark["bestPhoto"]["prefix"] +
										"height500" +
										this.state.selectedMark["bestPhoto"]["suffix"]
									}
									alt={"Foto de " + this.state.selectedMark["name"]}
								/>
							</div>
						}
					</Modal>
				</div>

				<NotificationContainer />
			</div>
		);
	};
};

export default App;