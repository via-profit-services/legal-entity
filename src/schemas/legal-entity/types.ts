import { IContext } from '@via-profit-services/core';

export type Context = Pick<IContext, 'knex' | 'timezone' | 'logger' | 'token'>

export interface ILegalEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  label: string;
  nameFull: string;
  nameShort: string;
  address: string;
  ogrn: string;
  kpp?: string;
  inn: string;
  directorNameNominative: string;
  directorNameGenitive: string;
  directorNameShortNominative: string;
  directorNameShortGenitive: string;
  comment: string;
  deleted: Boolean;
  payments: Array<{
    id: string;
  }> | null;
  city: {
    id: string;
  } | null;
}


export type TLegalEntityInputTable = Omit<ILegalEntity,
'id' | 'createdAt' | 'updatedAt' | 'directorNameShort' | 'payments' | 'city'> & {
  id?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  city: string | ILegalEntity['city'];
};

export type ILegalEntityOutputTable = Omit<ILegalEntity, 'payments' | 'city'> & {
  totalCount: number;
  payments: string;
  city: string | null;
};


export interface ICreateArgs {
  input: Omit<TLegalEntityInputTable, 'payments'> & {
    payments: ILegalEntityPaymentInputTable[];
  };
}

export interface IUpdateArgs {
  id: string;
  input: Omit<TLegalEntityInputTable, 'payments'> & {
    payments?: ILegalEntityPaymentInputTable[];
  };
}

export interface IDeleteArgs {
  id?: string;
  ids?: string[];
}
export interface IRestoreArgs {
  id: string;
}

export interface IExternalSearchArgs {
  query: string;
}

export interface ILegalEntityPayment {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  owner: {
    id: string;
  };
  rs: string;
  ks: string;
  bic: string;
  bank: string;
  comment: string | null;
  deleted: boolean;
}

export type ILegalEntityPaymentInputTable = Omit<ILegalEntityPayment,
 'createdAt' | 'updatedAt' | 'owner'> & {
  createdAt: string | ILegalEntityPayment['createdAt'];
  updatedAt: string | ILegalEntityPayment['updatedAt'];
  owner: string | ILegalEntityPayment['owner'];
};

export type ILegalEntityPaymentOutputTable = ILegalEntityPayment & {
  totalCount: number;
};


export enum ILegalEntityExternalSearchState {
  ACTIVE,
  LIQUIDATING,
  LIQUIDATED,
  REORGANIZING,
}

export enum ILegalEntityExternalSearchBranchType {
  MAIN,
  BRAHCN,
}

export enum ILegalEntityExternalSearchType {
  LEGAL,
  INDIVIDUAL,
}

export interface ILegalEntityExternalSearchResult {
  label: string;
  nameFull: string;
  nameShort: string;
  address: string;
  ogrn: string;
  kpp?: string;
  inn: string;
  directorNameNominative: string;
  directorNameShortNominative: string;
  state: ILegalEntityExternalSearchState;
  branchType: ILegalEntityExternalSearchBranchType;
  city: {
    id: string;
  } | null;
  registrationDate: Date;
  liquidationDate: Date | null;
  type: ILegalEntityExternalSearchType;
}
