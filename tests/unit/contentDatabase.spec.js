// © Copyright 2019 Bruno Giorello. Released under GNU AGPLv3, see 'LICENSE.md'.

import ContentDatabase from '@/util/contentDatabase.js';
import srd from '../../public/srd.json';

// Get a cloned copy of the SRD data
const getSRD = () => JSON.parse(JSON.stringify(srd));

describe('ContentDatabase', () => {
  it('loads the default data correctly', () => {
    const db = ContentDatabase.getDefault();
    expect(db.data.sources.length).toBe(0);
    db.loadJSON(getSRD());
    expect(db.data.sources[0].name).toBe('SRD 5.1');
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
    expect(spell.materials).toBe("Powdered rhubarb leaf and an adder’s stomach");
    expect(spell.concentration).toBe(false);
    expect(spell.ritual).toBe(false);
    expect(spell.description).toBe("<p>A shimmering green arrow streaks toward a target within range and bursts in a spray of acid. Make a ranged spell attack against the target. On a hit, the target takes 4d4 acid damage immediately and 2d4 acid damage at the end of its next turn. On a miss, the arrow splashes the target with acid for half as much of the initial damage and no damage at the end of its next turn.</p>");
    expect(spell.atHigherLevel).toBe("<p>When you cast this spell using a spell slot of 3rd level or higher, the damage (both initial and later) increases by 1d4 for each slot level above 2nd.</p>");
    expect(spell.downcasedName).toBe("acid arrow");
    expect(spell.codename).toBe("acid-arrow");
    expect(spell.source).toBe("SRD 5.1");
  });

  it('merges sources correctly', () => {
    // Ensure that loaded sources overwrite the previous ones only if the version is equal or greater
    const file1 = ContentDatabase.getDefault().data;
    file1.sources = [
      { name: "SourceA", description: "F1", version: 1, spells: [], rules: [] },
      { name: "SourceB", description: "F1", version: 10, spells: [], rules: [] },
      { name: "SourceC", description: "F1", version: 10, spells: [], rules: [] },
      { name: "SourceD", description: "F1", version: 10, spells: [], rules: [] }
    ];
    const file2 = ContentDatabase.getDefault().data;
    file2.sources = [
      { name: "SourceB", description: "F2", version: 9, spells: [], rules: [] },
      { name: "SourceC", description: "F2", version: 10, spells: [], rules: [] },
      { name: "SourceD", description: "F2", version: 11, spells: [], rules: [] },
      { name: "SourceE", description: "F2", version: 1, spells: [], rules: [] }
    ];
    const db = ContentDatabase.getDefault();
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
    const database = ContentDatabase.getDefault();
    database.loadJSON(getSRD());
    expect(database.export()).toBe(JSON.stringify(getSRD()));
  });

  it('yields the same data when persisted and then loaded', () => {
    const originalDB = ContentDatabase.getDefault();
    originalDB.loadJSON(getSRD()); // Automatically persists originalDB in localStorage
    const loadedDB = ContentDatabase.getFromStorageOrDefault();
    expect(JSON.stringify(originalDB.data)).toBe(JSON.stringify(loadedDB.data));
  });
})
