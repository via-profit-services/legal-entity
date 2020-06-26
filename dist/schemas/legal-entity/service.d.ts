import { IListResponse, TOutputFilter } from '@via-profit-services/core';
import { Context, ILegalEntity, TLegalEntityInputTable, ILegalEntityPayment, ILegalEntityPaymentInputTable } from './types';
declare class LegalEntitiesService {
    props: IProps;
    constructor(props: IProps);
    static getLegalEntityDefaultData(): TLegalEntityInputTable;
    static getLegalEntityPaymentDefaultData(): ILegalEntityPaymentInputTable;
    prepareLegalEntityDataToInsert(legalEntityInputData: Partial<TLegalEntityInputTable>): Partial<TLegalEntityInputTable>;
    prepareLegalEntityPaymentToInsert(paymentInout: Partial<ILegalEntityPaymentInputTable>): Partial<ILegalEntityPaymentInputTable>;
    getLegalEntities(filter: Partial<TOutputFilter>): Promise<IListResponse<ILegalEntity>>;
    getLegalEntitiesByIds(ids: string[]): Promise<ILegalEntity[]>;
    getLegalEntity(id: string): Promise<ILegalEntity | false>;
    updateLegalEntity(id: string, legalEntityData: Partial<TLegalEntityInputTable>): Promise<string>;
    createLegalEntity(legalEntityData: Partial<TLegalEntityInputTable>): Promise<string>;
    deleteLegalEntity(id: string): Promise<boolean>;
    restoreLegalEntity(id: string): Promise<boolean>;
    externalSearchCompanies(query: string): Promise<ILegalEntity[] | null>;
    externalSearchPayments(query: string): Promise<ILegalEntityPayment[] | null>;
    getLegalEntityPayments(filter: Partial<TOutputFilter>): Promise<IListResponse<ILegalEntityPayment>>;
    getLegalEntityPaymentsByIds(ids: string[]): Promise<ILegalEntityPayment[]>;
    getLegalEntityPayment(id: string): Promise<ILegalEntityPayment | false>;
    updateLegalEntityPayment(id: string, paymentData: Partial<ILegalEntityPaymentInputTable>): Promise<string>;
    createLegalEntityPayment(paymentData: Partial<ILegalEntityPaymentInputTable>): Promise<string>;
    deleteLegalEntityPayment(id: string): Promise<boolean>;
    restoreLegalEntityPayment(id: string): Promise<boolean>;
}
interface IProps {
    context: Context;
}
export default LegalEntitiesService;
export { LegalEntitiesService };
