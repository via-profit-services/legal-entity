declare module '@via-profit-services/legal-entity' {
  import { Context, ListResponse, OutputFilter, Middleware } from '@via-profit-services/core';

  export type LegalEntityMiddlewareFactory = () => Middleware;

  export interface LegalEntity {
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
    deleted: boolean;
    payments: Array<{
      id: string;
    }> | null;
    city: {
      id: string;
    } | null;
  }




  
  export interface RestoreArgs {
    id: string;
  }

  export interface ExternalSearchArgs {
    query: string;
  }

  export interface LegalEntityPayment {
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


  export type LegalEntityExternalSearchState = 'ACTIVE' | 'LIQUIDATING' | 'LIQUIDATED' | 'REORGANIZING';

  export type LegalEntityExternalSearchBranchType = 'MAIN' | 'BRAHCN';

  export type LegalEntityExternalSearchType = 'LEGAL' | 'INDIVIDUAL';
  
  export interface LegalEntityExternalSearchResult {
    label: string;
    nameFull: string;
    nameShort: string;
    address: string;
    ogrn: string;
    kpp?: string;
    inn: string;
    directorNameNominative: string;
    directorNameShortNominative: string;
    state: LegalEntityExternalSearchState;
    branchType: LegalEntityExternalSearchBranchType;
    city: {
      id: string;
    } | null;
    registrationDate: Date;
    liquidationDate: Date | null;
    type: LegalEntityExternalSearchType;
  }


export type LegalEntityTableModel = {
  readonly id: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly label: string;
  readonly nameFull: string;
  readonly nameShort: string;
  readonly address: string;
  readonly ogrn: string;
  readonly kpp: string | null;
  readonly inn: string;
  readonly directorNameNominative: string;
  readonly directorNameGenitive: string;
  readonly directorNameShortNominative: string;
  readonly directorNameShortGenitive: string;
  readonly comment: string;
  readonly deleted: boolean;
  readonly payments: string;
  readonly city: string | null;
}


export type LegalEntityTableModelResult = Omit<LegalEntityTableModel, | 'createdAt' | 'updatedAt'> & {
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly totalCount: number;
}

export type LegalEntityPaymentTableMode = {
  readonly id: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly owner: string;
  readonly rs: string;
  readonly ks: string;
  readonly bic: string;
  readonly bank: string;
  readonly comment: string | null;
  readonly deleted: boolean;
}

export type LegalEntityPaymentTableModeResult = Omit<LegalEntityPaymentTableMode, 'createdAt' | 'updatedAt'> & {
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly totalCount: number;
}


  export interface LegalEntitiesServiceProps {
    context: Context;
  }

  class LegalEntitiesService {
    props: LegalEntitiesServiceProps;
    constructor(props: LegalEntitiesServiceProps);

    getLegalEntityDefaultData(): LegalEntity;
    getLegalEntityPaymentDefaultData(): LegalEntityPayment;
    prepareLegalEntityDataToInsert(legalEntity: Partial<LegalEntity>): Partial<LegalEntityTableModel>;
    prepareLegalEntityPaymentToInsert(
    payment: Partial<LegalEntityPayment>): Partial<LegalEntityPaymentTableMode>;
    getLegalEntities(filter: Partial<OutputFilter>): Promise<ListResponse<LegalEntity>>;
    getLegalEntitiesByIds(ids: string[]): Promise<LegalEntity[]>;
    getLegalEntity(id: string): Promise<LegalEntity | false>;
    updateLegalEntity(id: string, legalEntityData: Partial<LegalEntity>): Promise<string>;
    createLegalEntity(legalEntityData: Partial<LegalEntity>): Promise<string>;
    deleteLegalEntity(id: string): Promise<boolean>;
    restoreLegalEntity(id: string): Promise<boolean>;
    externalSearchCompanies(query: string): Promise<LegalEntityExternalSearchResult[] | null>;
    externalSearchPayments(query: string): Promise<LegalEntityPayment[] | null>;
    getLegalEntityPayments(filter: Partial<OutputFilter>): Promise<ListResponse<LegalEntityPayment>>;
    getLegalEntityPaymentsByIds(ids: string[]): Promise<LegalEntityPayment[]>;
    getLegalEntityPayment(id: string): Promise<LegalEntityPayment | false>;
    updateLegalEntityPayment(id: string, paymentData: Partial<LegalEntityPayment>): Promise<string>;
    createLegalEntityPayment(paymentData: Partial<LegalEntityPayment>): Promise<string>;
    deleteLegalEntityPayment(id: string): Promise<boolean>;
    restoreLegalEntityPayment(id: string): Promise<boolean>;
  }

  export const resolvers: any;
  export const typeDefs: string;
  export const factory: LegalEntityMiddlewareFactory;
}

declare module '@via-profit-services/core' {
  import { LegalEntitiesService, LegalEntity, LegalEntityPayment } from '@via-profit-services/legal-entity';
  import { Node } from '@via-profit-services/core';
  import DataLoader from 'dataloader';

  interface ServicesCollection {
    /**
     * Legal Entities service
     */
    legalEntity: LegalEntitiesService;
  }

  interface DataLoaderCollection {
    legalEntities: DataLoader<string, Node<LegalEntity>>
    legalEntitiesPayments: DataLoader<string, Node<LegalEntityPayment>>
  }
}