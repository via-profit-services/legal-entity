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
    }>;
}
export interface ILegalEntityExternalSearchResult {
    name: string;
    address: string;
    ogrn: string;
    kpp: string;
    inn: string;
    city: string;
    country: string;
    countryCode: string;
    region: string;
    directorNameNominative: string;
}
export declare type TLegalEntityInputTable = Omit<ILegalEntity, 'id' | 'createdAt' | 'updatedAt' | 'directorNameShort' | 'payments'> & {
    id?: string;
    createdAt: string | Date;
    updatedAt: string | Date;
};
export declare type ILegalEntityOutputTable = ILegalEntity & {
    totalCount: number;
    payments: string;
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
