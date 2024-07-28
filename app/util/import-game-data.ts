import { Direction, PrismaClient } from "@prisma/client";
import { readFile } from "fs/promises";
import ObjectId from "bson-objectid";
import { PathLike } from "fs";

interface GameData {
  meta: {
    title: string;
    author: string;
    version: string;
    description: string;
    initialData: {
      health?: number;
      stamina?: number;
      attack?: number;
      defense?: number;
    };
  };
  locations: {
    id: string;
    name: string;
    description: string;
    exits: { direction: string; targetId: string }[];
    items: {
      id: string;
      name: string;
      description: string;
      usable: boolean;
      fixed?: boolean;
      pushable?: boolean;
      pickable?: boolean;
      hidden?: boolean;
      effects: {
        description: string;
        stat_changes: { [key: string]: number };
      }[];
    }[];
    characters: {
      id: string;
      name: string;
      description: string;
      dialogue: string[];
      inventory: string[];
    }[];
    events: {
      action: string;
      stat_changes: { [key: string]: number };
    };
  }[];
  player: {
    starting_location: string;
    inventory: {
      id: string;
      name: string;
      description: string;
      usable: boolean;
      fixed?: boolean;
      pushable?: boolean;
      pickable?: boolean;
      hidden?: boolean;
      effects: {
        description: string;
        stat_changes: { [key: string]: number };
      };
    }[];
    stats: {
      health: number;
      stamina: number;
      attack: number;
      defense: number;
    };
  };
}

async function importGameData(
  prisma: PrismaClient,
  userId: number,
  filePath: PathLike
) {
  const data = await readFile(filePath, "utf8");
  const gameData: GameData = JSON.parse(data);
  console.log(`🔎 GameData:\n${gameData}`);

  const entryRoomId = {
    id: gameData.player.starting_location,
    objectId: ObjectId(),
  };

  console.log(`🔎 Entry room ID: ${entryRoomId}`);

  const game = await prisma.game.create({
    data: {
      title: gameData.meta.title,
      author: { connect: { id: userId } },
      description: gameData.meta.description,
      version: gameData.meta.version,
      attack: gameData.meta.initialData.attack || 100,
      defense: gameData.meta.initialData.defense || 100,
      health: gameData.meta.initialData.health || 100,
      stamina: gameData.meta.initialData.stamina || 100,
      entryRoomId: entryRoomId.objectId.str,
    },
  });

  console.log(`🔎 Created game:\n${game}`);

  const itemIds: { id: string; objectId: ObjectId }[] = [];

  for (const location of gameData.locations) {
    for (const item of location.items)
      itemIds.push({ id: item.id, objectId: ObjectId() });
  }

  console.log(`🔎 Item IDs:\n${itemIds}`);

  for (const location of gameData.locations) {
    const room = await prisma.room.create({
      data: {
        id:
          location.id === entryRoomId.id ? entryRoomId.objectId.str : undefined,
        title: location.name,
        description: location.description,
        game: { connect: { id: game.id } },
      },
    });

    console.log(`🔎 Created room:\n${room}`);

    const updatedRoom = await prisma.room.update({
      where: { id: room.id },
      data: {
        exits: {
          createMany: {
            data: location.exits.map((e) => ({
              direction: e.direction as Direction,
              targetId: e.targetId,
            })),
          },
        },
      },
    });

    console.log(`🔎 Created and connected exits to room:\n${updatedRoom}`);

    for (const item of location.items) {
      const itemId = itemIds.filter((e) => e.id === item.id)[0].objectId;

      const updatedRoomWithItems = await prisma.room.update({
        where: { id: room.id },
        data: {
          items: {
            connectOrCreate: {
              where: { id: itemId.str },
              create: {
                id: itemId.str,
                title: item.name,
                description: item.description,
                usable: item.usable,
                fixed: item.fixed,
                pushable: item.pushable,
                pickable: item.pickable,
                hidden: item.hidden,
                effects: {
                  createMany: {
                    data: item.effects.map((e) => ({
                      description: e.description,
                      statChanges: e.stat_changes,
                    })),
                  },
                },
                game: { connect: { id: room.gameId } },
              },
            },
          },
        },
      });

      console.log(
        `🔎 Created and connected items to room:\n${updatedRoomWithItems}`
      );
    }
  }
}

export default importGameData;
