import { IListResponse, TOutputFilter } from '@via-profit-services/core';
import { Context, ILegalEntity, ILegalEntityCreateInfo, ILegalEntityUpdateInfo } from './types';
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
    context: Context;
}
export default LegalEntitiesService;
export { LegalEntitiesService };
