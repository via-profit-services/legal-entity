declare module '@via-profit-services/legal-entity' {
  import { Context, OutputFilter, ListResponse, Middleware, InputFilter } from '@via-profit-services/core';
  import { GraphQLFieldResolver } from 'graphql';

  export type MiddlewareFactory = () => Promise<{
    middleware: Middleware;
    typeDefs: string;
    resolvers: Resolvers;
  }>;

  export type Resolvers = {
    Query: {
      legalEntities: GraphQLFieldResolver<unknown, Context>;
    };
    Mutation: {
      legalEntities: GraphQLFieldResolver<unknown, Context>;
    };
    LegalEntity: Record<keyof LegalEntity, GraphQLFieldResolver<{
      id: string;
    }, Context>>;
    LegalEntityPayments: Record<keyof LegalEntityPayment, GraphQLFieldResolver<{
      id: string;
    }, Context>>;
    LegalEntitiesQuery: {
      list: GraphQLFieldResolver<unknown, Context, InputFilter>;
      legalEntity: GraphQLFieldResolver<unknown, Context, {
        id: string;
      }>;
      externalSearch: GraphQLFieldResolver<unknown, Context>;
    };
    LegalEntityExternalSearch: {
      companies: GraphQLFieldResolver<unknown, Context, {
        query: string;
      }>;
      payments: GraphQLFieldResolver<unknown, Context, {
        query: string;
      }>;
    };
    LegalEntitiesMutation: {
      create: GraphQLFieldResolver<unknown, Context, {
        input: {
          ogrn: string;
          inn: string;
          id?: string;
          label: string;
          nameFull: string;
          nameShort: string;
          address: string;
          kpp: string;
          directorNameNominative: string;
          directorNameGenitive: string;
          directorNameShortNominative: string;
          directorNameShortGenitive: string;
          comment: string;
          city: string;
          payments: Array<{
            id?: string;
            rs?: string;
            ks?: string;
            bic?: string;
            bank?: string;
            priority?: PaymentPriority;
            comment?: string;
          }>;
        };
      }>;
      update: GraphQLFieldResolver<unknown, Context, {
        id: string;
        input: {
          ogrn?: string;
          inn?: string;
          id?: string;
          label?: string;
          nameFull?: string;
          nameShort?: string;
          address?: string;
          kpp?: string;
          directorNameNominative?: string;
          directorNameGenitive?: string;
          directorNameShortNominative?: string;
          directorNameShortGenitive?: string;
          comment?: string;
          city?: string;
          payments?: Array<{
            id?: string;
            rs?: string;
            ks?: string;
            bic?: string;
            bank?: string;
            priority?: PaymentPriority;
            comment?: string;
          }>;
        };
      }>;
      delete: GraphQLFieldResolver<unknown, Context, {
        id?: string;
        ids?: string[];
      }>;
    };
  };

  export type PaymentPriority = 'master' | 'slave';

  export type LegalEntitiesTableModel = {
    id: string;
    createdAt: string;
    updatedAt: string;
    label: string;
    address: string;
    ogrn: string;
    kpp: string;
    inn: string;
    directorNameNominative: string;
    directorNameGenitive: string;
    directorNameShortNominative: string;
    directorNameShortGenitive: string;
    nameShort: string;
    nameFull: string;
    city: string;
    comment: string | null;
    deleted: boolean;
  }

  export type LegalEntitiesTableModelResponse = {
    readonly id: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly label: string;
    readonly address: string;
    readonly ogrn: string;
    readonly kpp: string;
    readonly inn: string;
    readonly directorNameNominative: string;
    readonly directorNameGenitive: string;
    readonly directorNameShortNominative: string;
    readonly directorNameShortGenitive: string;
    readonly nameShort: string;
    readonly nameFull: string;
    readonly city: string;
    readonly comment: string | null;
    readonly deleted: boolean;
    readonly totalCount: number;
    readonly payments: string;
  }

  export type LegalEntity = {
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
    comment: string | null;
    deleted: boolean;
    payments: Array<{
      id: string;
    }> | null;
    city: {
      id: string;
    } | null;
  }

  export type PaymentsTableModel = {
    id: string;
    createdAt: string;
    updatedAt: string;
    owner: string;
    rs: string;
    ks: string;
    bic: string;
    bank: string;
    priority: PaymentPriority;
    comment: string | null;
    deleted: boolean;
  }

  export type PaymentsTableModelResponse = {
    readonly id: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly owner: string;
    readonly rs: string;
    readonly ks: string;
    readonly bic: string;
    readonly bank: string;
    readonly priority: PaymentPriority;
    readonly comment: string | null;
    readonly deleted: boolean;
    readonly totalCount: number;
  }

  export type LegalEntityPayment = {
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
    priority: PaymentPriority;
    deleted: boolean;
  }
  

  export type CreateEntityProps = Omit<LegalEntitiesTableModel, 'createdAt' | 'updatedAt'>;
  export type UpdateEntityProps = Partial<CreateEntityProps>;
  export type CreatePaymentProps = Omit<PaymentsTableModel, 'createdAt' | 'updatedAt'>;
  export type UpdatePaymentProps = Partial<CreatePaymentProps>;

  export type LegalEntityServiceProps = {
    context: Context;
  }

  class LegalEntityService {
    props: LegalEntityServiceProps;
    constructor(props: LegalEntityServiceProps);
    getLegalEntities(filter: Partial<OutputFilter>): Promise<ListResponse<LegalEntity>>;
    getLegalEntitiesByIds(ids: string[]): Promise<LegalEntity[]>;
    getLegalEntity(id: string): Promise<LegalEntity | false>;
    updateLegalEntity(id: string, legalEntityData: UpdateEntityProps): Promise<void>;
    createLegalEntity(legalEntityData: CreateEntityProps): Promise<string>;
    deleteLegalEntities(ids: string[]): Promise<void>;
    deleteLegalEntity(id: string): Promise<void>;
    restoreLegalEntity(id: string): Promise<void>;
    externalSearchCompanies(query: string): Promise<LegalEntityExternalSearchResult[] | null>;
    externalSearchPayments(query: string): Promise<LegalEntityPayment[] | null>;
    getLegalEntityPayments(filter: Partial<OutputFilter>): Promise<ListResponse<LegalEntityPayment>>;
    getLegalEntityPaymentsByIds(ids: string[]): Promise<LegalEntityPayment[]>;
    getLegalEntityPayment(id: string): Promise<LegalEntityPayment | false>;
    createLegalEntityPayment(paymentData: CreatePaymentProps): Promise<string>;
    updateLegalEntityPayment(id: string, paymentData: UpdatePaymentProps): Promise<string>;
    deleteLegalEntityPayment(id: string): Promise<boolean>;
    restoreLegalEntityPayment(id: string): Promise<boolean>;

  }



  export type LegalEntityExternalSearchState =
    | 'ACTIVE'
    | 'LIQUIDATING'
    | 'LIQUIDATED'
    | 'REORGANIZING';

  export type LegalEntityExternalSearchBranchType =
    | 'MAIN'
    | 'BRAHCN';

  export type LegalEntityExternalSearchType =
    | 'LEGAL'
    | 'INDIVIDUAL';

  export type LegalEntityExternalSearchResult = {
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

  export const factory: MiddlewareFactory;
}


declare module '@via-profit-services/core' {
  import DataLoader from 'dataloader';
  import { LegalEntity, LegalEntityService, LegalEntityPayment } from '@via-profit-services/legal-entity';

  interface DataLoaderCollection {
    legalEntities: DataLoader<string, Node<LegalEntity>>;
    payments: DataLoader<string, Node<LegalEntityPayment>>;
  }

  interface ServicesCollection {
    legalEntities: LegalEntityService;
  }
}