// © Copyright 2019 Bruno Giorello. Released under GNU AGPLv3, see 'LICENSE.md'.

// This file define the options that CustomSelect dropdowns for spell school,
// class, level and source should have.

import constants from '@/util/constants.js';
import Icons from '@/util/icons.js';

export default {
  classOptions: constants.classes.map(c => { return { value: c, text: c, image: Icons.classIcon(c) }}),
  levelOptions: [{ value: '0', text: 'Cantrip' }, { value: '1', text: '1st level' },
    { value: '2', text: '2nd level' }, { value: '3', text: '3rd level' }
    ].concat([4,5,6,7,8,9].map(n => { return { value: n.toString(), text: n + 'th level' }})),
  schoolOptions: constants.schools.map(s => { return { value: s, text: s, image: Icons.schoolIcon({school: s}) }}),
  materialOptions: [
    { value: '0', text: 'No material component' },
    { value: '1', text: 'Normal material component', image: require('@/assets/images/icons/components/material.png') },
    { value: '2', text: 'Expensive material, not consumed', image: require('@/assets/images/icons/components/expensive2.png') },
    { value: '3', text: 'Expensive material, consumed', image: require('@/assets/images/icons/components/expensive3.png') }
  ],
  sourceOptions(app) {
    return app.contentDatabase.data.sources.map(s => { return { value: s.name, image: require('@/assets/images/icons/spell_features/source.png') } });
  },
  aoeOptions: ['sphere', 'cube', 'cone'].map(a => { return { value: a, image: require(`@/assets/images/icons/ranges/${a}.png`) }}).concat(
    [{ value: '', text: 'None', image: require('@/assets/images/icons/misc/none.png') }]
  ),
  centerOptions: [
    { value: '', text: "automatic", image: require('@/assets/images/icons/misc/none.png') },
    { value: 'intersection', image: require('@/assets/images/icons/misc/cntInter.png') },
    { value: 'cell', image: require('@/assets/images/icons/misc/cntCell.png') }
  ]
};