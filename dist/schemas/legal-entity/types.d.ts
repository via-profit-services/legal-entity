import { IContext } from '@via-profit-services/core';
export declare type Context = Pick<IContext, 'knex' | 'timezone' | 'logger' | 'token'>;
export interface ILegalEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    address: string;
    ogrn: string;
    kpp?: string;
    inn: string;
    rs: string;
    ks: string;
    bic: string;
    bank: string;
    directorNameNominative: string;
    directorNameGenitive: string;
    directorNameShortNominative: string;
    directorNameShortGenitive: string;
    comment: string;
    deleted: Boolean;
}
export declare type TLegalEntityInputTable = Omit<ILegalEntity, 'id' | 'createdAt' | 'updatedAt' | 'directorNameShort'> & {
    id?: string;
    createdAt: string | Date;
    updatedAt: string | Date;
};
export declare type ILegalEntityOutputTable = ILegalEntity & {
    totalCount: number;
};
export interface ICreateArgs {
    input: TLegalEntityInputTable;
}
export interface IUpdateArgs {
    id: string;
    input: Partial<TLegalEntityInputTable>;
}
export interface IDeleteArgs {
    id?: string;
    ids?: string[];
}
export interface IRestoreArgs {
    id: string;
}
