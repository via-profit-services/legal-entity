import {
  IContext,
  IListResponse,
  TOutputFilter,
  convertOrderByToKnex,
  convertWhereToKnex,
  TWhereAction,
} from '@via-profit-services/core';
import moment from 'moment-timezone';

class LegalEntitiesService {
  public props: IProps;

  public constructor(props: IProps) {
    this.props = props;
  }

  public getLegalEntities(filter: TOutputFilter): Promise<IListResponse<ILegalEntity>> {
    const { context } = this.props;
    const { knex } = context;
    const {
      limit, offset, orderBy, where,
    } = filter;

    return knex
      .select<any, Array<ILegalEntity & { totalCount: number }>>(['joined.totalCount', 'legalEntities.*'])
      .join(
        knex('legalEntities')
          .select(['id', knex.raw('count(*) over() as "totalCount"')])
          .limit(limit)
          .offset(offset)
          .where((builder) => convertWhereToKnex(builder, where))
          .orderBy(convertOrderByToKnex(orderBy))
          .as('joined'),
        'joined.id',
        'legalEntities.id',
      )
      .orderBy(convertOrderByToKnex(orderBy))
      .from('legalEntities')
      .then((nodes) => ({
        totalCount: nodes.length ? Number(nodes[0].totalCount) : 0,
        limit,
        offset,
        nodes,
      }));
  }

  public async getLegalEntitiesByIds(ids: string[]): Promise<ILegalEntity[]> {
    const { nodes } = await this.getLegalEntities({
      where: [['id', TWhereAction.IN, ids]],
      offset: 0,
      limit: ids.length,
    });

    return nodes;
  }

  public async getDriver(id: string): Promise<ILegalEntity | false> {
    const nodes = await this.getLegalEntitiesByIds([id]);
    return nodes.length ? nodes[0] : false;
  }

  public async updateCustomer(id: string, customerData: Partial<ILegalEntityUpdateInfo>) {
    const { knex, timezone } = this.props.context;

    await knex<ILegalEntityUpdateInfo>('legalEntities')
      .update({
        ...customerData,
        updatedAt: moment.tz(timezone).format(),
      })
      .where('id', id);
  }
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

export type ILegalEntityUpdateInfo = Omit<ILegalEntity, 'id' | 'createdAt' | 'updatedAt'> & {
  updatedAt: string;
};

export default LegalEntitiesService;
export { LegalEntitiesService };
