import { IContext } from '@via-profit-services/core';
export declare type Context = Pick<IContext, 'knex' | 'timezone'>;
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
    deleted: Boolean;
}
export declare type ILegalEntityUpdateInfo = Omit<Partial<ILegalEntityCreateInfo>, 'id' | 'createdAt' | 'updatedAt'> & {
    id?: string;
    updatedAt: string;
};
export declare type ILegalEntityCreateInfo = Omit<ILegalEntity, 'id' | 'createdAt' | 'updatedAt'> & {
    id?: string;
    updatedAt: string;
    createdAt: string;
};
export declare type ILegalEntityTable = ILegalEntity & {
    totalCount: number;
};
