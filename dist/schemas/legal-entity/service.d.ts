import { IContext, IListResponse, TOutputFilter } from '@via-profit-services/core';
declare class LegalEntitiesService {
    props: IProps;
    constructor(props: IProps);
    getLegalEntities(filter: TOutputFilter): Promise<IListResponse<ILegalEntity>>;
    getLegalEntitiesByIds(ids: string[]): Promise<ILegalEntity[]>;
    getDriver(id: string): Promise<ILegalEntity | false>;
    updateCustomer(id: string, customerData: Partial<ILegalEntityUpdateInfo>): Promise<void>;
}
interface IProps {
    context: IContext;
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
}
export declare type ILegalEntityUpdateInfo = Omit<ILegalEntity, 'id' | 'createdAt' | 'updatedAt'> & {
    updatedAt: string;
};
export default LegalEntitiesService;
export { LegalEntitiesService };
