import { IContext, IListResponse, TOutputFilter } from '@via-profit-services/core';
declare class LegalEntitiesService {
    props: IProps;
    constructor(props: IProps);
    getLegalEntities(filter: Partial<TOutputFilter>, withDeleted?: boolean): Promise<IListResponse<ILegalEntity>>;
    getLegalEntitiesByIds(ids: string[]): Promise<ILegalEntity[]>;
    getLegalEntity(id: string): Promise<ILegalEntity | false>;
    updateLegalEntity(id: string, legalEntityData: Partial<ILegalEntityUpdateInfo>): Promise<string>;
    createLegalEntity(legalEntityData: ILegalEntityCreateInfo): Promise<string>;
    deleteLegalEntity(id: string): Promise<boolean>;
}
interface IProps {
    context: Pick<IContext, 'knex' | 'timezone'>;
}
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
export default LegalEntitiesService;
export { LegalEntitiesService };
