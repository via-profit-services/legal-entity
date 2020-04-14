import { IContext } from '@via-profit-services/core';
import { shield } from 'graphql-shield';

export const permissions = shield<any, IContext>({

});

export default permissions;
