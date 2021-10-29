import * as React from 'react';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import RadioPill, { RadioPillRow } from '~components/radioPills/RadioPill';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '~components/dialogs';
import Dropdown, { DropdownOption } from '~components/dropdown/Dropdown';
import { Tooltip } from '~components/tooltips';
import WorldIcon from '@material-ui/icons/Public';
import CopyToClipboard from '~components/copyToClipboard/CopyToClipboard';
import { DTExampleProps, DTHelpProps, DTMetadata, DTOptionsProps } from '~types/dataTypes';
import CreatablePillField from '~components/creatablePillField/CreatablePillField';
import styles from './Names.scss';
import { countryList } from '../../../../_plugins';
import { CountryType } from '~types/countries';

export const enum NamesSource {
	any = 'any',
	countries = 'countries'
}

export type NamesState = {
	example: string;
	options: string[];
	source: NamesSource;
	selectedCountries: string[];
};

export const initialState: NamesState = {
	example: 'Name Surname',
	options: ['Name Surname'],
	source: NamesSource.any,
	selectedCountries: []
};

export const rowStateReducer = (state: NamesState): string[] => state.options;

export const Example = ({ i18n, data, onUpdate }: DTExampleProps): JSX.Element => {
	const onChange = (selected: DropdownOption): void => {
		onUpdate({
			example: selected.value,
			options: selected.value.split('|')
		});
	};

	const options = [
		{ value: 'Name Surname', label: i18n.example_Name_Surname },
		{ value: 'Name', label: i18n.example_Name },
		{ value: 'MaleName', label: i18n.example_MaleName },
		{ value: 'FemaleName', label: i18n.example_FemaleName },
		{ value: 'MaleName Surname', label: i18n.example_MaleName_Surname },
		{ value: 'FemaleName Surname', label: i18n.example_FemaleName_Surname },
		{ value: 'Name Initial. Surname', label: i18n.example_Name_Initial_Surname },
		{ value: 'Surname', label: i18n.example_surname },
		{ value: 'Surname, Name Initial.', label: i18n.example_Surname_Name_Initial },
		{ value: 'Name, Name, Name, Name', label: i18n.example_Name4 },
		{ value: 'Name Surname|Name Initial. Surname', label: i18n.example_fullnames }
	];

	return (
		<Dropdown
			value={data.example}
			options={options}
			onChange={onChange}
		/>
	);
};

const NamesDialog = ({ visible, data, id, onClose, countryI18n, onUpdateSource, onUpdateSelectedCountries, coreI18n, i18n }: any): JSX.Element => {
	const countryPluginOptions = countryList.map((countryName: CountryType) => ({
		value: countryName,
		label: countryI18n[countryName]?.countryName
	}));

	const onSelectCountries = (countries: any): void => {
		onUpdateSelectedCountries(countries ? countries.map(({ value }: DropdownOption) => value) : []);
	};

	console.log({
		countries: data.selectedCountries,
		action: onSelectCountries,
		countryPluginOptions
	});

	return (
		<Dialog onClose={onClose} open={visible}>
			<div style={{ width: 500 }}>
				<DialogTitle onClose={onClose}>Customize names source</DialogTitle>
				<DialogContent dividers>
					<div>
						By default this data type generates mostly Western names, but if you want to generate names more
						appropriate to a particular region, select those countries below.
					</div>

					<h3>{i18n.source}</h3>

					<RadioPillRow>
						<RadioPill
							label="Mostly western names"
							onClick={(): void => onUpdateSource(NamesSource.any)}
							name={`${id}-source`}
							checked={data.source === NamesSource.any}
							tooltip="..."
						/>
						<RadioPill
							label="Country names"
							onClick={(): void => onUpdateSource(NamesSource.countries)}
							name={`${id}-source`}
							checked={data.source === NamesSource.countries}
						/>
					</RadioPillRow>

					{data.source === NamesSource.countries && (
						<Dropdown
							isMulti
							closeMenuOnSelect={false}
							isClearable={true}
							value={data.selectedCountries}
							onChange={onSelectCountries}
							options={countryPluginOptions}
						/>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={onClose} color="primary" variant="outlined">{coreI18n.close}</Button>
				</DialogActions>
			</div>
		</Dialog>
	);
};

export const Options = ({ data, id, onUpdate, i18n, coreI18n, countryI18n }: DTOptionsProps): JSX.Element => {
	const [visible, setDialogVisibility] = React.useState(false);

	const safeData = {
		source: NamesSource.any,
		selectedCountries: [],
		...data
	};

	const onUpdateSource = (source: NamesSource): void => {
		onUpdate({
			...safeData,
			source
		});
	};

	const onUpdateSelectedCountries = (selectedCountries: string[]): void => {
		onUpdate({
			...safeData,
			selectedCountries
		});
	};

	return (
		<div style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
			<div className={styles.pillField}>
				<CreatablePillField
					value={safeData.options}
					onChange={(options: any): void => onUpdate({ ...safeData, options })}
				/>
			</div>
			<Tooltip title="Customize regional names" placement="bottom" arrow>
				<span>
					<IconButton size="small" onClick={(): void => setDialogVisibility(true)}>
						<WorldIcon fontSize="small" />
					</IconButton>
				</span>
			</Tooltip>
			<NamesDialog
				visible={visible}
				data={safeData}
				id={id}
				onClose={() => setDialogVisibility(false)}
				onUpdateSource={onUpdateSource}
				onUpdateSelectedCountries={onUpdateSelectedCountries}
				i18n={i18n}
				coreI18n={coreI18n}
				countryI18n={countryI18n}
			/>
		</div>
	);
};

const Copy = ({ content, message, tooltip }: any): JSX.Element => (
	<span className={styles.copy}>
		<CopyToClipboard
			tooltip={tooltip}
			content={content}
			message={message}
		/>
	</span>
);

export const Help = ({ coreI18n, i18n }: DTHelpProps): JSX.Element => (
	<>
		<p>
			{i18n.DESC} {i18n.help_intro}
		</p>

		<div className={styles.row}>
			<div className={styles.col1}>
				<label>Name</label>
			</div>
			<div className={styles.copyCol}>
				<Copy content="Name" message={coreI18n.copiedToClipboard} tooltip={coreI18n.copyToClipboard}/>
			</div>
			<div className={styles.col2}>{i18n.type_Name}</div>
		</div>
		<div className={styles.row}>
			<div className={styles.col1}>
				<label>MaleName</label>
			</div>
			<div className={styles.copyCol}>
				<Copy content="MaleName" message={coreI18n.copiedToClipboard} tooltip={coreI18n.copyToClipboard}/>
			</div>
			<div className={styles.col2}>{i18n.type_MaleName}</div>
		</div>
		<div className={styles.row}>
			<div className={styles.col1}>
				<label>FemaleName</label>
			</div>
			<div className={styles.copyCol}>
				<Copy content="FemaleName" message={coreI18n.copiedToClipboard} tooltip={coreI18n.copyToClipboard}/>
			</div>
			<div className={styles.col2}>{i18n.type_FemaleName}</div>
		</div>
		<div className={styles.row}>
			<div className={styles.col1}>
				<label>Initial</label>
			</div>
			<div className={styles.copyCol}>
				<Copy content="Initial" message={coreI18n.copiedToClipboard} tooltip={coreI18n.copyToClipboard}/>
			</div>
			<div className={styles.col2}>{i18n.type_Initial}</div>
		</div>
		<div className={styles.row}>
			<div className={styles.col1}>
				<label>Surname</label>
			</div>
			<div className={styles.copyCol}>
				<Copy content="Surname" message={coreI18n.copiedToClipboard} tooltip={coreI18n.copyToClipboard}/>
			</div>
			<div className={styles.col2}>{i18n.type_Surname}</div>
		</div>
	</>
);

export const getMetadata = (): DTMetadata => ({
	sql: {
		field: 'varchar(255) default NULL',
		field_Oracle: 'varchar2(255) default NULL',
		field_MSSQL: 'VARCHAR(255) NULL'
	}
});
