import { assert } from "@std/assert";
import { parseArgs } from "@std/cli";
import { format } from "@std/fmt/duration";
import { ensureDirSync } from "@std/fs";
import {
  Creature,
  CreatureUtil,
  NeatOptions
} from "@stsoftware/neat-ai";
import { addTag } from "@stsoftware/tags/mod";
import { faker } from "jsr:@jackfiszr/faker";

const args = parseArgs(Deno.args);

const dir = args.dir ? args.dir : ".creatures";
ensureDirSync(dir);

const creatureFN = ".creature.json";

const creatures = [];
let creature = null;
for (const dirEntry of Deno.readDirSync(dir)) {
  if (dirEntry.name.endsWith(".json")) {
    const json = JSON.parse(Deno.readTextFileSync(dir + "/" + dirEntry.name));
    /** Bring in the cluster creatures. */
     creature = Creature.fromJSON(json);

    creatures.push(creature);
    
  }
}
assert(creature != null);

const options: NeatOptions = {
  creatureStore: dir,
  creatures: creatures,
  creativeThinkingConnectionCount: 1,
  timeoutMinutes: args.timeout ? Math.max(args.timeout, 1) : 60,
  targetError: 0.002,
  populationSize: 50,
  trainingSampleRate: 0.01,
  discoverySampleRate: 0.025,
  sparseRatio:0.075,
  log: 1,
  verbose: true
};

const result = await creature.evolveDir("trainData", options);
console.info(
  `Evolution of ${result.generation} generation${
    result.generation > 1 ? "s" : ""
  } in ${
    format(Math.round(result.time / 1000) * 1000, { ignoreZero: true })
  }, averaging ${
    format(Math.round(result.time / result.generation), { ignoreZero: true })
  }`,
);

Deno.writeTextFileSync(
  ".result.json",
  JSON.stringify(result, null, 1),
);

const uuid = CreatureUtil.makeUUID(creature);
faker.seed(parseInt(uuid.substring(0, 4), 16));
addTag(creature, "name", faker.name.firstName() + " " + faker.name.lastName());

const json = creature.exportJSON();

await Deno.writeTextFile(
  creatureFN,
  JSON.stringify(json, null, 1),
);
Deno.exit(0);
