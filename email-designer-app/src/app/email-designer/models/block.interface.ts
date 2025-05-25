import { BlockType } from './block-type.enum';
import { BlockStyle } from './block-style.interface';

export interface BaseBlock {
  type: BlockType;
  styles?: BlockStyle;
}

export interface TextBlock extends BaseBlock {
  type: BlockType.Text;
  data: string;
}

export interface ImageBlock extends BaseBlock {
  type: BlockType.Image;
  data: string;
}

export interface VideoBlock extends BaseBlock {
  type: BlockType.Video;
  data: string;
}

export interface SingleColumnBlock extends BaseBlock {
  type: BlockType.SingleColumn;
  data: Block[];
}

export interface MultiColumnBlock extends BaseBlock {
  type: BlockType.MultiColumn;
  data: Block[][];
}

export type Block = TextBlock | ImageBlock | VideoBlock | SingleColumnBlock | MultiColumnBlock;
