// © Copyright 2019 Bruno Giorello. Released under GNU AGPLv3, see 'LICENSE.md'.

// This static class abstracts frequently used logic related to spell icons.
class Icons {
  static classIcon(className) {
    return require(`@/assets/images/icons/classes/${className}.png`);
  }
  static classIcons(spell) {
    return spell.classes.map(this.classIcon);
  }
  static schoolIcon(spell) {
    return require(`@/assets/images/icons/schools/${spell.school}.png`);
  }
  static durationIcon(spell) {
    const name = { instantaneous: 'instant', 'until dispelled': 'dispelled' }[spell.duration.toLowerCase()] || 'transient';
    return require(`@/assets/images/icons/durations/${name}.png`);
  }
  static aoeIcon(spell) {
    const name = spell.aoe ? { cube: 'cube', sphere: 'sphere', cone: 'cone' }[spell.aoe.type] : null;
    return name ? require(`@/assets/images/icons/ranges/${name}.png`) : require('@/assets/images/icons/misc/none.png');
  }
  static rangeIcon(spell) {
    let name;
    const range = spell.range.toLowerCase();
    if (range.includes("self")) {
      name = "self";
    } else if (range.includes("touch")) {
      name = "touch";
    } else {
      name = "range";
    }
    return require(`@/assets/images/icons/ranges/${name}.png`);
  }
  static castingIcon(spell) {
    let name;
    const casting = spell.casting.toLowerCase();
    if (casting.includes("bonus")) {
      name = "bonus";
    } else if (casting.includes("reaction")) {
      name = "reaction";
    } else if (casting.includes("action")) {
      name = "action";
    } else {
      name = "longcast";
    }
    return require(`@/assets/images/icons/ctimes/${name}.png`);
  }
  static componentIcons(spell) {
    let icons = [];
    if (spell.verbal) icons.push(require('@/assets/images/icons/components/verbal.png'));
    if (spell.somatic) icons.push(require('@/assets/images/icons/components/somatic.png'));
    if (spell.material > 0) icons.push(require('@/assets/images/icons/components/material.png'));
    if (spell.material == 2) icons.push(require('@/assets/images/icons/components/expensive2.png'));
    if (spell.material == 3) icons.push(require('@/assets/images/icons/components/expensive3.png'));
    return icons;
  }
}
export default Icons;
