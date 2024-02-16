interface RenderQuoteOptions {
  /**
   * Render quotes above tweet text
   */
  aboveText?: boolean;
}

interface RenderOptions {
  quote?: RenderQuoteOptions;
}

export interface Options {
  render?: RenderOptions;
}
