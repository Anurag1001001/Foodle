import Vue from 'vue'
import VueRichTextRenderer from '@marvr/storyblok-rich-text-vue-renderer'
import { Block } from '@marvr/storyblok-rich-text-types'
import HeadingRichText from '~/components/elements/rich-text/HeadingRichText'
import ParagraphRichText from '~/components/elements/rich-text/ParagraphRichText'
import BreakRichText from '~/components/elements/rich-text/BreakRichText'
import OrderedListRichText from '~/components/elements/rich-text/OrderedListRichText'
import ListItemRichText from '~/components/elements/rich-text/ListItemRichText'
import UnorderedListRichText from '~/components/elements/rich-text/UnorderedListRichText'

Vue.use(VueRichTextRenderer, {
  resolvers: {
    blocks: {
      [Block.HEADING]: HeadingRichText,
      [Block.PARAGRAPH]: ParagraphRichText,
      [Block.BR]: BreakRichText,
      [Block.OL_LIST]: OrderedListRichText,
      [Block.UL_LIST]: UnorderedListRichText,
      [Block.LIST_ITEM]: ListItemRichText
    }
  }
})
