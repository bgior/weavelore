// © Copyright 2019 Bruno Giorello. Released under GNU AGPLv3, see 'LICENSE.md'.

import constants from '@/util/constants.js';

// This class performs diverse validations on content database JSONs.
class ContentDatabaseValidator {

  // Given the JSON of an entire content database, perform all validations
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
      this.validateSpells(source.spells);
    }
  }
  // Validate an array of spells
  static validateSpells(spells) {
    for (let spell of spells) {
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
      if (spell.aoe) {
        const aoe = spell.aoe;
        this.assert(['sphere', 'cone', 'cube'].includes(aoe.type), `Invalid AOE type: ${aoe.type}`);
        this.assertType(aoe, 'range', 'number', false);
        if (aoe.center) {
          this.assert(['cell', 'intersection'].includes(this.aoe.center), `The AOE center "${this.aoe.center}" is not valid.`);
          this.assert(spell.aoe.type == 'sphere', `The "center" field can only be used for spheres, not ${aoe.type}s.`);
        }
      }
      this.assertType(spell, 'atHigherLevel', 'string', false);
      this.validateHTML(spell.atHigherLevel);
    }
  }
  // Validate an array of rules
  static validateRules(rules) {
    for (let rule of rules) {
      this.assertType(rule, 'name', 'string');
      this.assertType(rule, 'category', 'string');
      this.assertType(rule, 'description', 'string');
      if (spell.tags) {
        const tags = spell.tags;
        this.assertType(rule, 'tags', 'object');
        for (let tag of tags) {
          this.assert(typeof(tag) == 'string', `Expected tag list to contain only strings but got a ${typeof(tag)}.`);
        }
      }
      this.assert(['eye', 'hand', 'stars'].includes(rule.icon), `Invalid rule icon: ${rule.icon}`);
      this.assertType(rule, 'source', 'string', false);
    }
  }
  // Assert that a condition is true by raising an exception if not
  static assert(condition, message) {
    if (!condition) {
      throw { name: 'ValidationError', message };
    }
  }
  // Assert that a property of a hash has a certain type, and (unless required = false) that it's present
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
  // Validate that the HTML within a string is valid (not broken, using forbidden tags, etc.)
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
const TAG_REGEX = /<\/?[a-zA-Z0-9-]+(?: [^>]+)?>/g; // Matches an HTML tag
const TAG_SPLIT_REGEX = /<(\/?)([a-zA-Z0-9-]+)(?: [^>]+)?>/; // Matches an HTML tag and captures various groups
export default ContentDatabaseValidator;
