interface IModelDetails {
	loading: boolean;
	not_found: boolean;
	detailsView: boolean;
	name: string;
	author: string;
	summary: string;
	description: string;
	owner: boolean;
	models: IModel[];
}

interface IModel {
	name: string;
	accuracy: number;
	precision: number;
	recall: number;
	f1_score: number;
	confusion_matrix: string[];
}
