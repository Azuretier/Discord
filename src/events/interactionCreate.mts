import type { Interaction } from 'discord.js';
import { handleInteractionExtras } from './interactionExtras.mjs';

// Back-compat for older imports
export const handleExecution = async (interaction: Interaction) => {
    await handleInteractionExtras(interaction);
};