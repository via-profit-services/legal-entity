import { IContext } from '@via-profit-services/core';
export declare type Context = Pick<IContext, 'knex' | 'timezone' | 'logger' | 'token'>;
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
export declare type TLegalEntityInputTable = Omit<ILegalEntity, 'id' | 'createdAt' | 'updatedAt' | 'directorNameShort' | 'payments' | 'city'> & {
    id?: string;
    createdAt: string | Date;
    updatedAt: string | Date;
    city: string | ILegalEntity['city'];
};
export declare type ILegalEntityOutputTable = Omit<ILegalEntity, 'payments' | 'city'> & {
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
export declare type ILegalEntityPaymentInputTable = Omit<ILegalEntityPayment, 'createdAt' | 'updatedAt' | 'owner'> & {
    createdAt: string | ILegalEntityPayment['createdAt'];
    updatedAt: string | ILegalEntityPayment['updatedAt'];
    owner: string | ILegalEntityPayment['owner'];
};
export declare type ILegalEntityPaymentOutputTable = ILegalEntityPayment & {
    totalCount: number;
};
export declare enum ILegalEntityExternalSearchState {
    ACTIVE = 0,
    LIQUIDATING = 1,
    LIQUIDATED = 2,
    REORGANIZING = 3
}
export declare enum ILegalEntityExternalSearchBranchType {
    MAIN = 0,
    BRAHCN = 1
}
export declare enum ILegalEntityExternalSearchType {
    LEGAL = 0,
    INDIVIDUAL = 1
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
