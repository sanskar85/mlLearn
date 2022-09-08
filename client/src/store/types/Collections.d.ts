interface ICollections {
	loading: boolean;
	search_text: string;
	hasMore: boolean;
	limit: number;
	skip: number;
	collections: ICollection[];
}

interface ICollection {
	id: string;
	name: string;
	author: string;
	models: IModels[];
}

interface IModels {
	name: string;
	accuracy: number;
	precision: number;
	recall: number;
	f1_score: number;
}
