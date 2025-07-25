import {
  Client,
  Collection,
  IntentsBitField,
  Partials,
  type ApplicationCommandDataResolvable,
  type BitFieldResolvable,
  type GatewayIntentsString,
} from "discord.js";
import dotenv from "dotenv";
import type {
  CommandType,
  ComponentsButton,
  ComponentsModal,
  ComponentsSelect,
} from "./types/Command";
import path from "path";
import fs from "fs";

dotenv.config();

export class ExtendedClient extends Client {
  public commands: Collection<string, CommandType> = new Collection();
  public buttons: ComponentsButton = new Collection();
  public selects: ComponentsSelect = new Collection();
  public modals: ComponentsModal = new Collection();
  constructor() {
    super({
      intents: Object.keys(IntentsBitField.Flags) as BitFieldResolvable<
        GatewayIntentsString,
        number
      >,
      partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.GuildScheduledEvent,
        Partials.Message,
        Partials.Reaction,
        Partials.SoundboardSound,
        Partials.ThreadMember,
        Partials.User,
      ],
    });
  }
  public start() {
    this.registerModules();
    this.login(process.env.BOT_TOKEN);
  }
  private registerCommands(commands: Array<ApplicationCommandDataResolvable>) {
    this.application?.commands
      .set(commands)
      .then(() => {
        console.log("✅ Slash Commands (/) defined".green);
      })
      .catch((error: any) => {
        console.log(
          `❌ An error occurred while trying to set the Slash Commands (/): \n${error}`
            .red
        );
      });
  }
  private registerModules() {
    const slashCommands: Array<ApplicationCommandDataResolvable> = new Array();

    const commandsPath = path.join(__dirname, "..", "commands");
    const fileCondition = (fileName: string) =>
      fileName.endsWith(".ts") || fileName.endsWith(".js");

    fs.readdirSync(commandsPath).forEach((local) => {
      fs.readdirSync(commandsPath + `/`)
        .filter(fileCondition)
        .forEach(async (fileName) => {
          const command: CommandType = (
            await import(`../commands/${local}/${fileName}`)
          )?.default;
          const { name, buttons, selects, modals } = command;

          if (name) {
            this.commands.set(name, command);
            slashCommands.push(command);

            if (buttons)
              buttons.forEach((run, key) => this.buttons.set(key, run));
            if (selects)
              selects.forEach((run, key) => this.selects.set(key, run));
            if (modals) modals.forEach((run, key) => this.modals.set(key, run));
          }
        });
    });

    this.on("ready", () => this.registerCommands(slashCommands));
  }
}
