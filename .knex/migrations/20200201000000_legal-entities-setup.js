module.exports =
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 59983:
/***/ (function(__unused_webpack_module, exports) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.down = exports.up = void 0;
function up(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        return knex.raw(`
    drop table if exists "legalEntities" cascade;
    drop table if exists "legalEntitiesPayments" cascade;

    drop type if exists "legalEntityPaymentPriority";

    create type "legalEntityPaymentPriority" AS enum (
      'master',
      'slave'
    );


    create table "legalEntities" (
      "id" uuid NOT NULL,
      "createdAt" timestamptz NOT NULL DEFAULT now(),
      "updatedAt" timestamptz NOT NULL DEFAULT now(),
      "label" varchar(100) NOT NULL,
      "address" varchar(255) NOT NULL,
      "ogrn" varchar(50) NOT NULL,
      "kpp" varchar(100) NULL,
      "inn" varchar(50) NOT NULL,
      "directorNameNominative" varchar(255) NOT NULL,
      "directorNameGenitive" varchar(255) NOT NULL,
      "deleted" bool NOT NULL DEFAULT false,
      "directorNameShortNominative" varchar(100) NOT NULL DEFAULT ''::character varying,
      "directorNameShortGenitive" varchar(100) NOT NULL DEFAULT ''::character varying,
      "comment" text NULL,
      "nameShort" varchar(100) NOT NULL DEFAULT ''::character varying,
      "nameFull" text NOT NULL DEFAULT ''::character varying,
      "city" uuid NULL,
      CONSTRAINT "legalEntitiesInnUniqe" UNIQUE (inn),
      CONSTRAINT "legalEntities_pkey" PRIMARY KEY (id)
    );

    create table "legalEntitiesPayments" (
      "id" uuid NOT NULL,
      "owner" uuid NOT NULL,
      "createdAt" timestamptz NOT NULL DEFAULT now(),
      "updatedAt" timestamptz NOT NULL DEFAULT now(),
      "rs" varchar(255) NOT NULL,
      "ks" varchar(255) NOT NULL,
      "bic" varchar(255) NOT NULL,
      "bank" varchar(255) NOT NULL,
      "priority" "legalEntityPaymentPriority" NOT NULL DEFAULT 'slave'::"legalEntityPaymentPriority",
      "deleted" bool NOT NULL DEFAULT false,
      "comment" text NULL,
      CONSTRAINT "legalEntitiesPayments_pkey" PRIMARY KEY (id)
    );


    create index "legalEntitiesDeletedIndex" ON "legalEntities" USING btree ("deleted");
    create index "legalentitiesInnIndex" ON "legalEntities" USING btree ("inn");
    create index "legalentitiesOgrnIndex" ON "legalEntities" USING btree ("ogrn");
    create index "legalEntitiesPaymentsDeletedIndex" ON "legalEntitiesPayments" USING btree ("deleted");

    alter table "legalEntitiesPayments" ADD CONSTRAINT "legalEntitiesPayments_owner_fk" FOREIGN KEY ("owner") REFERENCES "legalEntities"("id") ON DELETE CASCADE;
    alter table "legalEntities" ADD CONSTRAINT "legalEntitiesToCity_fk" FOREIGN KEY ("city") REFERENCES "geographyCities"("id") ON UPDATE SET NULL;

  `);
    });
}
exports.up = up;
function down(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        return knex.raw(`
    drop table if exists "legalEntitiesPayments" cascade;
    drop table if exists "legalEntities" cascade;

    drop type if exists "legalEntityPaymentPriority";
  `);
    });
}
exports.down = down;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(59983);
/******/ })()
;