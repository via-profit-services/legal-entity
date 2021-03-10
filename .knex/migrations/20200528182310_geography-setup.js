module.exports =
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 10:
/***/ (function(__unused_webpack_module, exports) {


/**
 * @via-profit-services/geography
 *
 * This migration file was created by the @via-profit-services/geography package
 * This migration will create 3 tables:
 *     `geographyCities`
 *     `geographyStates`
 *     `geographyCountries`
 */
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
function up(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        return knex.raw(`

    drop table if exists "geographyCities" cascade;
    drop table if exists "geographyStates" cascade;
    drop table if exists "geographyCountries" cascade;

    CREATE TABLE "geographyCountries" (
      "id" uuid NOT NULL,
      "ru" varchar(100) NOT NULL,
      "en" varchar(100) NOT NULL,
      "iso3" varchar(4) NOT NULL,
      "iso2" varchar(4) NOT NULL,
      "phoneCode" varchar(20) NOT NULL,
      "currency" varchar(5) NOT NULL,
      "capital" uuid NULL DEFAULT NULL,
      CONSTRAINT "geographyCountries_pk" PRIMARY KEY (id)
    );


    CREATE TABLE "geographyStates" (
      "id" uuid NOT NULL,
      "ru" varchar(100) NOT NULL,
      "en" varchar(100) NOT NULL,
      "country" uuid NOT NULL,
      "stateCode" varchar(10) NOT NULL,
      "countryCode" varchar(10) NOT NULL,
      CONSTRAINT "geographyStates_pk" PRIMARY KEY (id)
    );
    ALTER TABLE "geographyStates" ADD CONSTRAINT "geographyStates_fk_country" FOREIGN KEY ("country") REFERENCES "geographyCountries"(id) ON DELETE CASCADE;
    

    CREATE TABLE "geographyCities" (
      "id" uuid NOT NULL,
      "ru" varchar(100) NOT NULL,
      "en" varchar(100) NOT NULL,
      "country" uuid NOT NULL,
      "countryCode" varchar(10) NOT NULL,
      "state" uuid NOT NULL,
      "stateCode" varchar(10) NOT NULL,
      "latitude" varchar(20) NOT NULL,
      "longitude" varchar(20) NOT NULL,
      "timezone" varchar(60) NOT NULL,
      CONSTRAINT "geographyCities_pk" PRIMARY KEY (id)
    );
    ALTER TABLE "geographyCities" ADD CONSTRAINT "geographyCities_fk_country" FOREIGN KEY ("country") REFERENCES "geographyCountries"(id) ON DELETE CASCADE;
    ALTER TABLE "geographyCities" ADD CONSTRAINT "geographyCities_fk_state" FOREIGN KEY ("state") REFERENCES "geographyStates"(id) ON DELETE CASCADE;
  `);
    });
}
exports.up = up;
function down(knex) {
    return __awaiter(this, void 0, void 0, function* () {
        return knex.raw(`
    drop table if exists "geographyCities" cascade;
    drop table if exists "geographyStates" cascade;
    drop table if exists "geographyCountries" cascade;
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
/******/ 	return __webpack_require__(10);
/******/ })()
;