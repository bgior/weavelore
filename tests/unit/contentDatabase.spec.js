// © Copyright 2019 Bruno Giorello. Released under GNU AGPLv3, see 'LICENSE.md'.

import ContentDatabase from '@/util/contentDatabase.js';
import srd from '../../public/srd.json';

// Get a cloned copy of the SRD data
const getSRD = () => JSON.parse(JSON.stringify(srd));

describe('ContentDatabase', () => {
  it('loads the default data correctly', () => {
    const db = ContentDatabase.getBlank();
    expect(db.data.sources.length).toBe(0);
    db.loadJSON(getSRD());
    expect(db.data.sources[0].name).toBe('SRD 5.1');
    // Validate spells
    const spells = db.getSpells();
    expect(spells.length).toBe(319);
    const spell = spells[0];
    expect(spell.name).toBe("Acid Arrow");
    expect(spell.classes.length).toBe(1);
    expect(spell.classes[0]).toBe("wizard");
    expect(spell.school).toBe("evocation");
    expect(spell.level).toBe(2);
    expect(spell.range).toBe("90 feet");
    expect(spell.duration).toBe("Instantaneous");
    expect(spell.casting).toBe("1 action");
    expect(spell.verbal).toBe(true);
    expect(spell.somatic).toBe(true);
    expect(spell.material).toBe(1);
    expect(spell.materials).toBe("Powdered rhubarb leaf and an adder's stomach");
    expect(spell.concentration).toBe(false);
    expect(spell.ritual).toBe(false);
    expect(spell.description).toBe("<p>A shimmering green arrow streaks toward a target within range and bursts in a spray of acid. Make a ranged spell attack against the target. On a hit, the target takes 4d4 acid damage immediately and 2d4 acid damage at the end of its next turn. On a miss, the arrow splashes the target with acid for half as much of the initial damage and no damage at the end of its next turn.</p>");
    expect(spell.atHigherLevel).toBe("<p>When you cast this spell using a spell slot of 3rd level or higher, the damage (both initial and later) increases by 1d4 for each slot level above 2nd.</p>");
    expect(spell.downcasedName).toBe("acid arrow");
    expect(spell.codename).toBe("acid-arrow");
    expect(spell.sourceName).toBe("SRD 5.1");
    // Validate rules
    const rules = db.getRules();
    expect(rules.length).toBe(39);
    const rule = rules[0];
    expect(rule.name).toBe("Areas of Effect");
    expect(rule.category).toBe("Spellcasting");
    expect(rule.description).toBe("<p>Spells such as <i>burning hands</i> and <i>cone of cold</i> cover an area, allowing them to affect multiple creatures at once.</p><p>A spell's description specifies its area of effect, which typically has one of five different shapes: cone, cube, cylinder, line, or sphere. Every area of effect has a <b>point of origin</b>, a location from which the spell's energy erupts. The rules for each shape specify how you position its point of origin. Typically, a point of origin is a point in space, but some spells have an area whose origin is a creature or an object.</p><p>A spell's effect expands in straight lines from the point of origin. If no unblocked straight line extends from the point of origin to a location within the area of effect, that location isn't included in the spell's area. To block one of these imaginary lines, an obstruction must provide total cover.</p><h2>Cone</h2><p>A cone extends in a direction you choose from its point of origin. A cone's width at a given point along its length is equal to that point's distance from the point of origin. A cone's area of effect specifies its maximum length.</p><p>A cone's point of origin is not included in the cone's area of effect, unless you decide otherwise.</p><h2>Cube</h2>You select a cube's point of origin, which lies anywhere on a face of the cubic effect. The cube's size is expressed as the length of each side.</p><p>A cube's point of origin is not included in the cube's area of effect, unless you decide otherwise.</p><h2>Cylinder</h2><p>A cylinder's point of origin is the center of a circle of a particular radius, as given in the spell description. The circle must either be on the ground or at the height of the spell effect. The energy in a cylinder expands in straight lines from the point of origin to the perimeter of the circle, forming the base of the cylinder. The spell's effect then shoots up from the base or down from the top, to a distance equal to the height of the cylinder.</p><p>A cylinder's point of origin is included in the cylinder's area of effect.</p><h2>Line</h2><p>A line extends from its point of origin in a straight path up to its length and covers an area defined by its width.</p><p>A line's point of origin is not included in the line's area of effect, unless you decide otherwise.</p><h2>Sphere</h2><p>You select a sphere's point of origin, and the sphere extends outward from that point.</p><p>The sphere's size is expressed as a radius in feet that extends from the point. A sphere's point of origin is included in the sphere's area of effect.</p>");
    expect(rule.tags.join()).toBe(["cone", "cube", "cylinder", "line", "sphere"].join());
  });

  it('merges sources correctly', () => {
    // Ensure that loaded sources overwrite the previous ones only if the version is equal or greater
    const file1 = ContentDatabase.getBlank().data;
    file1.sources = [
      { name: "SourceA", description: "F1", version: 1, spells: [], rules: [] },
      { name: "SourceB", description: "F1", version: 10, spells: [], rules: [] },
      { name: "SourceC", description: "F1", version: 10, spells: [], rules: [] },
      { name: "SourceD", description: "F1", version: 10, spells: [], rules: [] }
    ];
    const file2 = ContentDatabase.getBlank().data;
    file2.sources = [
      { name: "SourceB", description: "F2", version: 9, spells: [], rules: [] },
      { name: "SourceC", description: "F2", version: 10, spells: [], rules: [] },
      { name: "SourceD", description: "F2", version: 11, spells: [], rules: [] },
      { name: "SourceE", description: "F2", version: 1, spells: [], rules: [] }
    ];
    const db = ContentDatabase.getBlank();
    db.loadJSON(file1);
    db.loadJSON(file2);
    const sources = db.data.sources;
    expect(sources.length).toBe(5);
    expect(sources.find(s => s.name == 'SourceA').version).toBe(1); // Existed only in the first file
    expect(sources.find(s => s.name == 'SourceB').version).toBe(10); // Should NOT have been overwritten by the second file
    expect(sources.find(s => s.name == 'SourceC').version).toBe(10); // Should have been overwritten by the second file
    expect(sources.find(s => s.name == 'SourceC').description).toBe("F2"); // ... check description to be sure
    expect(sources.find(s => s.name == 'SourceD').version).toBe(11); // Should have been overwritten by the second file
    expect(sources.find(s => s.name == 'SourceE').version).toBe(1); // Existed only in the second file
  });

  it('yields the same data when imported and then exported', () => {
    const database = ContentDatabase.getBlank();
    database.loadJSON(getSRD());
    expect(database.export()).toBe(JSON.stringify(getSRD()));
  });

  it('yields the same data when persisted and then loaded', () => {
    const originalDB = ContentDatabase.getBlank();
    originalDB.addSource({ name: "SourceA", description: "D1", version: 1, spells: [], rules: [] });
    originalDB.saveToStorage();
    const loadedDB = ContentDatabase.getFromStorageOrBlank();
    expect(JSON.stringify(loadedDB.data)).toBe(JSON.stringify(originalDB.data));
  });
})
