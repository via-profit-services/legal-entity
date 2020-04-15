/*!
 * 
 *  Via Profit services / legal-entity
 * 
 *  Repository https://gitlab.com/via-profit-services/legal-entity
 *  Contact https://via-profit.ru
 *       
 */
module.exports=function(e){var n={};function i(t){if(n[t])return n[t].exports;var a=n[t]={i:t,l:!1,exports:{}};return e[t].call(a.exports,a,a.exports,i),a.l=!0,a.exports}return i.m=e,i.c=n,i.d=function(e,n,t){i.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:t})},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,n){if(1&n&&(e=i(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(i.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var a in e)i.d(t,a,function(n){return e[n]}.bind(null,a));return t},i.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(n,"a",n),n},i.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},i.p="",i(i.s=3)}([function(e,n){e.exports=require("@via-profit-services/core")},function(e,n,i){"use strict";var t=this&&this.__awaiter||function(e,n,i,t){return new(i||(i=Promise))((function(a,d){function l(e){try{u(t.next(e))}catch(e){d(e)}}function r(e){try{u(t.throw(e))}catch(e){d(e)}}function u(e){var n;e.done?a(e.value):(n=e.value,n instanceof i?n:new i((function(e){e(n)}))).then(l,r)}u((t=t.apply(e,n||[])).next())}))},a=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(n,"__esModule",{value:!0});const d=i(0),l=a(i(10)),r=i(11);class u{constructor(e){this.props=e}getLegalEntities(e,n){const{context:i}=this.props,{knex:t}=i,{limit:a,offset:l,orderBy:r,where:u,search:o}=e;return u.push(["deleted",d.TWhereAction.EQ,n?"true":"false"]),o&&u.push([o.field,d.TWhereAction.ILIKE,`%${o.query}%`]),t.select(["joined.totalCount","legalEntities.*"]).join(t("legalEntities").select(["id",t.raw('count(*) over() as "totalCount"')]).limit(a||1).offset(l||0).where(e=>d.convertWhereToKnex(e,u)).orderBy(d.convertOrderByToKnex(r)).as("joined"),"joined.id","legalEntities.id").orderBy(d.convertOrderByToKnex(r)).from("legalEntities").then(e=>({totalCount:e.length?Number(e[0].totalCount):0,limit:a,offset:l,nodes:e}))}getLegalEntitiesByIds(e){return t(this,void 0,void 0,(function*(){const{nodes:n}=yield this.getLegalEntities({where:[["id",d.TWhereAction.IN,e]],offset:0,limit:e.length});return n}))}getLegalEntity(e){return t(this,void 0,void 0,(function*(){const n=yield this.getLegalEntitiesByIds([e]);return!!n.length&&n[0]}))}updateLegalEntity(e,n){return t(this,void 0,void 0,(function*(){const{knex:i,timezone:t}=this.props.context,a=Object.assign(Object.assign({},n),{id:e,updatedAt:l.default.tz(t).format()});return(yield i("legalEntities").update(a).where("id",e).returning("id"))[0]}))}createLegalEntity(e){return t(this,void 0,void 0,(function*(){const{knex:n,timezone:i}=this.props.context,t=Object.assign(Object.assign({},e),{id:e.id||r.v4(),createdAt:l.default.tz(i).format(),updatedAt:l.default.tz(i).format()});return(yield n("legalEntities").insert(t).returning("id"))[0]}))}deleteLegalEntity(e){return t(this,void 0,void 0,(function*(){const n=this.updateLegalEntity(e,{inn:"",deleted:!0});return Boolean(n)}))}}n.LegalEntitiesService=u,n.default=u},function(e,n,i){"use strict";var t=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(n,"__esModule",{value:!0});const a=i(0),d=t(i(1)),l={legalEntities:null};n.default=function(e){if(null!==l.legalEntities)return l;const n=new d.default({context:e});return l.legalEntities=new a.DataLoader(e=>n.getLegalEntitiesByIds(e).then(n=>a.collateForDataloader(e,n))),l}},function(e,n,i){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),function(e){for(var i in e)n.hasOwnProperty(i)||(n[i]=e[i])}(i(4))},function(e,n,i){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),function(e){for(var i in e)n.hasOwnProperty(i)||(n[i]=e[i])}(i(5))},function(e,n,i){"use strict";var t=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}},a=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var n={};if(null!=e)for(var i in e)Object.hasOwnProperty.call(e,i)&&(n[i]=e[i]);return n.default=e,n};Object.defineProperty(n,"__esModule",{value:!0});const d=t(i(6));n.permissions=d.default;const l=t(i(8));n.resolvers=l.default;const r=a(i(14));n.typeDefs=r;const u=t(i(1));n.service=u.default},function(e,n,i){"use strict";Object.defineProperty(n,"__esModule",{value:!0});const t=i(7);n.permissions=t.shield({}),n.default=n.permissions},function(e,n){e.exports=require("graphql-shield")},function(e,n,i){"use strict";var t=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(n,"__esModule",{value:!0});const a=t(i(9)),d=t(i(12)),l={Query:{legalEntities:()=>({})},Mutation:{legalEntities:()=>({})},LegalEntity:t(i(13)).default,LegalEntitiesQuery:d.default,LegalEntitiesMutation:a.default};n.default=l},function(e,n,i){"use strict";var t=this&&this.__awaiter||function(e,n,i,t){return new(i||(i=Promise))((function(a,d){function l(e){try{u(t.next(e))}catch(e){d(e)}}function r(e){try{u(t.throw(e))}catch(e){d(e)}}function u(e){var n;e.done?a(e.value):(n=e.value,n instanceof i?n:new i((function(e){e(n)}))).then(l,r)}u((t=t.apply(e,n||[])).next())}))},a=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(n,"__esModule",{value:!0});const d=i(0),l=a(i(2)),r=a(i(1));n.legalEntityMutationResolver={update:(e,n,i)=>t(void 0,void 0,void 0,(function*(){const{id:e,data:t}=n,a=l.default(i),u=new r.default({context:i});if(t.inn){const{nodes:n}=yield u.getLegalEntities({limit:1,where:[["inn",d.TWhereAction.EQ,t.inn],["id",d.TWhereAction.NEQ,e]]});if(n.length&&(a.legalEntities.prime(n[0].id,n[0]),n[0].id!==e))throw new d.ServerError(`Legal entity record already exists with inn ${t.inn} value`,{id:e,data:t})}if(t.ogrn){const{nodes:n}=yield u.getLegalEntities({limit:1,where:[["ogrn",d.TWhereAction.EQ,t.ogrn],["id",d.TWhereAction.NEQ,e]]});if(n.length&&(a.legalEntities.prime(n[0].id,n[0]),n[0].id!==e))throw new d.ServerError(`Legal entity record already exists with ogrn ${t.ogrn} value`,{id:e,data:t})}try{yield u.updateLegalEntity(e,t)}catch(n){throw new d.ServerError("Failed to update legal entity",{err:n,id:e,data:t})}return a.legalEntities.clear(e),{id:e}})),create:(e,n,i)=>t(void 0,void 0,void 0,(function*(){const{data:e}=n,t=new r.default({context:i});if(e.inn){const{totalCount:n}=yield t.getLegalEntities({limit:1,where:[["inn",d.TWhereAction.EQ,e.inn]]});if(n)throw new d.ServerError(`Legal entity record already exists with inn ${e.inn} value`,{data:e})}if(e.ogrn){const{totalCount:n}=yield t.getLegalEntities({limit:1,where:[["ogrn",d.TWhereAction.EQ,e.ogrn]]});if(n)throw new d.ServerError(`Legal entity record already exists with ogrn ${e.ogrn} value`,{data:e})}try{return{id:yield t.createLegalEntity(e)}}catch(n){throw new d.ServerError("Failed to create legal entity",{err:n,data:e})}})),delete:(e,n,i)=>t(void 0,void 0,void 0,(function*(){const{id:e}=n,t=new r.default({context:i});try{return t.deleteLegalEntity(e)}catch(n){throw new d.ServerError("Failed to delete legal entity",{err:n,id:e})}}))},n.default=n.legalEntityMutationResolver},function(e,n){e.exports=require("moment-timezone")},function(e,n){e.exports=require("uuid")},function(e,n,i){"use strict";var t=this&&this.__awaiter||function(e,n,i,t){return new(i||(i=Promise))((function(a,d){function l(e){try{u(t.next(e))}catch(e){d(e)}}function r(e){try{u(t.throw(e))}catch(e){d(e)}}function u(e){var n;e.done?a(e.value):(n=e.value,n instanceof i?n:new i((function(e){e(n)}))).then(l,r)}u((t=t.apply(e,n||[])).next())}))},a=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(n,"__esModule",{value:!0});const d=i(0),l=a(i(2)),r=a(i(1));n.queryResolver={list:(e,n,i)=>t(void 0,void 0,void 0,(function*(){const e=d.buildQueryFilter(n),t=new r.default({context:i}),a=l.default(i);try{const n=yield t.getLegalEntities(e),i=d.buildCursorConnection(n);return n.nodes.forEach(e=>{a.legalEntities.clear(e.id).prime(e.id,e)}),i}catch(e){throw new d.ServerError("Failed to get LegalEntities list",{err:e})}}))},n.default=n.queryResolver},function(e,n,i){"use strict";var t=this&&this.__awaiter||function(e,n,i,t){return new(i||(i=Promise))((function(a,d){function l(e){try{u(t.next(e))}catch(e){d(e)}}function r(e){try{u(t.throw(e))}catch(e){d(e)}}function u(e){var n;e.done?a(e.value):(n=e.value,n instanceof i?n:new i((function(e){e(n)}))).then(l,r)}u((t=t.apply(e,n||[])).next())}))},a=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(n,"__esModule",{value:!0});const d=a(i(2));n.legalEntityResolver={createdAt:({id:e},n,i)=>t(void 0,void 0,void 0,(function*(){const n=d.default(i);return(yield n.legalEntities.load(e)).createdAt})),updatedAt:({id:e},n,i)=>t(void 0,void 0,void 0,(function*(){const n=d.default(i);return(yield n.legalEntities.load(e)).updatedAt})),name:({id:e},n,i)=>t(void 0,void 0,void 0,(function*(){const n=d.default(i);return(yield n.legalEntities.load(e)).name})),address:({id:e},n,i)=>t(void 0,void 0,void 0,(function*(){const n=d.default(i);return(yield n.legalEntities.load(e)).address})),ogrn:({id:e},n,i)=>t(void 0,void 0,void 0,(function*(){const n=d.default(i);return(yield n.legalEntities.load(e)).ogrn})),kpp:({id:e},n,i)=>t(void 0,void 0,void 0,(function*(){const n=d.default(i);return(yield n.legalEntities.load(e)).kpp})),inn:({id:e},n,i)=>t(void 0,void 0,void 0,(function*(){const n=d.default(i);return(yield n.legalEntities.load(e)).inn})),rs:({id:e},n,i)=>t(void 0,void 0,void 0,(function*(){const n=d.default(i);return(yield n.legalEntities.load(e)).rs})),ks:({id:e},n,i)=>t(void 0,void 0,void 0,(function*(){const n=d.default(i);return(yield n.legalEntities.load(e)).ks})),bic:({id:e},n,i)=>t(void 0,void 0,void 0,(function*(){const n=d.default(i);return(yield n.legalEntities.load(e)).bic})),bank:({id:e},n,i)=>t(void 0,void 0,void 0,(function*(){const n=d.default(i);return(yield n.legalEntities.load(e)).bank})),directorNameNominative:({id:e},n,i)=>t(void 0,void 0,void 0,(function*(){const n=d.default(i);return(yield n.legalEntities.load(e)).directorNameNominative})),directorNameGenitive:({id:e},n,i)=>t(void 0,void 0,void 0,(function*(){const n=d.default(i);return(yield n.legalEntities.load(e)).directorNameGenitive}))},n.default=n.legalEntityResolver},function(e,n){var i={kind:"Document",definitions:[{kind:"ObjectTypeExtension",name:{kind:"Name",value:"Query"},interfaces:[],directives:[],fields:[{kind:"FieldDefinition",name:{kind:"Name",value:"legalEntities"},arguments:[],type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"LegalEntitiesQuery"}}},directives:[]}]},{kind:"ObjectTypeExtension",name:{kind:"Name",value:"Mutation"},interfaces:[],directives:[],fields:[{kind:"FieldDefinition",name:{kind:"Name",value:"legalEntities"},arguments:[],type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"LegalEntitiesMutation"}}},directives:[]}]},{kind:"ScalarTypeDefinition",description:{kind:"StringValue",value:"Legal Entity INN (Taxpayer Identification Number) ",block:!0},name:{kind:"Name",value:"LegalEntityINN"},directives:[]},{kind:"ScalarTypeDefinition",description:{kind:"StringValue",value:"Legal Entity OGRN (Main state registration number)",block:!0},name:{kind:"Name",value:"LegalEntityOGRN"},directives:[]},{kind:"ScalarTypeDefinition",description:{kind:"StringValue",value:"Legal Entity KPP (Code of the reason for registration)",block:!0},name:{kind:"Name",value:"LegalEntityKPP"},directives:[]},{kind:"ScalarTypeDefinition",description:{kind:"StringValue",value:"Legal Entity BIC (Bank Identification Code)",block:!0},name:{kind:"Name",value:"LegalEntityBIC"},directives:[]},{kind:"ScalarTypeDefinition",description:{kind:"StringValue",value:"Legal Entity BIC (Payment account number)",block:!0},name:{kind:"Name",value:"LegalEntityRS"},directives:[]},{kind:"ScalarTypeDefinition",description:{kind:"StringValue",value:"Legal Entity KS (Correspondent account number)",block:!0},name:{kind:"Name",value:"LegalEntityKS"},directives:[]},{kind:"EnumTypeDefinition",description:{kind:"StringValue",value:"Possible data to sort of legal entities list",block:!0},name:{kind:"Name",value:"LegalEntityOrderField"},directives:[],values:[{kind:"EnumValueDefinition",name:{kind:"Name",value:"createdAt"},directives:[]},{kind:"EnumValueDefinition",name:{kind:"Name",value:"updatedAt"},directives:[]}]},{kind:"ObjectTypeDefinition",description:{kind:"StringValue",value:"legal entities module queries",block:!0},name:{kind:"Name",value:"LegalEntitiesQuery"},interfaces:[],directives:[],fields:[{kind:"FieldDefinition",description:{kind:"StringValue",value:"Returns legal entities list bundle",block:!0},name:{kind:"Name",value:"list"},arguments:[{kind:"InputValueDefinition",name:{kind:"Name",value:"first"},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}},directives:[]},{kind:"InputValueDefinition",name:{kind:"Name",value:"offset"},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}},directives:[]},{kind:"InputValueDefinition",name:{kind:"Name",value:"after"},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},directives:[]},{kind:"InputValueDefinition",name:{kind:"Name",value:"orderBy"},type:{kind:"ListType",type:{kind:"NamedType",name:{kind:"Name",value:"LegalEntityOrderBy"}}},directives:[]},{kind:"InputValueDefinition",name:{kind:"Name",value:"filter"},type:{kind:"NamedType",name:{kind:"Name",value:"LegalEntityListFilter"}},directives:[]},{kind:"InputValueDefinition",name:{kind:"Name",value:"search"},type:{kind:"NamedType",name:{kind:"Name",value:"LegalEntityFilterSearch"}},directives:[]}],type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"LegalEntityListConnection"}}},directives:[]}]},{kind:"ObjectTypeDefinition",name:{kind:"Name",value:"LegalEntitiesMutation"},interfaces:[],directives:[],fields:[{kind:"FieldDefinition",description:{kind:"StringValue",value:"Create legal entity",block:!0},name:{kind:"Name",value:"create"},arguments:[{kind:"InputValueDefinition",name:{kind:"Name",value:"data"},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"InputLegalEntityCreate"}}},directives:[]}],type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"LegalEntity"}}},directives:[]},{kind:"FieldDefinition",description:{kind:"StringValue",value:"Update legal entity",block:!0},name:{kind:"Name",value:"update"},arguments:[{kind:"InputValueDefinition",name:{kind:"Name",value:"id"},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"ID"}}},directives:[]},{kind:"InputValueDefinition",name:{kind:"Name",value:"data"},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"InputLegalEntityUpdate"}}},directives:[]}],type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"LegalEntity"}}},directives:[]},{kind:"FieldDefinition",description:{kind:"StringValue",value:"Delete legal entity",block:!0},name:{kind:"Name",value:"delete"},arguments:[{kind:"InputValueDefinition",name:{kind:"Name",value:"id"},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"ID"}}},directives:[]}],type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},directives:[]}]},{kind:"InputObjectTypeDefinition",description:{kind:"StringValue",value:"Possible data to order list of legal entities",block:!0},name:{kind:"Name",value:"LegalEntityOrderBy"},directives:[],fields:[{kind:"InputValueDefinition",name:{kind:"Name",value:"field"},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"LegalEntityOrderField"}}},directives:[]},{kind:"InputValueDefinition",name:{kind:"Name",value:"direction"},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"OrderDirection"}}},directives:[]}]},{kind:"InputObjectTypeDefinition",description:{kind:"StringValue",value:"Possible data to filter list of legal entities",block:!0},name:{kind:"Name",value:"LegalEntityListFilter"},directives:[],fields:[{kind:"InputValueDefinition",name:{kind:"Name",value:"inn"},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},directives:[]}]},{kind:"EnumTypeDefinition",name:{kind:"Name",value:"LegalEntityFilterSearchField"},directives:[],values:[{kind:"EnumValueDefinition",name:{kind:"Name",value:"name"},directives:[]},{kind:"EnumValueDefinition",name:{kind:"Name",value:"address"},directives:[]},{kind:"EnumValueDefinition",name:{kind:"Name",value:"ogrn"},directives:[]},{kind:"EnumValueDefinition",name:{kind:"Name",value:"kpp"},directives:[]},{kind:"EnumValueDefinition",name:{kind:"Name",value:"inn"},directives:[]},{kind:"EnumValueDefinition",name:{kind:"Name",value:"rs"},directives:[]},{kind:"EnumValueDefinition",name:{kind:"Name",value:"ks"},directives:[]},{kind:"EnumValueDefinition",name:{kind:"Name",value:"bic"},directives:[]},{kind:"EnumValueDefinition",name:{kind:"Name",value:"bank"},directives:[]},{kind:"EnumValueDefinition",name:{kind:"Name",value:"directorNameNominative"},directives:[]},{kind:"EnumValueDefinition",name:{kind:"Name",value:"directorNameGenitive"},directives:[]}]},{kind:"InputObjectTypeDefinition",name:{kind:"Name",value:"LegalEntityFilterSearch"},directives:[],fields:[{kind:"InputValueDefinition",name:{kind:"Name",value:"field"},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"LegalEntityFilterSearchField"}}},directives:[]},{kind:"InputValueDefinition",name:{kind:"Name",value:"query"},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},directives:[]}]},{kind:"ObjectTypeDefinition",description:{kind:"StringValue",value:"Legal entity adge bundle",block:!0},name:{kind:"Name",value:"LegalEntityEdge"},interfaces:[{kind:"NamedType",name:{kind:"Name",value:"Edge"}}],directives:[],fields:[{kind:"FieldDefinition",name:{kind:"Name",value:"node"},arguments:[],type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"LegalEntity"}}},directives:[]},{kind:"FieldDefinition",name:{kind:"Name",value:"cursor"},arguments:[],type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},directives:[]}]},{kind:"ObjectTypeDefinition",description:{kind:"StringValue",value:"Legal entities list bundle",block:!0},name:{kind:"Name",value:"LegalEntityListConnection"},interfaces:[{kind:"NamedType",name:{kind:"Name",value:"Connection"}}],directives:[],fields:[{kind:"FieldDefinition",name:{kind:"Name",value:"totalCount"},arguments:[],type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},directives:[]},{kind:"FieldDefinition",name:{kind:"Name",value:"pageInfo"},arguments:[],type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"PageInfo"}}},directives:[]},{kind:"FieldDefinition",name:{kind:"Name",value:"edges"},arguments:[],type:{kind:"NonNullType",type:{kind:"ListType",type:{kind:"NamedType",name:{kind:"Name",value:"LegalEntityEdge"}}}},directives:[]}]},{kind:"ObjectTypeDefinition",description:{kind:"StringValue",value:"Legal entity data",block:!0},name:{kind:"Name",value:"LegalEntity"},interfaces:[{kind:"NamedType",name:{kind:"Name",value:"Node"}}],directives:[],fields:[{kind:"FieldDefinition",name:{kind:"Name",value:"id"},arguments:[],type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"ID"}}},directives:[]},{kind:"FieldDefinition",name:{kind:"Name",value:"createdAt"},arguments:[],type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"DateTime"}}},directives:[]},{kind:"FieldDefinition",name:{kind:"Name",value:"updatedAt"},arguments:[],type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"DateTime"}}},directives:[]},{kind:"FieldDefinition",name:{kind:"Name",value:"name"},arguments:[],type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},directives:[]},{kind:"FieldDefinition",name:{kind:"Name",value:"address"},arguments:[],type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},directives:[]},{kind:"FieldDefinition",name:{kind:"Name",value:"ogrn"},arguments:[],type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},directives:[]},{kind:"FieldDefinition",name:{kind:"Name",value:"kpp"},arguments:[],type:{kind:"NamedType",name:{kind:"Name",value:"String"}},directives:[]},{kind:"FieldDefinition",name:{kind:"Name",value:"inn"},arguments:[],type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},directives:[]},{kind:"FieldDefinition",name:{kind:"Name",value:"rs"},arguments:[],type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},directives:[]},{kind:"FieldDefinition",name:{kind:"Name",value:"ks"},arguments:[],type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},directives:[]},{kind:"FieldDefinition",name:{kind:"Name",value:"bic"},arguments:[],type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},directives:[]},{kind:"FieldDefinition",name:{kind:"Name",value:"bank"},arguments:[],type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},directives:[]},{kind:"FieldDefinition",name:{kind:"Name",value:"directorNameNominative"},arguments:[],type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},directives:[]},{kind:"FieldDefinition",name:{kind:"Name",value:"directorNameGenitive"},arguments:[],type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},directives:[]}]},{kind:"InputObjectTypeDefinition",description:{kind:"StringValue",value:"Possible data to legal entity update",block:!0},name:{kind:"Name",value:"InputLegalEntityUpdate"},directives:[],fields:[{kind:"InputValueDefinition",name:{kind:"Name",value:"id"},type:{kind:"NamedType",name:{kind:"Name",value:"ID"}},directives:[]},{kind:"InputValueDefinition",name:{kind:"Name",value:"name"},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},directives:[]},{kind:"InputValueDefinition",name:{kind:"Name",value:"address"},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},directives:[]},{kind:"InputValueDefinition",name:{kind:"Name",value:"ogrn"},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},directives:[]},{kind:"InputValueDefinition",name:{kind:"Name",value:"kpp"},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},directives:[]},{kind:"InputValueDefinition",name:{kind:"Name",value:"inn"},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},directives:[]},{kind:"InputValueDefinition",name:{kind:"Name",value:"rs"},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},directives:[]},{kind:"InputValueDefinition",name:{kind:"Name",value:"ks"},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},directives:[]},{kind:"InputValueDefinition",name:{kind:"Name",value:"bic"},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},directives:[]},{kind:"InputValueDefinition",name:{kind:"Name",value:"bank"},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},directives:[]},{kind:"InputValueDefinition",name:{kind:"Name",value:"directorNameNominative"},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},directives:[]},{kind:"InputValueDefinition",name:{kind:"Name",value:"directorNameGenitive"},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},directives:[]}]},{kind:"InputObjectTypeDefinition",name:{kind:"Name",value:"InputLegalEntityCreate"},directives:[],fields:[{kind:"InputValueDefinition",name:{kind:"Name",value:"name"},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},directives:[]},{kind:"InputValueDefinition",name:{kind:"Name",value:"address"},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},directives:[]},{kind:"InputValueDefinition",name:{kind:"Name",value:"ogrn"},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},directives:[]},{kind:"InputValueDefinition",name:{kind:"Name",value:"kpp"},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},directives:[]},{kind:"InputValueDefinition",name:{kind:"Name",value:"inn"},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},directives:[]},{kind:"InputValueDefinition",name:{kind:"Name",value:"rs"},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},directives:[]},{kind:"InputValueDefinition",name:{kind:"Name",value:"ks"},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},directives:[]},{kind:"InputValueDefinition",name:{kind:"Name",value:"bic"},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},directives:[]},{kind:"InputValueDefinition",name:{kind:"Name",value:"bank"},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},directives:[]},{kind:"InputValueDefinition",name:{kind:"Name",value:"directorNameNominative"},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},directives:[]},{kind:"InputValueDefinition",name:{kind:"Name",value:"directorNameGenitive"},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},directives:[]}]}],loc:{start:0,end:2943}};i.loc.source={body:'extend type Query {\n  legalEntities: LegalEntitiesQuery!\n}\n\nextend type Mutation {\n  legalEntities: LegalEntitiesMutation!\n}\n\n\n"""\nLegal Entity INN (Taxpayer Identification Number) \n"""\nscalar LegalEntityINN\n\n"""\nLegal Entity OGRN (Main state registration number)\n"""\nscalar LegalEntityOGRN\n\n"""\nLegal Entity KPP (Code of the reason for registration)\n"""\nscalar LegalEntityKPP\n\n"""\nLegal Entity BIC (Bank Identification Code)\n"""\nscalar LegalEntityBIC\n\n"""\nLegal Entity BIC (Payment account number)\n"""\nscalar LegalEntityRS\n\n"""\nLegal Entity KS (Correspondent account number)\n"""\nscalar LegalEntityKS\n\n\n"""\nPossible data to sort of legal entities list\n"""\nenum LegalEntityOrderField {\n  createdAt\n  updatedAt\n}\n\n\n"""\nlegal entities module queries\n"""\ntype LegalEntitiesQuery {\n\n  """\n  Returns legal entities list bundle\n  """\n  list(\n    first: Int\n    offset: Int\n    after: String\n    orderBy: [LegalEntityOrderBy]\n    filter: LegalEntityListFilter\n    search: LegalEntityFilterSearch\n  ): LegalEntityListConnection!\n\n}\n\ntype LegalEntitiesMutation {\n  \n  """\n  Create legal entity\n  """\n  create(\n    data: InputLegalEntityCreate!\n  ): LegalEntity!\n\n  """\n  Update legal entity\n  """\n  update(\n    id: ID!\n    data: InputLegalEntityUpdate!\n  ): LegalEntity!\n\n  """\n  Delete legal entity\n  """\n  delete(\n    id: ID!\n  ): Boolean!\n}\n\n"""\nPossible data to order list of legal entities\n"""\ninput LegalEntityOrderBy {\n  field: LegalEntityOrderField!\n  direction: OrderDirection!\n}\n\n"""\nPossible data to filter list of legal entities\n"""\ninput LegalEntityListFilter {\n  inn: String\n}\n\nenum LegalEntityFilterSearchField {\n  name\n  address\n  ogrn\n  kpp\n  inn\n  rs\n  ks\n  bic\n  bank\n  directorNameNominative\n  directorNameGenitive\n}\n\ninput LegalEntityFilterSearch {\n  field: LegalEntityFilterSearchField!\n  query: String!\n}\n\n"""\nLegal entity adge bundle\n"""\ntype LegalEntityEdge implements Edge {\n  node: LegalEntity!\n  cursor: String!\n}\n\n"""\nLegal entities list bundle\n"""\ntype LegalEntityListConnection implements Connection {\n  totalCount: Int!\n  pageInfo: PageInfo!\n  edges: [LegalEntityEdge]!\n}\n\n\n"""\nLegal entity data\n"""\ntype LegalEntity implements Node {\n  id: ID!\n  createdAt: DateTime!\n  updatedAt: DateTime!\n  name: String!\n  address: String!\n  ogrn: String!\n  kpp: String\n  inn: String!\n  rs: String!\n  ks: String!\n  bic: String!\n  bank: String!\n  directorNameNominative: String!\n  directorNameGenitive: String!\n}\n\n"""\nPossible data to legal entity update\n"""\ninput InputLegalEntityUpdate {\n  id: ID\n  name: String\n  address: String\n  ogrn: String\n  kpp: String\n  inn: String\n  rs: String\n  ks: String\n  bic: String\n  bank: String\n  directorNameNominative: String\n  directorNameGenitive: String\n}\n\n\ninput InputLegalEntityCreate {\n  name: String!\n  address: String!\n  ogrn: String!\n  kpp: String!\n  inn: String!\n  rs: String!\n  ks: String!\n  bic: String!\n  bank: String!\n  directorNameNominative: String!\n  directorNameGenitive: String!\n}',name:"GraphQL request",locationOffset:{line:1,column:1}};e.exports=i}]);