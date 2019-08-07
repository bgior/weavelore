// © Copyright 2019 Bruno Giorello. Released under GNU AGPLv3, see 'LICENSE.md'.

import constants from '@/util/constants.js';

// This class performs diverse validations on content database JSONs.
class ContentDatabaseValidator {

  static validate(json) {
    this.assert(typeof(json) == 'object', 'Unrecognized format.')
    this.assert(json.format == 'WLC', `The format is not valid. Expected "WLC", got "${json.format}".`);
    this.assertType(json, 'formatVersion', 'string');
    this.assertType(json, 'sources', 'object');
    for (let source of json.sources) {
      this.assertType(source, 'name', 'string');
      this.assertType(source, 'description', 'string');
      this.assertType(source, 'version', 'number');
      this.assertType(source, 'spells', 'object');
      this.assertType(source, 'rules', 'object');
      for (let spell of source.spells) {
        this.assertType(spell, 'name', 'string');
        this.assertType(spell, 'classes', 'object');
        for (let klass of spell.classes) {
          this.assert(constants.classes.includes(klass), `Class "${klass}" is not allowed.'`);
        }
        this.assertType(spell, 'school', 'string');
        this.assert(constants.schools.includes(spell.school), `School "${spell.school}" is not allowed.`);
        this.assert(constants.levels.includes(spell.level), `Level ${spell.level} is not allowed.`);
        this.assertType(spell, 'range', 'string');
        this.assertType(spell, 'duration', 'string');
        this.assertType(spell, 'casting', 'string');
        this.assertType(spell, 'verbal', 'boolean');
        this.assertType(spell, 'somatic', 'boolean');
        this.assertType(spell, 'material', 'number');
        this.assertType(spell, 'materials', 'string', false);
        this.validateHTML(spell.materials);
        this.assertType(spell, 'concentration', 'boolean');
        this.assertType(spell, 'ritual', 'boolean');
        this.assertType(spell, 'description', 'string');
        this.validateHTML(spell.description);
        this.assertType(spell, 'aoe', 'object', false);
        this.assertType(spell, 'atHigherLevel', 'string', false);
        this.validateHTML(spell.atHigherLevel);
      }
    }
  }
  static assert(condition, message) {
    if (!condition) {
      throw { name: 'ValidationError', message };
    }
  }
  static assertType(hash, key, type, required = true) {
    if (hash[key] == undefined || hash[key] == null) {
      if (!required) return;
      console.log(hash);
      throw { name: 'ValidationError', message: `Field is missing: "${key}".`};
    }
    if (typeof(hash[key]) != type) {
      console.log(hash);
      throw { name: 'ValidationError', message: `Error on field "${key}": expected ${type} but got ${typeof(hash[key])}`};
    }
  }
  static validateHTML(str) {
    if (!str) return;
    const balances = {}; // The balance for each tag tracks how many of each were opened and closed
    for (const tagName of constants.allowedTags) {
      balances[tagName] = 0;
    }

    let tag;
    while((tag = TAG_REGEX.exec(str)) !== null) {
      const match = tag[0].match(TAG_SPLIT_REGEX);
      const closing = match[1] == '/';
      const type = match[2];
      this.assert(constants.allowedTags.includes(type), `HTML tag type not allowed: "${type}".`);
      balances[type] += closing ? -1 : 1;
      this.assert(balances[type] >= 0, `HTML closing tag unmatched: "${type}".`);
    }

    for (let tag in balances) {
      this.assert(balances[tag] == 0, `HTML opening tag unmatched: "${tag}".`);
    }
  }
}
const TAG_REGEX = /<\/?[a-zA-Z0-9-]+(?: [^>]+)?>/g;
const TAG_SPLIT_REGEX = /<(\/?)([a-zA-Z0-9-]+)(?: [^>]+)?>/;
export default ContentDatabaseValidator;