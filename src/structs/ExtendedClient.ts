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

dotenv.config();

export class ExtendedClient extends Client {
  public commands: Collection<string, CommandType> = new Collection();
  public buttons: ComponentsButton = new Collection();
  public select: ComponentsSelect = new Collection();
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
    this.login(process.env.BOT_TOKEN);
  }
  private registerCommands(commands: Array<ApplicationCommandDataResolvable>) {
    this.application
      ?.set(commands)
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
}
