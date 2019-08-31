// © Copyright 2019 Bruno Giorello. Released under GNU AGPLv3, see 'LICENSE.md'.

// This static class handles some text transformations to make descriptions prettier
class TextBeautifier {

  // Colorize different keyword types within the text
  static colorize(text) {
    for (let sub of this.substitutions) {
      text = text.replace(sub[0], sub[1]);
    }
    return text;
  }

  // Add the average of multi-die rolls as ruby text
  static addDieAverages(text) {
    for (let match of text.matchAll(/<span class="sx-die">(.*?)<\/span>/g)) {
      const parts = match[1].split("d");
      const amount = parseInt(parts[0]);
      if (!amount || amount < 2) continue;
      const sides = parseInt(parts[1]);
      text = text.replace(match[0], `<span class="sx-die"><ruby>${match[1]}<rt>${amount * (sides + 1) / 2}</rt></ruby></span>`)
    }
    return text;
  }

  // Add the 'table' class to tables for bootstrap CSS formatting
  static styleTables(text) {
    if (text.includes('<table>')) {
      return text.replace(/<table>/g, '<table class="table">');
    }
    return text;
  }

  static addRuleLinks(text) {
    return text.replace(this.rulesRegex, '<span class="dynamic-link">$1</span>');
  }

  // Apply all transformations
  static beautify(text) {
    return this.styleTables(this.addDieAverages(this.colorize(this.addRuleLinks(text))));
  }
}
TextBeautifier.substitutions = [
  [/([\d,]+[- ](f[eo]{2}t|miles?))/g, '<span class="sx-distance">$1</span>'],
  [/(\d+[- ](round?|hours?|minutes?|days?))/g, '<span class="sx-time">$1</span>'],
  [/(\d+[- ](pounds?))/g, '<span class="sx-weight">$1</span>'],
  [/(DC|(([Ss]trength|[Dd]exterity|[Cc]onstitution|[Ii]ntelligence|[Ww]isdom|[Cc]harisma)? saving throws?)|\w*? \(\w+?\) checks?)/g, '<span class="sx-sthrow">$1</span>'],
  [/([^\w](advantage)[^\w])/g, '<span class="sx-advantage">$1</span>'],
  [/([^\w](disadvantage)[^\w])/g, '<span class="sx-disadvantage">$1</span>'],
  [/(([Aa]cid|[Bb]ludgeoning|[Cc]old|[Ff]ire|[Ff]orce|[Ll]ightning|[Nn]ecrotic|[Pp]iercing|[Pp]oison|[Pp]sychic|[Rr]adiant|[Ss]lashing|[Tt]hunder) damage[^s])/g, '<span class="sx-life">$1</span>'],
  [/((melee|ranged)( spell)? attacks?)/g, '<span class="sx-attack">$1</span>'],
  [/(\d*?d\d+)/g, '<span class="sx-die">$1</span>']
];
TextBeautifier.rulesRegex = /(blinded|blindsight|bright light|charmed|darkvision|deafened|dim light|exhaustion|frightened|heavily obscured|grappled|incapacitated|invisible|lightly obscured|paralyzed|petrified|poisoned|prone|restrained|stunned|truesight|unconscious)/g;
export default TextBeautifier;
