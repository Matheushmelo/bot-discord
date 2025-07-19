import type {
  ApplicationCommandData,
  ButtonInteraction,
  Collection,
  CommandInteraction,
  CommandInteractionOptionResolver,
  ModalSubmitInteraction,
  StringSelectMenuInteraction,
} from "discord.js";
import type { ExtendedClient } from "../ExtendedClient";

interface CommandProps {
  client: ExtendedClient;
  interaction: CommandInteraction;
  options: CommandInteractionOptionResolver;
}

interface CommandComponents {
  buttons?: ComponentsButton;
  select?: ComponentsSelect;
  modals?: ComponentsModal;
}

export type ComponentsButton = Collection<
  string,
  (interaction: ButtonInteraction) => any
>;
export type ComponentsSelect = Collection<
  string,
  (interaction: StringSelectMenuInteraction) => any
>;
export type ComponentsModal = Collection<
  string,
  (interaction: ModalSubmitInteraction) => any
>;

export type CommandType = ApplicationCommandData &
  CommandComponents & {
    run(props: CommandProps): any;
  };

export class Command {
  constructor(options: CommandType) {
    options.dmPermission = false;
    Object.assign(this, options);
  }
}
