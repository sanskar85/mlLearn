interface ICreateModel {
	file: File | null;
	stage: CREATE_STAGE;
	// csv: any;
	columns: string[];
	rows: IRow[];

	id: string;
	name: string;
	summary: string;
	description: string;

	active_column: number;
	column_details: IColumnDetails[];
	results_mapping: { [key: string]: string };
}

interface IRow {
	[key: string]: string;
}

interface IColumnDetails {
	name: string;
	label: string;
	required: boolean;
	independent: boolean;
	dependent: boolean;
}
