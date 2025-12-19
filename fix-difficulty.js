const fs = require('fs');
const path = require('path');

// Read the existing riddles
const riddlesPath = path.join(__dirname, 'riddles.json');
const riddlesData = JSON.parse(fs.readFileSync(riddlesPath, 'utf8'));

function categorizeRiddle(riddle) {
  const question = riddle.question.toLowerCase();
  const answer = riddle.answer.toLowerCase();

  // HARD - Multi-step reasoning, temporal/conditional logic, reframing required
  const hardRiddles = [
    // Family/relationship logic puzzles
    /pass.*2nd place|second place.*finish/i,
    /grant.*8.*brother.*half.*age/i,
    /liam.*11.*day before yesterday.*14/i,
    /doctors.*brother.*robert.*no brothers/i,
    /mrs\.? brown.*5 daughters.*brother/i,
    /zoey.*20 aunts.*aunt who is not/i,
    /fathers.*sons.*fishing.*3 fish/i,

    // Logic/scenario analysis
    /bus driver.*stop signs.*one-way.*break.*traffic/i,
    /man dies.*old age.*25th birthday/i,
    /man.*hanging.*ceiling.*rope.*2ft.*puddle/i,
    /murdered.*sunday.*maid.*mail/i,
    /electric chair.*no electricity|electricity.*electric chair/i,
    /creepy house.*3 doors.*lion.*stabbed.*electric/i,

    // Sequences and patterns requiring logic
    /ottffss/i,
    /next three letters.*combination/i,

    // Complex riddles requiring reframing
    /actor.*talk.*speak.*mind.*hear.*words/i,
    /volcano.*thunder.*lightning.*rain dries/i,
    /this thing all things devours.*birds.*beasts.*trees/i,
    /four legs.*morning.*two legs.*day.*three legs/i,
    /creature.*kiss.*spider/i,
    /person.*lives in disguise.*secrets.*lies/i,
    /voiceless.*cries.*wingless.*flies.*toothless.*bites/i,

    // Math with multiple constraints
    /three-digit.*tens.*five more.*ones.*hundreds.*eight less/i,
    /eight 8.*1,?000/i,
    /3\/7 chicken.*2\/3 cat.*2\/4 goat/i,

    // Temporal/date logic
    /midnight.*48 hours.*sunny/i,
    /raining.*midnight.*forecast.*sunny/i,

    // Requires rejecting intuitive answer
    /1 rabbit.*9 elephants.*3 monkeys.*parrot.*toward.*river/i,
    /st\.? ives.*man.*seven wives.*sacks.*cats.*kits/i,
    /basket.*3 apples.*take.*2.*how many/i,
    /5 apples.*take.*3.*how many/i,
    /all but three break.*how many.*unbroken/i,

    // Story-based deception
    /woman shoots.*husband.*underwater.*hangs.*dinner/i,
    /born before.*father.*killed.*mother.*married.*sister/i
  ];

  // MEDIUM - Misdirection, wordplay, language tricks, basic logic
  const mediumRiddles = [
    // Belongs/ownership wordplay
    /belongs to you.*others use/i,
    /yours.*others use.*more/i,
    /your name|my name/i,

    // Dictionary/spelling tricks
    /dictionary.*spelled.*wrong|spelled.*incorrectly.*dictionary/i,
    /only.*word.*spelled wrong/i,

    // Space/room wordplay
    /fill.*room.*no space|room.*takes no space/i,

    // Abstract concepts
    /goes? away.*talk about|talk.*silence|silence/i,
    /what.*thirteen hearts/i,
    /what.*deck of cards/i,

    // Question paradoxes
    /question.*never answer.*yes|never.*yes.*asleep/i,

    // Calendar/time wordplay
    /how many months.*28 days|months.*28/i,
    /kate'?s? mother.*three children.*snap.*crackle/i,

    // Letter/word manipulation
    /word.*shorter.*add.*letters|five.*letter.*shorter/i,
    /capital of france/i,
    /word.*begins.*ends.*e.*one letter/i,
    /odd number.*remove.*letter.*even/i,
    /pronounced.*remove.*four.*five letters/i,
    /forward.*heavy.*backward.*not/i,
    /word.*forward.*backward.*upsidedown/i,

    // Letter in word riddles
    /letter.*mercury.*earth.*mars.*jupiter/i,
    /beginning.*everything.*end.*everywhere/i,
    /once.*minute.*twice.*moment/i,
    /letter.*e|letter.*n|letter.*m|letter.*r|letter.*g/i,
    /seasons.*seconds.*centuries.*minutes/i,
    /june.*november.*may/i,

    // Simple math tricks
    /ton of bricks.*ton of feathers|feathers.*bricks.*weigh/i,
    /four and five.*crowd.*company/i,
    /kilo.*hierro.*kilo.*plumas/i,

    // Married/single wordplay
    /boat.*people.*not.*single.*married/i,
    /bald.*rain.*hair/i,

    // One-story paradox
    /one-?story.*stairs.*color/i,

    // Light/darkness
    /more.*less you see|darkness/i,

    // Walking vs driving
    /bus driver.*walking.*not driving/i,

    // Object wordplay
    /umbrella.*chimney.*up.*down/i,
    /popcorn.*bigger.*weigh less/i,
    /snowman.*lose weight|snowman.*warmer/i,
    /mirror.*crack.*smile/i,

    // Before/after wordplay
    /today.*before yesterday.*dictionary/i,

    // Upside down
    /upside down.*11.*69.*88/i,
    /81.*9.*801.*upside/i,

    // Break/fall paradox
    /break.*never falls.*falls.*never breaks/i,

    // Promise/secret
    /don'?t keep.*break.*promise/i,
    /have it.*don'?t share.*share.*don'?t have.*secret/i,

    // Imagination
    /imagine.*room.*no windows.*no doors.*stop imagining/i,

    // Riddle count in alphabet
    /how many letters.*alphabet.*11/i,

    // Library/stories
    /building.*most stories.*library/i,

    // Basic logic but not multi-step
    /stand behind.*father.*behind you.*back.*back/i,
    /hold.*left hand.*not.*right.*elbow/i,
    /hold.*right hand.*not.*left.*left hand/i,

    // Spanish medium riddles
    /mientras más.*menos se ve.*oscuridad/i,
    /cosa.*tuya.*usan.*demás.*nombre/i,
    /rompe sin.*tocado.*silencio/i,
    /mes.*año.*28.*todos/i,
    /hombre.*lluvia.*paraguas.*pelo.*calvo/i,
    /pregunta.*nunca.*'sí'.*dormido/i,
    /tres manzanas.*tomas dos.*cuántas.*dos/i,
    /animal.*patas.*cabeza.*piojo/i,
    /palabra.*cinco.*corta.*dos.*corta/i,
    /casa.*piso.*escaleras.*no hay/i,
    /alfiler|carámbano|árbol genealógico/i
  ];

  // Check for hard patterns
  for (const pattern of hardRiddles) {
    if (pattern.test(question) || pattern.test(answer)) {
      return 'hard';
    }
  }

  // Check for medium patterns
  for (const pattern of mediumRiddles) {
    if (pattern.test(question) || pattern.test(answer)) {
      return 'medium';
    }
  }

  // Additional medium checks - longer questions often have tricks
  if (question.length > 180) {
    return 'medium';
  }

  // Everything else is EASY - direct, literal, children's riddles
  return 'easy';
}

// Categorize all riddles
const updatedRiddles = riddlesData.riddles.map(riddle => {
  return {
    ...riddle,
    difficulty: categorizeRiddle(riddle)
  };
});

// Write back to file
const outputData = {
  riddles: updatedRiddles
};

fs.writeFileSync(riddlesPath, JSON.stringify(outputData, null, 2));

// Count by difficulty and language
const stats = updatedRiddles.reduce((acc, r) => {
  const key = `${r.language}_${r.difficulty}`;
  acc[key] = (acc[key] || 0) + 1;
  return acc;
}, {});

console.log('✅ Fixed riddle difficulty classifications!\n');
console.log('English Riddles:');
console.log(`  🟢 Easy:   ${stats.en_easy || 0}`);
console.log(`  🟡 Medium: ${stats.en_medium || 0}`);
console.log(`  🔴 Hard:   ${stats.en_hard || 0}`);
console.log(`  Total:     ${(stats.en_easy || 0) + (stats.en_medium || 0) + (stats.en_hard || 0)}`);

console.log('\nSpanish Riddles:');
console.log(`  🟢 Fácil:  ${stats.es_easy || 0}`);
console.log(`  🟡 Medio:  ${stats.es_medium || 0}`);
console.log(`  🔴 Difícil: ${stats.es_hard || 0}`);
console.log(`  Total:     ${(stats.es_easy || 0) + (stats.es_medium || 0) + (stats.es_hard || 0)}`);

console.log(`\nGrand Total: ${updatedRiddles.length} riddles`);

// Show distribution percentages
const totalEn = (stats.en_easy || 0) + (stats.en_medium || 0) + (stats.en_hard || 0);
const totalEs = (stats.es_easy || 0) + (stats.es_medium || 0) + (stats.es_hard || 0);

console.log('\nEnglish Distribution:');
console.log(`  Easy:   ${Math.round((stats.en_easy || 0) / totalEn * 100)}%`);
console.log(`  Medium: ${Math.round((stats.en_medium || 0) / totalEn * 100)}%`);
console.log(`  Hard:   ${Math.round((stats.en_hard || 0) / totalEn * 100)}%`);

if (totalEs > 0) {
  console.log('\nSpanish Distribution:');
  console.log(`  Fácil:  ${Math.round((stats.es_easy || 0) / totalEs * 100)}%`);
  console.log(`  Medio:  ${Math.round((stats.es_medium || 0) / totalEs * 100)}%`);
  console.log(`  Difícil: ${Math.round((stats.es_hard || 0) / totalEs * 100)}%`);
}
