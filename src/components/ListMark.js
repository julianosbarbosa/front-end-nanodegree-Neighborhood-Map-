import React from "react";

//Componente trata da renderização da lista de marcadores

const listdots = (
	{dots,
	selectedMark,
	selectMark,
	sidebarToggled,
	updateQuery,
	query}) => {

		return (
			<aside className={sidebarToggled ? "sidebar-toggle" : "sidebar"}>
				<input aria-label="Digite o nome do local desejado"
					type="text"
					className="filter"
					placeholder="Encontre aqui... "
					value={query}
					onChange={(event) => updateQuery(event.target.value)}
				/>

				{dots.map((dot, i) => (
					<div
						key={i}
						className={"sidebar-inner" + (selectedMark === dot ? " selected" : "")}
						onClick={() => selectMark(dot)}
					>
						<p>{dot["name"]}</p>
					</div>
				))}
			</aside>
		);
};

export default listdots;