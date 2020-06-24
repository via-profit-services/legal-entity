import { IListResponse, TOutputFilter } from '@via-profit-services/core';
import { Context, ILegalEntity, TLegalEntityInputTable } from './types';
declare class LegalEntitiesService {
    props: IProps;
    constructor(props: IProps);
    static getLegalEntityDefaultData(): TLegalEntityInputTable;
    prepareDataToInsert(legalEntityInputData: Partial<TLegalEntityInputTable>): Partial<TLegalEntityInputTable>;
    getLegalEntities(filter: Partial<TOutputFilter>): Promise<IListResponse<ILegalEntity>>;
    getLegalEntitiesByIds(ids: string[]): Promise<ILegalEntity[]>;
    getLegalEntity(id: string): Promise<ILegalEntity | false>;
    updateLegalEntity(id: string, legalEntityData: Partial<TLegalEntityInputTable>): Promise<string>;
    createLegalEntity(legalEntityData: Partial<TLegalEntityInputTable>): Promise<string>;
    deleteLegalEntity(id: string): Promise<boolean>;
    restoreLegalEntity(id: string): Promise<boolean>;
}
interface IProps {
    context: Context;
}
export default LegalEntitiesService;
export { LegalEntitiesService };
