import request from "request";
import { NotificationManager } from "react-notifications";
import Client from '../ClientApi';

class Buscas {

	state = {
		client : new Client(),
	};

	buscarDetalhes = (dot, createdot) => {
		if (dot.id !== "erro") {

			request({
				url: "https://api.foursquare.com/v2/venues/" + dot["id"],
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
					dot = content["response"]["venue"];
				}
				createdot(dot);
			});
		}
	};
	pesquisaFoursquare = (location, addlist, openModal) => {
		let list = [];
		request({
			url: "https://api.foursquare.com/v2/venues/explore",
			method: "GET",
			qs: {
				client_id: this.state.client.client_id,
				client_secret:this.state.client.client_secret,
				ll: location.lat() + "," + location.lng(),
				v: "20180323"
			}
		}, function (err, res, body) {
			if (err) {
				console.error(err);
			} else if (JSON.parse(body)["meta"]["code"] !== 200) {
				// trata o erro de caso tenha sido atingido o limite de requisições
				console.error(JSON.parse(body)["meta"]["errorDetail"]);
				NotificationManager.error("Houve um problema tente novamente mais tarde", "Algo deu errado");
				list = [
					{
						"id": "erro",
						"nome": "Erro: não foi possível recuperar",
						"endereco": "O numero maximo de requeisição foi atingido aguarde um dia"
					}
				];
			} else {
				let content = JSON.parse(body);
				if (content["response"]["groups"][0]["items"]) {
					list = content["response"]["groups"][0]["items"]
						.sort((item_a, item_b) =>
							item_a["venue"]["location"]["distance"] - item_b["venue"]["location"]["distance"])
						.map((item) => (
							{
								"id": item["venue"]["id"],
								"nome": item["venue"]["name"],
								"endereco": item["venue"]["location"]["address"],
								"categoria": item["venue"]["categories"][0]["name"]
							}
						));
					// fim do trecho de pesquisa do Foursquare

					addlist(list);
					openModal();
				}
			}
		});
	};
}

export default Buscas;